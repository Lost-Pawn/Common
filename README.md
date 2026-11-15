# Common

**Good things, shared.**

Common is a community resource-sharing app for borrowing what you need and lending what you have—from books and tools to electronics, outdoor gear, household items and shared spaces.

Built with **Next.js, TypeScript, Go, PostgreSQL and Docker**.

## How it works

1. **Share something useful.** Any signed-in member can publish a listing with availability, a borrowing limit and an optional hourly rate.
2. **Find and request it.** Browse categories, search listings and filter for free items. Requests require owner or manager approval.
3. **Borrow and return.** Record condition photos, confirm returns and keep a history of each loan.

Members manage requests for their own listings. Everyday resources support ordinary borrowing; specialist resources can require training, verification or operator supervision.

## Features

- Eight categories: tools, electronics, outdoors, books, home and gatherings, spaces, creative, and other useful things.
- Hourly and overnight loans of up to seven days, subject to each listing's limits and availability.
- Booking conflict checks, waiting lists and weekly allocation limits, including loans spanning multiple weeks.
- Condition records, return confirmation, incident reporting and activity history.
- Responsive layouts, light and dark themes, subtle motion and reduced-motion support.
- Interfaces in English, Hindi, Marathi, Bengali, Tamil and Telugu.
- Help answers with references; optional AI-generated answers and user-content translation.

## Quick start

Install Docker with Docker Compose, then run:

```bash
git clone https://github.com/Lost-Pawn/Common.git
cd Common
docker compose up --build -d --wait
```

Open [Common at localhost:8080](http://localhost:8080). Check service health at [localhost:8080/api/health](http://localhost:8080/api/health).

Upgrading from Knitwork? Follow the [upgrade guide](docs/UPGRADE.md) before changing database or volume settings.

### Demo accounts

The local Docker setup includes sample listings and the accounts below. All use the password **`CommonDemo2026!`**. The sign-in screen also offers demo shortcuts.

| Account | Email |
| --- | --- |
| Member | `asha@common.test` |
| Trained member | `ravi@common.test` |
| Manager | `manager@common.test` |
| Owner | `owner@common.test` |
| Administrator | `admin@common.test` |

The owner role is available for demonstration; every member can publish listings.

### Stop and restart

```bash
docker compose down
docker compose up -d --wait
```

PostgreSQL stores application data and condition photos in a persistent named volume. `docker compose down` retains it; adding `-v` deletes it.

## Configuration

The default local setup works without a `.env` file. For a fresh installation, copy [.env.example](.env.example) to `.env` and adjust the settings you need. Existing installations should retain their current database settings as described in the [upgrade guide](docs/UPGRADE.md).

| Settings | Purpose |
| --- | --- |
| `APP_PORT`, `DB_PORT` | Local app and database ports; defaults are `8080` and `5434`. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Local database connection settings. |
| `DATA_VOLUME` | Persistent database volume; fresh installations default to `common-data`. |
| `HELP_API_BASE_URL`, `HELP_API_KEY`, `HELP_MODEL` | Optional OpenAI-compatible provider for generated help and user-content translation. |

Local help and the six interface translations work without external credentials. For optional AI features, use an HTTPS API base ending in `/v1`, without `/chat/completions`, and keep credentials in the untracked `.env` file.

## Development and checks

Run these commands from the repository root. Frontend checks require Node.js and npm; backend integration checks use Docker and a disposable PostgreSQL database.

```bash
# Install frontend dependencies and check the production build.
cd frontend
npm ci
npm run build
cd ..

# Check that all interface languages have matching translation keys.
node scripts/check-locales.mjs

# Run Go tests against a disposable database.
docker compose -p common-test -f compose.test.yaml up --abort-on-container-exit --exit-code-from test
docker compose -p common-test -f compose.test.yaml down
```

See the [validation record](docs/VALIDATION.md) for completed checks and remaining verification.

| Path | Contents |
| --- | --- |
| `frontend/` | Next.js interface, styles and translations. |
| `backend/` | Go API, database migrations and tests. |
| `scripts/` | Repository checks. |
| `docs/` | Requirements, API reference, demo walkthrough and reports. |
| `compose.yaml` | Local app and persistent PostgreSQL setup. |
| `compose.test.yaml` | Disposable backend integration environment. |
| `render.yaml` | Hosted deployment Blueprint. |

## Deployment

For a fresh Render deployment, create a Blueprint from [render.yaml](render.yaml), supply `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then deploy and check `/api/health`. The Blueprint provisions paid persistent PostgreSQL and a Docker web service, with demo seeding disabled. Set `APP_ORIGIN` when using a custom domain.

For an existing hosted installation, retain the service identity and database connection. Follow the [upgrade guide](docs/UPGRADE.md); the renamed Blueprint describes new infrastructure.

## Documentation

- [Requirements](docs/SRS.md) · [Word version](docs/Common-SRS.docx)
- [Implementation report](docs/REPORT.md) · [Word version](docs/Common-Report.docx)
- [API reference](docs/API.md)
- [Demo walkthrough](docs/DEMO.md)
- [Upgrade and repository rename guide](docs/UPGRADE.md)
- [Validation record](docs/VALIDATION.md)
