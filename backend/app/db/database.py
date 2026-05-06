import json
import sqlite3
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "threatlens.db"


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row

    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                analyzer_mode TEXT NOT NULL,
                source_log TEXT NOT NULL,
                severity TEXT NOT NULL,
                summary TEXT NOT NULL,
                detected_patterns TEXT NOT NULL,
                evidence TEXT NOT NULL,
                recommended_actions TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def create_incident(
    *,
    analyzer_mode: str,
    source_log: str,
    severity: str,
    summary: str,
    detected_patterns: list[str],
    evidence: list[str],
    recommended_actions: list[str],
) -> dict[str, Any]:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO incidents (
                analyzer_mode,
                source_log,
                severity,
                summary,
                detected_patterns,
                evidence,
                recommended_actions
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                analyzer_mode,
                source_log,
                severity,
                summary,
                json.dumps(detected_patterns),
                json.dumps(evidence),
                json.dumps(recommended_actions),
            ),
        )

        incident_id = cursor.lastrowid

    incident = get_incident_by_id(incident_id)

    if incident is None:
        raise RuntimeError("Failed to create incident.")

    return incident


def get_all_incidents() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                analyzer_mode,
                severity,
                summary,
                detected_patterns,
                evidence,
                recommended_actions,
                created_at
            FROM incidents
            ORDER BY created_at DESC
            """
        ).fetchall()

    return [_row_to_incident(row, include_source_log=False) for row in rows]


def get_incident_by_id(incident_id: int) -> dict[str, Any] | None:
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                id,
                analyzer_mode,
                source_log,
                severity,
                summary,
                detected_patterns,
                evidence,
                recommended_actions,
                created_at
            FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        ).fetchone()

    if row is None:
        return None

    return _row_to_incident(row, include_source_log=True)


def _row_to_incident(
    row: sqlite3.Row,
    *,
    include_source_log: bool,
) -> dict[str, Any]:
    incident = {
        "id": row["id"],
        "analyzer_mode": row["analyzer_mode"],
        "severity": row["severity"],
        "summary": row["summary"],
        "detected_patterns": json.loads(row["detected_patterns"]),
        "evidence": json.loads(row["evidence"]),
        "recommended_actions": json.loads(row["recommended_actions"]),
        "created_at": row["created_at"],
    }

    if include_source_log:
        incident["source_log"] = row["source_log"]

    return incident

def delete_incident_by_id(incident_id: int) -> bool:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            DELETE FROM incidents
            WHERE id = ?
            """,
            (incident_id,),
        )

        return cursor.rowcount > 0