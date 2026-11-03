export default function SectionTitle({ title, subtitle, center = false }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className={`mt-3 max-w-2xl opacity-75 ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
    </div>
  );
}
