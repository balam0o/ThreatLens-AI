# ThreatLens AI

ThreatLens AI is an AI-powered defensive cybersecurity dashboard for analyzing logs and detecting suspicious activity.

The application supports both local rule-based analysis and LLM-powered analysis with Groq. It classifies log events by severity, extracts evidence, identifies suspicious patterns, recommends defensive actions, stores incidents locally, and provides dashboard, history, detail, deletion, and Markdown report export features.

## Current Status

Full-stack MVP completed.

The project currently includes:

- Next.js frontend
- FastAPI backend
- Local rule-based log analyzer
- AI-powered log analyzer using Groq
- Analyzer mode selector in the frontend
- Log upload support for `.log` and `.txt` files
- SQLite incident persistence
- Incident history page
- Incident detail page
- Incident deletion
- Markdown incident report export
- Security dashboard
- Backend tests with pytest
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
- SQLite
- Groq API

### Testing

- pytest
- FastAPI TestClient
- httpx

### AI

- Rule-based local analyzer
- LLM-powered analyzer with Groq

## Features

- Paste raw logs manually
- Upload `.log` and `.txt` files
- Analyze logs using local detection rules
- Analyze logs using an LLM through Groq
- Severity classification: low, medium, high, critical
- Suspicious pattern detection
- Evidence extraction from log lines
- Recommended defensive actions
- Save incident history in SQLite
- View incident history
- Filter incidents by severity, analyzer mode, and search text
- View incident details
- Delete saved incidents
- Export incident reports as Markdown
- Copy incident reports to clipboard
- View dashboard statistics
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
- Malware indicators
- Data exfiltration indicators

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
│           ├── dashboard/
│           │   └── page.tsx
│           ├── incidents/
│           │   ├── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── layout.tsx
│           └── page.tsx
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── analysis.py
│   │   ├── db/
│   │   │   └── database.py
│   │   ├── schemas/
│   │   │   └── analysis.py
│   │   └── services/
│   │       ├── log_analyzer.py
│   │       └── groq_analyzer.py
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_log_analyzer.py
│   ├── .env.example
│   ├── pytest.ini
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

## Main Frontend Routes

```txt
/                  Main analyzer page
/dashboard         Security dashboard
/incidents         Incident history
/incidents/[id]    Incident detail and Markdown report export
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

Uses the local rule-based analyzer and saves the result as an incident.

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

Uses the Groq-powered LLM analyzer and saves the result as an incident.

Example response:

```json
{
  "id": 1,
  "analyzer_mode": "ai",
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
  ],
  "created_at": "2026-05-04 18:30:00"
}
```

### List Incidents

```txt
GET /api/incidents
```

Returns all saved incidents.

### Get Incident Detail

```txt
GET /api/incidents/{incident_id}
```

Returns a saved incident, including the original source log.

### Delete Incident

```txt
DELETE /api/incidents/{incident_id}
```

Deletes a saved incident.

## Running Backend Tests

From the `backend/` directory:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pytest -q
```

The tests cover:

- Health check endpoint
- Local log analysis
- Incident creation
- Incident history
- Incident detail
- Incident deletion
- AI analysis endpoint using a mocked Groq analyzer
- Rule-based severity detection

The AI endpoint test does not call Groq directly, so it does not consume API requests.

## Security Notes

- This project is focused only on defensive cybersecurity.
- The AI analyzer should not provide exploit code or offensive instructions.
- API keys must be stored in environment variables.
- Never expose API keys in the frontend.
- Never commit `.env` files.
- The local SQLite database is ignored by Git.
- The Groq key is only used in the backend.

## Git Ignore Notes

The project should ignore:

```txt
backend/.env
backend/data/
backend/*.db
node_modules/
.next/
.venv/
__pycache__/
```

## Planned Features

- Docker support
- Backend service layer cleanup
- Frontend reusable components
- Better dashboard charts
- PDF report export
- Authentication
- PostgreSQL support
- Deployment guide
- CI workflow with GitHub Actions

## License

This project is currently for educational and portfolio purposes.
