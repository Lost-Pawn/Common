# Common

Borrow useful things. Share what you have. Common helps people lend tools, books, electronics, outdoor gear, household items and spaces, with owner approvals and a recorded return.

**Stack:** Next.js · TypeScript · Go REST API · PostgreSQL · Docker

- Any signed-in member can create listings and manage requests for their own resources.
- Search by category, location or description; filter free items and your own listings.
- Hourly or overnight borrowing up to seven days, with conflict checks, waiting lists and weekly limits.
- Condition photos, return confirmation, incidents and activity history.
- Classic light and dark themes, responsive layouts and six Indian interface languages.
- Cited help chat; optional generated answers and user-content translation.

## Run locally

Requires Docker and Docker Compose.

```bash
git clone https://github.com/Lost-Pawn/Knitwork.git
cd Knitwork
docker compose up --build -d
```

Open [localhost:8080](http://localhost:8080). The GitHub repository currently retains its original name; the product is **Common**.

All local demo accounts use **`CommonDemo2026!`**:

| Account | Email |
| --- | --- |
| Member | `asha@common.test` |
| Trained member | `ravi@common.test` |
| Manager | `manager@common.test` |
| Owner | `owner@common.test` |
| Administrator | `admin@common.test` |

Data and condition photos persist in PostgreSQL. Stop with `docker compose down`; adding `-v` removes the database volume.

## Configuration and deployment

Copy [.env.example](.env.example) to `.env` to change ports or enable optional AI features. Local help and interface translations work without external credentials. Generated answers and user-content translation need `HELP_API_BASE_URL`, `HELP_API_KEY` and `HELP_MODEL`.

For Render, create a Blueprint from [render.yaml](render.yaml), supply `ADMIN_EMAIL` and `ADMIN_PASSWORD`, deploy and check `/api/health`. The Blueprint uses paid persistent PostgreSQL and a Docker web service. Production disables demo accounts. Set `APP_ORIGIN` when using a custom domain.

Existing installations: follow [the upgrade guide](docs/UPGRADE.md) to retain the original database volume. Do not rename an existing Render database simply to change the product name.

## Checks

```bash
cd frontend
npm ci
npm run build
cd ..
node scripts/check-locales.mjs
docker compose -p common-test -f compose.test.yaml up --abort-on-container-exit --exit-code-from test
docker compose -p common-test -f compose.test.yaml down
```

`frontend/` contains the interface; `backend/` contains the API and migrations.

[Requirements](docs/SRS.md) · [API](docs/API.md) · [Demo](docs/DEMO.md) · [Report](docs/REPORT.md) · [Validation](docs/VALIDATION.md)
