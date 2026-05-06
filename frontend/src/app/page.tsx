"use client";

import Link from "next/link";
import { useState } from "react";

type AnalysisResponse = {
  severity: string;
  summary: string;
  detected_patterns: string[];
  evidence: string[];
  recommended_actions: string[];
};

type AnalyzerMode = "local" | "ai";

const sampleLog = `Jan 10 12:01:02 server sshd[1234]: Failed password for root from 185.23.44.10 port 52231 ssh2
Jan 10 12:01:05 server sshd[1235]: Failed password for root from 185.23.44.10 port 52232 ssh2
Jan 10 12:01:09 server sshd[1236]: Invalid user admin from 185.23.44.10
Jan 10 12:01:12 server sshd[1237]: Failed password for root from 185.23.44.10 port 52233 ssh2`;

export default function Home() {
  const [logText, setLogText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analyzerMode, setAnalyzerMode] = useState<AnalyzerMode>("local");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAnalyze() {
    setErrorMessage("");
    setAnalysis(null);

    if (!logText.trim()) {
      setErrorMessage("Please paste some logs before running the analysis.");
      return;
    }

    try {
      setIsLoading(true);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

      const endpoint =
        analyzerMode === "ai" ? "/api/analyze-log-ai" : "/api/analyze-log";

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          log_text: logText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ?? "The backend returned an error."
        );
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not connect to the backend.";

      setErrorMessage(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleUseSampleLog() {
    setLogText(sampleLog);
    setAnalysis(null);
    setErrorMessage("");
  }

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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-4">
          <Link
            href="/incidents"
            className="inline-flex w-fit rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            View Incident History
          </Link>
          <div className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            AI-powered defensive cybersecurity
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              ThreatLens AI
            </h1>

            <p className="max-w-3xl text-lg text-slate-300">
              Paste server, SSH, firewall, or authentication logs and get a
              structured security analysis with severity, evidence, and
              recommended defensive actions.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Log Input</h2>
                <p className="text-sm text-slate-400">
                  Paste raw logs or load the sample SSH brute-force attempt.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseSampleLog}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Use sample
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
              <p className="mb-3 text-sm font-medium text-slate-300">
                Analyzer Mode
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnalyzerMode("local");
                    setAnalysis(null);
                    setErrorMessage("");
                  }}
                  className={`rounded-lg border px-4 py-3 text-left transition ${
                    analyzerMode === "local"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <p className="font-semibold">Local Analyzer</p>
                  <p className="text-xs text-slate-400">
                    Fast rule-based analysis
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAnalyzerMode("ai");
                    setAnalysis(null);
                    setErrorMessage("");
                  }}
                  className={`rounded-lg border px-4 py-3 text-left transition ${
                    analyzerMode === "ai"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <p className="font-semibold">AI Analyzer</p>
                  <p className="text-xs text-slate-400">
                    LLM analysis with Groq
                  </p>
                </button>
              </div>
            </div>

            <textarea
              value={logText}
              onChange={(event) => setLogText(event.target.value)}
              placeholder="Paste logs here..."
              className="min-h-80 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            />

            {errorMessage && (
              <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Analyzing..."
                : `Analyze Log with ${
                    analyzerMode === "ai" ? "AI" : "Local Rules"
                  }`}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <h2 className="text-xl font-semibold">Analysis Result</h2>
            <p className="mb-4 text-sm text-slate-400">
              Current mode: {getAnalyzerLabel()}.
            </p>

            {!analysis && (
              <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-slate-500">
                No analysis yet. Paste logs and run the analyzer.
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
                  <p className="text-2xl font-bold uppercase">
                    {analysis.severity}
                  </p>
                </div>

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
        </section>
      </section>
    </main>
  );
}