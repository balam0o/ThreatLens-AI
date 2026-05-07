type AnalyzerModeBadgeProps = {
  mode: "local" | "ai" | string;
};

export function AnalyzerModeBadge({ mode }: AnalyzerModeBadgeProps) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs uppercase text-slate-300">
      {mode}
    </span>
  );
}