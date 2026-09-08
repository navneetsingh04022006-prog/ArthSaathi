# ArthSaathi Development Memory

## Current Phase
Phase 1 - Database and Scheme Data

## Status
Phase 1 scheme data foundation implemented and statically verified.

## Completed Work

- Added a Mongoose `Scheme` model with structured eligibility rules, financial rules, required documents, application process, source metadata, verification type, status, timestamps, and focused query indexes.
- Added repository, service, controller, validator, and route layers for scheme retrieval.
- Added `GET /api/v1/schemes` with bounded pagination and category, status, state, and sector filters.
- Added `GET /api/v1/schemes/:id` with malformed-ID validation and not-found handling.
- Extended centralized error handling for Mongoose validation errors, invalid IDs, and duplicate scheme identifiers.
- Added an idempotent seed command using explicitly labelled non-authoritative demo configuration data.

## Files Created

- `backend/src/models/Scheme.js`
- `backend/src/repositories/scheme.repository.js`
- `backend/src/services/scheme.service.js`
- `backend/src/controllers/scheme.controller.js`
- `backend/src/routes/scheme.routes.js`
- `backend/src/validators/scheme.validator.js`
- `backend/scripts/seedSchemes.js`
- `backend/test/scheme.test.js`

## Files Modified

- `backend/package.json`
- `backend/src/app.js`
- `backend/src/middleware/error.middleware.js`
- `docs/memory.md`

## Dependencies Added

- No new npm dependency was required for Phase 1. Existing Mongoose, Express, and Supertest dependencies were reused.

## Database Changes

- Added the `schemes` collection model.
- Added indexes for status/category, applicable states/status, and sectors/status.
- Added a reusable seed script that upserts demo records by `schemeId`.

## API Changes

- `GET /api/v1/schemes`
- `GET /api/v1/schemes/:id`

Responses use the existing `{ success, data, message }` and `{ success, error }` formats.

## Seed Data

- Added one explicitly labelled `DEMO` record: `DEMO-MICRO-BUSINESS-001`.
- The record contains no government website, application URL, or claim of verified government information.
- Run with `npm run seed:schemes` from `backend` after setting `MONGODB_URI`.

## Tests

- Backend test suite: 8 tests passed.
- Backend ESLint: passed.
- Static error scan: no errors found in Phase 1 files.
- Seed command configuration failure was verified; this environment has no `MONGODB_URI` or local MongoDB executable, so live database insertion and retrieval were not run.

## Known Issues

- A configured and running MongoDB instance is still required for live scheme insertion and retrieval.
- The demo seed record must be replaced or supplemented with authoritative government data before production use.
- Matching logic, authentication, frontend scheme discovery, and AI remain intentionally unimplemented.

## Next Step
According to `docs/phases.md`:

- Begin Phase 2: Eligibility Rules Engine, keeping eligibility evaluation deterministic and independently testable.
