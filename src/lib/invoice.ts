import { Booking } from "@/types";

// Optional feature: downloadable PDF receipt
export async function downloadInvoice(b: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  doc.setFontSize(22);
  doc.text("StudioSpace - Booking Invoice", 14, 24);
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text(`Invoice #${b._id.slice(-8).toUpperCase()}`, 14, 32);
  doc.text(`Issued: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`, 14, 38);

  doc.setTextColor(20);
  doc.setFontSize(13);
  const rows: [string, string][] = [
    ["Studio", b.studioTitle],
    ["Booked by", `${b.userName} (${b.userEmail})`],
    ["Start", fmt(b.startAt)],
    ["End", fmt(b.endAt)],
    ["Duration", `${b.hours} hour(s)`],
    ["Status", b.status],
    ["Total paid", `$${b.totalPrice.toFixed(2)}`],
  ];
  let y = 56;
  rows.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold");
    doc.text(k, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(v, 60, y);
    y += 11;
  });
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Total includes the studio rental and the refundable security deposit.", 14, y + 8);
  doc.save(`studiospace-invoice-${b._id.slice(-6)}.pdf`);
}
