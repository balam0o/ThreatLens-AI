from fastapi import FastAPI

app = FastAPI(
    title="ThreatLens AI API",
    description="AI-powered defensive cybersecurity log analysis API",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "ThreatLens AI API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }