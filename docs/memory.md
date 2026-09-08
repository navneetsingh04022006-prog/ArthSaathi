# ArthSaathi Development Memory

## Current Phase
Phase 3 - Scheme Recommendation Engine

## Status
Phase 3 implemented and tested.

## Completed Work

- Added a deterministic recommendation service that fetches candidate schemes through the existing repository layer.
- Reused the Phase 2 `evaluateEligibility` engine as the hard eligibility filter; no duplicate eligibility policy was added.
- Added configurable purpose, financial-range, loan-to-project, and location ranking factors.
- Added bounded 0-100 Scheme Match Scores with deterministic tie-breaking by scheme ID.
- Added structured recommendation reasons, score breakdowns, financial metadata, source metadata, and eligibility details.
- Added neutral handling and explanations for missing optional location, project cost, and partner data.
- Added `POST /api/v1/recommendations` using the existing controller, service, validator, route, repository, and centralized error-handling conventions.
- Preserved the existing Scheme model, Phase 1 retrieval APIs, and Phase 2 eligibility API.

## Files Created

- `backend/src/config/recommendation.js`
- `backend/src/services/recommendation.ranker.js`
- `backend/src/services/recommendation.service.js`
- `backend/src/controllers/recommendation.controller.js`
- `backend/src/routes/recommendation.routes.js`
- `backend/src/validators/recommendation.validator.js`
- `backend/test/recommendation.test.js`

## Files Modified

- `backend/src/app.js`
- `backend/src/validators/eligibility.validator.js`
- `docs/memory.md`

## API Changes

- Added `POST /api/v1/recommendations`.
- Accepts an applicant object either as the request body or under `applicant`; `loanAmount` is normalized to the Phase 2 `requestedLoanAmount` field.
- Returns ranked `recommendations`, `totalCandidates`, `totalEligible`, and a clean no-match message when appropriate.
- Recommendation responses use the existing `{ success, data, message }` and `{ success, error }` formats.
- Invalid applicant input returns `400` with `VALIDATION_ERROR`.
- Existing `POST /api/v1/eligibility/evaluate` remains unchanged.

## Ranking Configuration

- `purposeFit`: 35
- `financialFit`: 25
- `loanAmountFit`: 25
- `locationFit`: 15
- Partner availability is not scored because the partner module/data does not exist yet.
- Weights are centralized in `backend/src/config/recommendation.js` and normalized over active factors.

## Tests

- Backend test suite: 25 tests passed.
- Phase 3 tests cover eligibility filtering, purpose and financial ranking, configurable weights, deterministic scores, reasons, missing optional data, empty/no-match results, validation, and API errors.
- Existing Phase 1 and Phase 2 tests passed.
- Backend ESLint: passed.
- Static error checks: no errors found.

## Known Issues

- Live MongoDB-backed recommendation retrieval was not run because this environment has no configured `MONGODB_URI` or local MongoDB executable.
- The current seed data remains explicitly labelled demo data; authoritative government scheme data is not claimed.
- Location scoring uses configured scheme applicability only; real geospatial routing and partner availability are deferred to later phases.

## Next Step
According to `docs/phases.md`:

- Begin Phase 4: Financial Calculator.
