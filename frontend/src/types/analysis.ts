export type AnalyzerMode = "local" | "ai";

export type Severity = "low" | "medium" | "high" | "critical";

export type AnalysisResponse = {
  id?: number;
  analyzer_mode?: AnalyzerMode;
  created_at?: string;
  severity: Severity;
  summary: string;
  detected_patterns: string[];
  evidence: string[];
  recommended_actions: string[];
};