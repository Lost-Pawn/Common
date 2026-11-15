# Upgrading to Common

Common broadens the existing application without deleting listings, bookings, photos or audit history. The local checkout and GitHub repository can retain their original names.

## Existing local database

Before upgrading, back up PostgreSQL and identify the existing volume with `docker volume ls`. The original default was `knitwork_knitwork-data`. Stop the previous app and database containers without removing their volume. Set these values in the untracked `.env` for that original default installation:

```dotenv
POSTGRES_DB=knitwork
POSTGRES_USER=knitwork
POSTGRES_PASSWORD=local-knitwork-only
DATA_VOLUME=knitwork_knitwork-data
```

Use your existing password if it differs. Run `docker compose up --build -d`. Fresh clones default to the `common` database and `common-data` volume. PostgreSQL initialization variables do not rename an existing database or change its password.

Migrations expand loan duration limits and map garment categories into the broader catalogue. Existing resource descriptions and training qualifications remain intact. Local demo seeding adds general-purpose examples without replacing earlier resources. The five fictional demo emails move to `@common.test`; local demo passwords become `CommonDemo2026!` once. Users sign in again because the session cookie is now `common_session`.

## Existing hosted deployment

Retain the existing database connection and service identity. The renamed Render Blueprint describes a fresh deployment; applying its new resource names to an existing deployment can provision separate infrastructure. Update the existing service from the repository, retaining its `DATABASE_URL`, secrets and hostname. Bootstrap administrator settings never reset an existing real account password.

## Repository rename

After renaming the GitHub repository, update the clone URL in README, the Go module path in `backend/go.mod` and your local `origin` URL to the actual new name. They currently point to the working repository at `Lost-Pawn/Knitwork`.
