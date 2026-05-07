"use client";

import Link from "next/link";
import { type ChangeEvent, useState } from "react";

import { AnalysisResultPanel } from "@/components/AnalysisResultPanel";
import { AnalyzerModeSelector } from "@/components/AnalyzerModeSelector";
import { LogFileUpload } from "@/components/LogFileUpload";
import type { AnalysisResponse, AnalyzerMode } from "@/types/analysis";

const sampleLog = `Jan 10 12:01:02 server sshd[1234]: Failed password for root from 185.23.44.10 port 52231 ssh2
Jan 10 12:01:05 server sshd[1235]: Failed password for root from 185.23.44.10 port 52232 ssh2
Jan 10 12:01:09 server sshd[1236]: Invalid user admin from 185.23.44.10
Jan 10 12:01:12 server sshd[1237]: Failed password for root from 185.23.44.10 port 52233 ssh2`;

export default function Home() {
  const [logText, setLogText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analyzerMode, setAnalyzerMode] = useState<AnalyzerMode>("local");
  const [uploadedFileName, setUploadedFileName] = useState("");
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

        throw new Error(errorData?.detail ?? "The backend returned an error.");
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
    setUploadedFileName("");
    setAnalysis(null);
    setErrorMessage("");
  }

  function handleAnalyzerModeChange(mode: AnalyzerMode) {
    setAnalyzerMode(mode);
    setAnalysis(null);
    setErrorMessage("");
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [".log", ".txt"];
    const fileName = file.name.toLowerCase();
    const isAllowedFile = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isAllowedFile) {
      setErrorMessage("Only .log and .txt files are supported.");
      event.target.value = "";
      return;
    }

    try {
      const content = await file.text();

      if (!content.trim()) {
        setErrorMessage("The selected file is empty.");
        event.target.value = "";
        return;
      }

      setLogText(content);
      setUploadedFileName(file.name);
      setAnalysis(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Could not read the selected file.");
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-4">
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

            <div className="flex flex-wrap gap-3">
              <Link
                href="/incidents"
                className="inline-flex w-fit rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                View Incident History
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex w-fit rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Log Input</h2>
                <p className="text-sm text-slate-400">
                  Paste raw logs, upload a file, or load the sample SSH
                  brute-force attempt.
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

            <AnalyzerModeSelector
              analyzerMode={analyzerMode}
              onAnalyzerModeChange={handleAnalyzerModeChange}
            />

            <LogFileUpload
              uploadedFileName={uploadedFileName}
              onFileUpload={handleFileUpload}
            />

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

          <AnalysisResultPanel
            analysis={analysis}
            analyzerMode={analyzerMode}
          />
        </section>
      </section>
    </main>
  );
}