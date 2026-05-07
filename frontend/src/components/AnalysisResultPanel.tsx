import Link from "next/link";

import type { AnalysisResponse, AnalyzerMode } from "@/types/analysis";

type AnalysisResultPanelProps = {
  analysis: AnalysisResponse | null;
  analyzerMode: AnalyzerMode;
};

export function AnalysisResultPanel({
  analysis,
  analyzerMode,
}: AnalysisResultPanelProps) {
  function getSeverityStyles(severity: string) {
    const normalizedSeverity = severity.toLowerCase();

    if (normalizedSeverity === "critical") {
      return "border-red-500 bg-red-50 text-red-700";
    }

    if (normalizedSeverity === "high") {
      return "border-orange-500 bg-orange-50 text-orange-700";
    }

    if (normalizedSeverity === "medium") {
      return "border-yellow-500 bg-yellow-50 text-yellow-700";
    }

    return "border-green-500 bg-green-50 text-green-700";
  }

  function getAnalyzerLabel() {
    return analyzerMode === "ai"
      ? "AI Analyzer powered by Groq"
      : "Local rule-based analyzer";
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <h2 className="text-xl font-semibold">Analysis Result</h2>
      <p className="mb-4 text-sm text-slate-400">
        Current mode: {getAnalyzerLabel()}.
      </p>

      {!analysis && (
        <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-slate-500">
          No analysis yet. Paste logs, upload a file, and run the analyzer.
        </div>
      )}

      {analysis && (
        <div className="space-y-5">
          <div
            className={`rounded-xl border px-4 py-3 ${getSeverityStyles(
              analysis.severity
            )}`}
          >
            <p className="text-sm font-medium">Severity</p>
            <p className="text-2xl font-bold uppercase">{analysis.severity}</p>
          </div>

          {analysis.id && (
            <Link
              href={`/incidents/${analysis.id}`}
              className="inline-flex w-full justify-center rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              View Saved Incident #{analysis.id}
            </Link>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-2 font-semibold">Summary</h3>
            <p className="text-slate-300">{analysis.summary}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-2 font-semibold">Detected Patterns</h3>

            {analysis.detected_patterns.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.detected_patterns.map((pattern) => (
                  <span
                    key={pattern}
                    className="rounded-full bg-slate-800 px-3 py-1 text-sm text-cyan-300"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No suspicious patterns detected.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-2 font-semibold">Evidence</h3>

            {analysis.evidence.length > 0 ? (
              <ul className="space-y-2">
                {analysis.evidence.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                No direct evidence lines were extracted.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-2 font-semibold">Recommended Actions</h3>

            <ul className="list-inside list-disc space-y-2 text-slate-300">
              {analysis.recommended_actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}