from pydantic import BaseModel, Field


class LogAnalysisRequest(BaseModel):
    log_text: str = Field(
        ...,
        min_length=1,
        description="Raw log text to analyze",
    )


class LogAnalysisResponse(BaseModel):
    severity: str
    summary: str
    detected_patterns: list[str]
    evidence: list[str]
    recommended_actions: list[str]