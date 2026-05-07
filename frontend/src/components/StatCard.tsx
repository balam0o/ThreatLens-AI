type StatCardProps = {
  label: string;
  value: number | string;
  valueClassName?: string;
};

export function StatCard({ label, value, valueClassName = "" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-4xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}