export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-sm text-slate-300">{subtitle}</p>
    </div>
  );
}
