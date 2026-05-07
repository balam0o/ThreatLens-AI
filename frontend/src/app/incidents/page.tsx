"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AnalyzerModeBadge } from "@/components/AnalyzerModeBadge";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatCard } from "@/components/StatCard";

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

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";
type AnalyzerModeFilter = "all" | "local" | "ai";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [analyzerModeFilter, setAnalyzerModeFilter] =
    useState<AnalyzerModeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredIncidents = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesSeverity =
        severityFilter === "all" || incident.severity === severityFilter;

      const matchesAnalyzerMode =
        analyzerModeFilter === "all" ||
        incident.analyzer_mode === analyzerModeFilter;

      const searchableText = [
        incident.id.toString(),
        incident.severity,
        incident.analyzer_mode,
        incident.summary,
        incident.created_at,
        ...incident.detected_patterns,
        ...incident.evidence,
        ...incident.recommended_actions,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearchQuery ||
        searchableText.includes(normalizedSearchQuery);

      return matchesSeverity && matchesAnalyzerMode && matchesSearch;
    });
  }, [incidents, severityFilter, analyzerModeFilter, searchQuery]);

  const severityCounts = useMemo(() => {
    return incidents.reduce(
      (counts, incident) => {
        counts[incident.severity] += 1;
        return counts;
      },
      {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      }
    );
  }, [incidents]);

  const aiCount = incidents.filter(
    (incident) => incident.analyzer_mode === "ai"
  ).length;

  const localCount = incidents.filter(
    (incident) => incident.analyzer_mode === "local"
  ).length;

  const highRiskCount = severityCounts.high + severityCounts.critical;

  const hasActiveFilters =
    severityFilter !== "all" ||
    analyzerModeFilter !== "all" ||
    searchQuery.trim().length > 0;

  function resetFilters() {
    setSeverityFilter("all");
    setAnalyzerModeFilter("all");
    setSearchQuery("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <PageHeader
          title="Incident History"
          description="Review saved log analyses, filter by severity, compare analyzer modes, and inspect extracted security findings."
          actions={
            <>
              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Dashboard
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Back to Analyzer
              </Link>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Incidents" value={incidents.length} />

          <StatCard
            label="High / Critical"
            value={highRiskCount}
            valueClassName="text-orange-300"
          />

          <StatCard
            label="AI Analyses"
            value={aiCount}
            valueClassName="text-cyan-300"
          />

          <StatCard label="Local Analyses" value={localCount} />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Filters</h2>
              <p className="text-sm text-slate-400">
                Narrow the incident list by severity, analyzer mode, or text.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search summary, evidence, pattern..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="severity"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Severity
              </label>
              <select
                id="severity"
                value={severityFilter}
                onChange={(event) =>
                  setSeverityFilter(event.target.value as SeverityFilter)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              >
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="analyzer-mode"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Analyzer Mode
              </label>
              <select
                id="analyzer-mode"
                value={analyzerModeFilter}
                onChange={(event) =>
                  setAnalyzerModeFilter(
                    event.target.value as AnalyzerModeFilter
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              >
                <option value="all">All modes</option>
                <option value="ai">AI Analyzer</option>
                <option value="local">Local Analyzer</option>
              </select>
            </div>
          </div>
        </section>

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
          <EmptyState message="No incidents saved yet. Run an analysis first." />
        )}

        {!isLoading &&
          !errorMessage &&
          incidents.length > 0 &&
          filteredIncidents.length === 0 && (
            <EmptyState message="No incidents match the current filters." />
          )}

        {!isLoading && filteredIncidents.length > 0 && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <p>
                Showing {filteredIncidents.length} of {incidents.length}{" "}
                incidents
              </p>
            </div>

            {filteredIncidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition hover:border-cyan-400/60 hover:bg-slate-900/80"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={incident.severity} />
                      <AnalyzerModeBadge mode={incident.analyzer_mode} />
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

                  {incident.detected_patterns.length > 4 && (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      +{incident.detected_patterns.length - 4} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}