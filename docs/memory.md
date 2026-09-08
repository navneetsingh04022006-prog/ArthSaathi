# ArthSaathi Development Memory

## Current Phase
Phase 2 - Eligibility Rules Engine

## Status
Phase 2 implemented and tested.

## Completed Work

- Implemented a deterministic eligibility engine independent of AI and database access.
- Added configurable income, purpose, loan amount, age, education, beneficiary category, gender, registration, state, and district rule evaluation where configured.
- Added applicant input validation with distinct validation errors for malformed input.
- Added structured eligible/ineligible results with reasons, failed rule names, and missing requirements.
- Added `POST /api/v1/eligibility/evaluate` using the existing controller, service, repository, validator, route, and centralized error-handling conventions.
- Preserved the existing Scheme model and Phase 1 scheme retrieval behavior.

## Files Created

- `backend/src/validators/eligibility.validator.js`
- `backend/src/services/eligibility.engine.js`
- `backend/src/services/eligibility.service.js`
- `backend/src/controllers/eligibility.controller.js`
- `backend/src/routes/eligibility.routes.js`
- `backend/test/eligibility.test.js`

## Files Modified

- `backend/src/app.js`
- `docs/memory.md`

## API Changes

- Added `POST /api/v1/eligibility/evaluate`.
- Request fields: `schemeId` and `applicant`.
- Response uses the existing `{ success, data, message }` and `{ success, error }` formats.
- Invalid applicant input returns `400` with `VALIDATION_ERROR`.
- A missing scheme returns `404` with `SCHEME_NOT_FOUND` after repository lookup.

## Tests

- Backend test suite: 17 tests passed.
- Eligibility unit tests cover configured rule boundaries, unsupported values, missing requirements, combined failures, optional rules, validation, and determinism.
- Existing Phase 1 health and scheme tests passed.
- Backend ESLint: passed.
- Static error checks for new eligibility files: no errors found.

## Known Issues

- Live MongoDB-backed eligibility evaluation was not run because this environment has no configured `MONGODB_URI` or local MongoDB executable.
- The repository still contains explicitly labelled demo scheme data; authoritative government scheme data is not claimed.

## Next Step
According to `docs/phases.md`:

- Begin Phase 3: Scheme Recommendation Engine.
