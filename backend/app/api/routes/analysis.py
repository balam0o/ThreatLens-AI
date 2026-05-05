import traceback

from fastapi import APIRouter, HTTPException

from app.schemas.analysis import LogAnalysisRequest, LogAnalysisResponse
from app.services.groq_analyzer import analyze_log_text_with_groq
from app.services.log_analyzer import analyze_log_text

router = APIRouter()


@router.post("/analyze-log", response_model=LogAnalysisResponse)
def analyze_log(request: LogAnalysisRequest):
    return analyze_log_text(request.log_text)


@router.post("/analyze-log-ai", response_model=LogAnalysisResponse)
def analyze_log_ai(request: LogAnalysisRequest):
    try:
        return analyze_log_text_with_groq(request.log_text)
    except Exception as error:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        ) from error