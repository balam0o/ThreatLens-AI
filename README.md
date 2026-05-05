# ThreatLens AI

ThreatLens AI is an AI-powered defensive cybersecurity dashboard for analyzing logs and detecting suspicious activity.

The application supports both local rule-based analysis and LLM-powered analysis with Groq. It classifies log events by severity, extracts evidence, identifies suspicious patterns, and recommends defensive actions.

## Current Status

Initial full-stack MVP completed.

The project currently includes:

- Next.js frontend
- FastAPI backend
- Local rule-based log analyzer
- AI-powered log analyzer using Groq
- Analyzer mode selector in the frontend
- Structured JSON responses for security analysis

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic
- Groq API

### AI

- Rule-based local analyzer
- LLM-powered analyzer with Groq

## Features

- Paste raw logs manually
- Analyze logs using local detection rules
- Analyze logs using an LLM through Groq
- Severity classification: low, medium, high, critical
- Suspicious pattern detection
- Evidence extraction from log lines
- Recommended defensive actions
- Responsive cybersecurity dashboard UI

## Analyzer Modes

ThreatLens AI currently supports two analysis modes.

### Local Analyzer

The Local Analyzer is a fast rule-based analyzer that detects common suspicious log patterns such as:

- Failed SSH login attempts
- Invalid users
- Authentication failures
- Brute-force indicators
- Port scan indicators
- Firewall drops
- Permission issues

This mode does not require an API key.

### AI Analyzer

The AI Analyzer uses Groq to perform LLM-powered defensive cybersecurity analysis.

It returns a structured security assessment with:

- Severity
- Summary
- Detected patterns
- Evidence
- Recommended actions

This mode requires a Groq API key.

## Project Structure

```txt
ThreatLens-AI/
├── frontend/
│   └── src/
│       └── app/
│           ├── layout.tsx
│           └── page.tsx
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── analysis.py
│   │   ├── schemas/
│   │   │   └── analysis.py
│   │   └── services/
│   │       ├── log_analyzer.py
│   │       └── groq_analyzer.py
│   ├── .env.example
│   └── requirements.txt
├── README.md
└── .gitignore
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Do not commit `.env` to Git.

The repository should include `.env.example`, but never the real `.env` file.

## Running the Backend

From the project root:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

API docs:

```txt
http://127.0.0.1:8000/docs
```

## Running the Frontend

From the project root:

```powershell
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

## API Endpoints

### Health Check

```txt
GET /health
```

Returns the backend health status.

### Local Log Analysis

```txt
POST /api/analyze-log
```

Uses the local rule-based analyzer.

Example request:

```json
{
  "log_text": "Jan 10 12:01:02 server sshd[1234]: Failed password for root from 185.23.44.10 port 52231 ssh2"
}
```

### AI Log Analysis

```txt
POST /api/analyze-log-ai
```

Uses the Groq-powered LLM analyzer.

Example response:

```json
{
  "severity": "high",
  "summary": "Multiple failed SSH login attempts from a single IP address.",
  "detected_patterns": [
    "multiple failed login attempts from a single IP",
    "invalid user attempt"
  ],
  "evidence": [
    "Jan 10 12:01:02 server sshd[1234]: Failed password for root from 185.23.44.10 port 52231 ssh2"
  ],
  "recommended_actions": [
    "Block the suspicious IP address.",
    "Enable rate limiting for SSH login attempts.",
    "Review authentication logs.",
    "Enable multi-factor authentication where possible."
  ]
}
```

## Security Notes

- This project is focused only on defensive cybersecurity.
- The AI analyzer should not provide exploit code or offensive instructions.
- API keys must be stored in environment variables.
- Never expose API keys in the frontend.
- Never commit `.env` files.

## Planned Features

- Incident history
- SQLite or PostgreSQL persistence
- Detailed incident pages
- File upload for `.log` and `.txt` files
- Export analysis reports
- Authentication
- Docker support
- Tests for backend and frontend

## License

This project is currently for educational and portfolio purposes.