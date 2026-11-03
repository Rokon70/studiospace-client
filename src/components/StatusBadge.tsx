import { BookingStatus } from "@/types";

const styles: Record<BookingStatus, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-info",
  Completed: "badge-success",
  Cancelled: "badge-error",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge ${styles[status]}`}>{status}</span>;
}
