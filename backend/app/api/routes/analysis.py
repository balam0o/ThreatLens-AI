from fastapi import APIRouter

from app.schemas.analysis import LogAnalysisRequest, LogAnalysisResponse
from app.services.log_analyzer import analyze_log_text

router = APIRouter()


@router.post("/analyze-log", response_model=LogAnalysisResponse)
def analyze_log(request: LogAnalysisRequest):
    return analyze_log_text(request.log_text)