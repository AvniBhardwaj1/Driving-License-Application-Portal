# RTO Driving License Portal

A local-first, full-stack demonstration portal for driving-license applications. It models a citizen application workflow, age-based vehicle eligibility, an administrative review queue, and a test payment flow.

## Scope

- Applicant application wizard that survives browser reloads.
- Age-based eligibility:
  - Applicants under 18 may select only **Gearless Two-Wheelers** and must confirm parent or guardian consent.
  - Applicants 18 and over may select every supported category.
- Admin dashboard for viewing, filtering, and updating application status.
- Razorpay test checkout and verified backend webhook handling, exposed locally through ngrok during development.

## Architecture

The repository is intentionally organised by responsibility. HTTP code stays thin, domain rules are centrally enforced, and persistence is isolated.

```
frontend/
  src/
    components/ui/           # Reusable, accessible presentation components
    features/applications/   # Application-specific components, hooks, and types
    hooks/                   # Shared hooks such as local-storage and authentication helpers
    services/                # Axios API client and endpoint services
    store/                   # Global client state

backend/
  api/routes/                # FastAPI request/response controllers
  core/services/             # Application rules and status transitions
  db/models/                 # SQLAlchemy ORM models
  db/repositories/           # Persistence operations
  schemas/                   # Pydantic request and response contracts
```

### Design rules

- React UI components do not contain domain logic; hooks and feature services do.
- Components call the API only through the service layer—never with raw `fetch`.
- FastAPI routes depend on services through `Depends()` and never issue SQL directly.
- Services own age validation and state-transition rules; repositories own database access.
- Data-fetching UI exposes loading, error, populated, and empty states.

## Delivery plan

1. **Backend foundation** — FastAPI, PostgreSQL, SQLAlchemy, Pydantic, and a reusable repository base.
2. **Core business logic** — application services and create/list/status-update API endpoints.
3. **Frontend foundation and UI kit** — Vite, TypeScript, Tailwind, Axios, and reusable primitives.
4. **Applicant wizard** — multi-step application flow, local persistence, and client-side age gating.
5. **Admin dashboard** — protected data table, status filters, and API-backed updates.
6. **Payments** — Razorpay test checkout and webhook verification.

## Local development

Prerequisites will be documented as each phase introduces them. The planned stack is:

- Python 3.11+ and FastAPI
- PostgreSQL
- Node.js 20+ and npm

To start the Phase 1 API and PostgreSQL locally with Docker:

```bash
docker compose up --build
```

The health check is available at `http://localhost:8000/health`. For a non-Docker API run, copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` for your local PostgreSQL instance.

Later payment work needs Razorpay **test** credentials and an ngrok auth token. Keep credentials in local environment files; do not commit them.

## Status

Phase 1 — Backend Foundation: complete.
