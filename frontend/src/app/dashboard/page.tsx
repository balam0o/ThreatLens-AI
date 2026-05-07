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

type Severity = "critical" | "high" | "medium" | "low";

export default function DashboardPage() {
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
          throw new Error("Could not load dashboard data.");
        }

        const data: Incident[] = await response.json();
        setIncidents(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while loading dashboard data.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  const stats = useMemo(() => {
    const severityCounts: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    let aiCount = 0;
    let localCount = 0;

    for (const incident of incidents) {
      severityCounts[incident.severity] += 1;

      if (incident.analyzer_mode === "ai") {
        aiCount += 1;
      } else {
        localCount += 1;
      }
    }

    const highRiskCount = severityCounts.critical + severityCounts.high;

    return {
      total: incidents.length,
      severityCounts,
      aiCount,
      localCount,
      highRiskCount,
    };
  }, [incidents]);

  const recentHighRiskIncidents = useMemo(() => {
    return incidents
      .filter(
        (incident) =>
          incident.severity === "critical" || incident.severity === "high"
      )
      .slice(0, 5);
  }, [incidents]);

  const maxSeverityCount = Math.max(
    1,
    stats.severityCounts.critical,
    stats.severityCounts.high,
    stats.severityCounts.medium,
    stats.severityCounts.low
  );

  function getRiskMessage() {
    if (stats.total === 0) {
      return "No incident data available yet.";
    }

    if (stats.highRiskCount === 0) {
      return "Current saved incidents show no high-risk findings.";
    }

    if (stats.highRiskCount >= 5) {
      return "Multiple high-risk incidents detected. Prioritize investigation.";
    }

    return "Some high-risk incidents exist. Review them before clearing the backlog.";
  }

  function renderSeverityBar(label: Severity) {
    const count = stats.severityCounts[label];
    const widthPercentage = (count / maxSeverityCount) * 100;

    return (
      <div key={label} className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="capitalize text-slate-300">{label}</span>
          <span className="font-semibold text-slate-100">{count}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <PageHeader
          title="Security Dashboard"
          description="Overview of saved log analyses, severity distribution, analyzer usage, and high-risk findings."
          actions={
            <>
              <Link
                href="/incidents"
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Incident History
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                New Analysis
              </Link>
            </>
          }
        />

        {isLoading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Incidents" value={stats.total} />

              <StatCard
                label="High Risk"
                value={stats.highRiskCount}
                valueClassName="text-orange-300"
              />

              <StatCard
                label="AI Analyses"
                value={stats.aiCount}
                valueClassName="text-cyan-300"
              />

              <StatCard label="Local Analyses" value={stats.localCount} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-xl font-semibold">
                  Severity Distribution
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Saved incidents grouped by severity level.
                </p>

                <div className="mt-6 space-y-5">
                  {renderSeverityBar("critical")}
                  {renderSeverityBar("high")}
                  {renderSeverityBar("medium")}
                  {renderSeverityBar("low")}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-xl font-semibold">Analyzer Usage</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Comparison between local rule-based analysis and LLM analysis.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-5">
                    <p className="text-sm text-cyan-300">AI Analyzer</p>
                    <p className="mt-2 text-4xl font-bold">{stats.aiCount}</p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Local Analyzer</p>
                    <p className="mt-2 text-4xl font-bold">
                      {stats.localCount}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Assessment</p>
                  <p className="mt-2 text-slate-200">{getRiskMessage()}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recent High-Risk Incidents
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Latest critical and high severity findings.
                  </p>
                </div>

                <Link
                  href="/incidents"
                  className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  View all
                </Link>
              </div>

              {recentHighRiskIncidents.length === 0 && (
                <EmptyState message="No high-risk incidents saved yet." />
              )}

              {recentHighRiskIncidents.length > 0 && (
                <div className="grid gap-4">
                  {recentHighRiskIncidents.map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/incidents/${incident.id}`}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400/60"
                    >
                      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <SeverityBadge severity={incident.severity} />
                          <AnalyzerModeBadge mode={incident.analyzer_mode} />

                          <span className="text-sm font-semibold text-slate-100">
                            Incident #{incident.id}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          {incident.created_at}
                        </p>
                      </div>

                      <p className="text-sm text-slate-300">
                        {incident.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}