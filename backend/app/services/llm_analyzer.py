import os

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas.analysis import LogAnalysisResponse

load_dotenv()


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
"""


def analyze_log_text_with_llm(log_text: str) -> LogAnalysisResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=api_key)

    response = client.responses.parse(
        model=model,
        input=[
            {
                "role": "system",
                "content": SYSTEM_INSTRUCTIONS,
            },
            {
                "role": "user",
                "content": f"Analyze the following logs:\n\n{log_text}",
            },
        ],
        text_format=LogAnalysisResponse,
        max_output_tokens=700,
    )

    if response.output_parsed is None:
        raise RuntimeError("The LLM did not return a valid structured response.")

    return response.output_parsed