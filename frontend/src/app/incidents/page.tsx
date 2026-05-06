"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Incident = {
  id: number;
  analyzer_mode: "local" | "ai";
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  detected_patterns: string[];
  evidence: string[];
  recommended_actions: string[];
  created_at: string;
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

        const response = await fetch(`${apiUrl}/api/incidents`);

        if (!response.ok) {
          throw new Error("Could not load incident history.");
        }

        const data: Incident[] = await response.json();
        setIncidents(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while loading incidents.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  function getSeverityStyles(severity: string) {
    if (severity === "critical") {
      return "border-red-500 bg-red-500/10 text-red-300";
    }

    if (severity === "high") {
      return "border-orange-500 bg-orange-500/10 text-orange-300";
    }

    if (severity === "medium") {
      return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
    }

    return "border-green-500 bg-green-500/10 text-green-300";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm text-cyan-300">ThreatLens AI</p>
            <h1 className="text-4xl font-bold tracking-tight">
              Incident History
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Review previously analyzed logs, severity levels, analyzer mode,
              and extracted security findings.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Back to Analyzer
          </Link>
        </header>

        {isLoading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading incidents...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && incidents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
            No incidents saved yet. Run an analysis first.
          </div>
        )}

        {!isLoading && incidents.length > 0 && (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition hover:border-cyan-400/60 hover:bg-slate-900/80"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getSeverityStyles(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>

                      <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300 uppercase">
                        {incident.analyzer_mode}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold">
                      Incident #{incident.id}
                    </h2>
                  </div>

                  <p className="text-sm text-slate-500">
                    {incident.created_at}
                  </p>
                </div>

                <p className="mb-4 text-slate-300">{incident.summary}</p>

                <div className="flex flex-wrap gap-2">
                  {incident.detected_patterns.slice(0, 4).map((pattern) => (
                    <span
                      key={pattern}
                      className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}