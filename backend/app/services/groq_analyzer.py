import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

from app.schemas.analysis import LogAnalysisResponse

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


SYSTEM_INSTRUCTIONS = """
You are a defensive cybersecurity analyst.

Analyze the provided logs and return a structured security assessment.

Rules:
- Focus only on defensive cybersecurity.
- Do not provide exploit code.
- Do not provide offensive instructions.
- Identify suspicious patterns.
- Extract direct evidence from the logs.
- Classify severity as one of: low, medium, high, critical.
- Recommend practical defensive actions.
- If the logs are benign or inconclusive, say so clearly.

Return only valid JSON with this exact structure:
{
  "severity": "low | medium | high | critical",
  "summary": "short human-readable summary",
  "detected_patterns": ["pattern 1", "pattern 2"],
  "evidence": ["log line 1", "log line 2"],
  "recommended_actions": ["action 1", "action 2"]
}
"""


def analyze_log_text_with_groq(log_text: str) -> LogAnalysisResponse:
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    client = Groq(api_key=api_key)

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_INSTRUCTIONS,
            },
            {
                "role": "user",
                "content": f"Analyze the following logs:\n\n{log_text}",
            },
        ],
        temperature=0.1,
        max_completion_tokens=700,
        response_format={"type": "json_object"},
    )

    content = completion.choices[0].message.content

    if not content:
        raise RuntimeError("Groq returned an empty response.")

    parsed_json = _parse_json_response(content)

    return LogAnalysisResponse.model_validate(parsed_json)


def _parse_json_response(content: str) -> dict:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        json_match = re.search(r"\{.*\}", content, re.DOTALL)

        if not json_match:
            raise RuntimeError("Could not find valid JSON in the Groq response.")

        return json.loads(json_match.group(0))