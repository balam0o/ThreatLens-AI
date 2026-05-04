# ThreatLens AI

ThreatLens AI is an AI-powered defensive cybersecurity dashboard for analyzing logs and detecting suspicious activity.

## Current Status

Initial full-stack project structure created.

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic
- OpenAI API

## Planned Features

- Paste logs manually
- AI-based log analysis
- Severity classification
- Evidence extraction
- Recommended defensive actions
- Incident dashboard
- Incident history
- PostgreSQL database
- Docker support

## Project Structure

```txt
ThreatLens-AI/
├── frontend/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── .venv/
│   └── requirements.txt
├── README.md
└── .gitignore
```

## Running the Backend

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

```powershell
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```
