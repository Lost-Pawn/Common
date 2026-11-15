# Validation record

Verified on 15 November 2026 against application commit `e914627`. Subsequent documentation commits record these results.

## Automated checks

- Next.js production build and TypeScript check: passed.
- Go unit and PostgreSQL integration tests with `go test -race ./...`: passed after the final demo qualification update.
- Go static analysis with `go vet ./...`: passed.
- Disposable PostgreSQL Docker Compose integration environment: passed.
- Locale dictionary coverage: six locales with 167 matching non-empty keys each.
- Multi-stage Docker build: passed; `common-app-1` and `common-db-1` both healthy.

The integration suite covers member-owned listings, ownership-based access control, ordinary borrowing by unverified members, specialist eligibility, overnight loans, return-date availability and quotas across calendar weeks. Existing coverage includes the supervised sharing lifecycle, private condition photos, competing approvals, operator conflicts, queue exceptions, shared-group quotas, revoked eligibility, extensions, damage holds, reminders, session revocation and help-provider fallback. Reproduction commands are in the README.

## Browser checks

- Published a free general-purpose listing, “Weekend board games,” as a normal member, with category `other` and a 168-hour borrowing limit.
- Verified the listing appears under My listings and checked free-only filtering.
- Verified light and dark themes, including persistence after reload, and selected the Hindi interface.
- Inspected sign-in, discovery and dashboard screens visually.
- Checked the mobile layout at approximately 390 × 844 pixels: no horizontal page overflow; profile-menu logout worked.
- Corrected the entrance animation so fixed dialogs remain anchored to the viewport and rebuilt the frontend.

## Data preservation

The existing named PostgreSQL volume was retained during the Common container rebuild. The final before-and-after comparison found identical counts and content digests for the existing booking (1) and condition records (2). Both containers were healthy afterward. Original resources and sharing history were retained alongside the new general-purpose demo listings.

This checks preservation during the local rebuild with the volume retained; it does not verify disaster recovery or a backup restore. See `UPGRADE.md` for compatibility settings for existing installations.

## Documents and remaining verification

The Common SRS and implementation report were rendered and all three pages of each document were visually inspected.

- Live model generation and translation require external-provider credentials; live-provider calls have not been verified. Mocked success and failure paths passed.
- Render deployment, public access and production credentials have not been exercised.
- Native-speaker translation review, real-user testing and formal accessibility checks remain outstanding.

These results describe the implemented and tested scope, rather than certification of production readiness.
