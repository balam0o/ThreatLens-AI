from typing import Literal

from pydantic import BaseModel, Field


SeverityLevel = Literal["low", "medium", "high", "critical"]
AnalyzerMode = Literal["local", "ai"]


class LogAnalysisRequest(BaseModel):
    log_text: str = Field(
        ...,
        min_length=1,
        description="Raw log text to analyze",
    )


class LogAnalysisResponse(BaseModel):
    severity: SeverityLevel
    summary: str
    detected_patterns: list[str]
    evidence: list[str]
    recommended_actions: list[str]


class IncidentResponse(LogAnalysisResponse):
    id: int
    analyzer_mode: AnalyzerMode
    created_at: str


class IncidentDetailResponse(IncidentResponse):
    source_log: str