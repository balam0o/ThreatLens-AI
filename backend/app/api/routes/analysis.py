import traceback

from fastapi import APIRouter, HTTPException

from app.db.database import (
    create_incident,
    delete_incident_by_id,
    get_all_incidents,
    get_incident_by_id,
)
from app.schemas.analysis import (
    IncidentDetailResponse,
    IncidentResponse,
    LogAnalysisRequest,
    LogAnalysisResponse,
)
from app.services.groq_analyzer import analyze_log_text_with_groq
from app.services.log_analyzer import analyze_log_text

router = APIRouter()


@router.post("/analyze-log", response_model=IncidentResponse)
def analyze_log(request: LogAnalysisRequest):
    analysis = analyze_log_text(request.log_text)

    incident = create_incident(
        analyzer_mode="local",
        source_log=request.log_text,
        severity=analysis.severity,
        summary=analysis.summary,
        detected_patterns=analysis.detected_patterns,
        evidence=analysis.evidence,
        recommended_actions=analysis.recommended_actions,
    )

    return incident


@router.post("/analyze-log-ai", response_model=IncidentResponse)
def analyze_log_ai(request: LogAnalysisRequest):
    try:
        analysis = analyze_log_text_with_groq(request.log_text)

        incident = create_incident(
            analyzer_mode="ai",
            source_log=request.log_text,
            severity=analysis.severity,
            summary=analysis.summary,
            detected_patterns=analysis.detected_patterns,
            evidence=analysis.evidence,
            recommended_actions=analysis.recommended_actions,
        )

        return incident

    except Exception as error:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        ) from error


@router.get("/incidents", response_model=list[IncidentResponse])
def list_incidents():
    return get_all_incidents()


@router.get("/incidents/{incident_id}", response_model=IncidentDetailResponse)
def get_incident(incident_id: int):
    incident = get_incident_by_id(incident_id)

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found.",
        )

    return incident

@router.delete("/incidents/{incident_id}")
def delete_incident(incident_id: int):
    was_deleted = delete_incident_by_id(incident_id)

    if not was_deleted:
        raise HTTPException(
            status_code=404,
            detail="Incident not found.",
        )

    return {
        "message": "Incident deleted successfully.",
        "incident_id": incident_id,
    }