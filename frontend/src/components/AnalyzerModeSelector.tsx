import type { AnalyzerMode } from "@/types/analysis";

type AnalyzerModeSelectorProps = {
  analyzerMode: AnalyzerMode;
  onAnalyzerModeChange: (mode: AnalyzerMode) => void;
};

export function AnalyzerModeSelector({
  analyzerMode,
  onAnalyzerModeChange,
}: AnalyzerModeSelectorProps) {
  return (
    <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="mb-3 text-sm font-medium text-slate-300">Analyzer Mode</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAnalyzerModeChange("local")}
          className={`rounded-lg border px-4 py-3 text-left transition ${
            analyzerMode === "local"
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
              : "border-slate-700 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <p className="font-semibold">Local Analyzer</p>
          <p className="text-xs text-slate-400">Fast rule-based analysis</p>
        </button>

        <button
          type="button"
          onClick={() => onAnalyzerModeChange("ai")}
          className={`rounded-lg border px-4 py-3 text-left transition ${
            analyzerMode === "ai"
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
              : "border-slate-700 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <p className="font-semibold">AI Analyzer</p>
          <p className="text-xs text-slate-400">LLM analysis with Groq</p>
        </button>
      </div>
    </div>
  );
}