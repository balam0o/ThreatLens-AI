import pytest
from fastapi.testclient import TestClient

from app.db import database
from app.main import app
from app.schemas.analysis import LogAnalysisResponse
from app.api.routes import analysis as analysis_routes


@pytest.fixture()
def client(tmp_path, monkeypatch):
    test_data_dir = tmp_path / "data"
    test_db_path = test_data_dir / "test_threatlens.db"

    monkeypatch.setattr(database, "DATA_DIR", test_data_dir)
    monkeypatch.setattr(database, "DB_PATH", test_db_path)

    with TestClient(app) as test_client:
        yield test_client


def test_health_check(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_local_log_analysis_creates_incident(client):
    payload = {
        "log_text": (
            "Jan 10 12:01:02 server sshd[1234]: "
            "Failed password for root from 185.23.44.10 port 52231 ssh2"
        )
    }

    response = client.post("/api/analyze-log", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["id"] >= 1
    assert data["analyzer_mode"] == "local"
    assert data["severity"] == "high"
    assert "failed password" in data["detected_patterns"]
    assert "created_at" in data


def test_incident_history_returns_saved_incidents(client):
    payload = {
        "log_text": (
            "Jan 10 12:01:02 server sshd[1234]: "
            "Invalid user admin from 185.23.44.10"
        )
    }

    create_response = client.post("/api/analyze-log", json=payload)
    assert create_response.status_code == 200

    history_response = client.get("/api/incidents")
    assert history_response.status_code == 200

    incidents = history_response.json()

    assert len(incidents) == 1
    assert incidents[0]["analyzer_mode"] == "local"
    assert incidents[0]["severity"] == "high"


def test_incident_detail_includes_source_log(client):
    payload = {
        "log_text": (
            "Jan 10 12:01:02 server sshd[1234]: "
            "Failed password for root from 185.23.44.10 port 52231 ssh2"
        )
    }

    create_response = client.post("/api/analyze-log", json=payload)
    created_incident = create_response.json()
    incident_id = created_incident["id"]

    detail_response = client.get(f"/api/incidents/{incident_id}")

    assert detail_response.status_code == 200

    detail = detail_response.json()

    assert detail["id"] == incident_id
    assert detail["source_log"] == payload["log_text"]


def test_delete_incident_removes_it_from_history(client):
    payload = {
        "log_text": (
            "Jan 10 12:01:02 server sshd[1234]: "
            "Failed password for root from 185.23.44.10 port 52231 ssh2"
        )
    }

    create_response = client.post("/api/analyze-log", json=payload)
    incident_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/incidents/{incident_id}")
    assert delete_response.status_code == 200

    detail_response = client.get(f"/api/incidents/{incident_id}")
    assert detail_response.status_code == 404


def test_ai_log_analysis_creates_incident_without_calling_groq(client, monkeypatch):
    def fake_groq_analyzer(log_text: str) -> LogAnalysisResponse:
        return LogAnalysisResponse(
            severity="high",
            summary="Mocked AI analysis detected suspicious SSH activity.",
            detected_patterns=["mocked brute force"],
            evidence=[log_text],
            recommended_actions=[
                "Block the suspicious source IP.",
                "Review authentication logs.",
            ],
        )

    monkeypatch.setattr(
        analysis_routes,
        "analyze_log_text_with_groq",
        fake_groq_analyzer,
    )

    payload = {
        "log_text": (
            "Jan 10 12:01:02 server sshd[1234]: "
            "Failed password for root from 185.23.44.10 port 52231 ssh2"
        )
    }

    response = client.post("/api/analyze-log-ai", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["analyzer_mode"] == "ai"
    assert data["severity"] == "high"
    assert data["summary"] == "Mocked AI analysis detected suspicious SSH activity."
    assert "mocked brute force" in data["detected_patterns"]