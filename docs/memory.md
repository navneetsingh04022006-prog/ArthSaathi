# ArthSaathi Development Memory

## Current Phase
Phase 4 - Financial Calculator

## Status
Phase 4 implemented and tested.

## Completed Work

- Added a deterministic, scheme-aware financial calculator without changing the existing Scheme model.
- Reads interest rate, tenure, loan limits, and moratorium duration from the selected scheme's `financialRules`.
- Added reducing-balance EMI calculation with an explicit zero-interest path.
- Added total principal, estimated total repayment, and estimated total interest calculations.
- Added financial input validation for positive finite loan amounts, non-negative rates, valid tenure, loan limits, and moratorium duration.
- Added final monetary rounding to two decimal places.
- Added `USER`, `SCHEME`, and `CALCULATED` value provenance in the response.
- Exposes moratorium duration and a lender/scheme-dependent treatment note without inventing a moratorium formula.
- Added `POST /api/v1/calculations/emi` using the existing controller, service, repository, validator, route, and centralized error-handling conventions.
- Preserved the existing Scheme model, Phase 1 retrieval APIs, Phase 2 eligibility API, and Phase 3 recommendation API.

## Files Created

- `backend/src/validators/financial.validator.js`
- `backend/src/services/financial.calculator.js`
- `backend/src/services/financial.service.js`
- `backend/src/controllers/financial.controller.js`
- `backend/src/routes/financial.routes.js`
- `backend/test/financial.test.js`

## Files Modified

- `backend/src/app.js`
- `docs/memory.md`

## API Changes

- Added `POST /api/v1/calculations/emi`.
- Request fields: `schemeId` and positive `loanAmount` (or the compatible `requestedLoanAmount` alias).
- Scheme financial parameters remain authoritative; client-supplied interest rate and tenure are not accepted.
- Response uses the existing `{ success, data, message }` and `{ success, error }` formats.
- Validation and financial configuration/business-rule failures return `400` through centralized error handling.
- A missing scheme returns `404` with `SCHEME_NOT_FOUND` after repository lookup.

## Calculation Method

- Standard reducing-balance EMI uses the scheme annual rate converted to a monthly rate and the configured tenure in months.
- Zero interest uses principal divided by configured installments.
- Monetary results are rounded only at final output to two decimal places.

## Tests

- Backend test suite: 34 tests passed.
- Phase 4 tests cover standard EMI, zero interest, loan boundaries, invalid input, missing financial configuration, moratorium handling, rounding, provenance, determinism, and API validation.
- Existing Phase 1, Phase 2, and Phase 3 tests passed.
- Backend ESLint: passed.
- Static error checks: no errors found.

## Known Issues

- Live MongoDB-backed calculator retrieval was not run because this environment has no configured `MONGODB_URI` or local MongoDB executable.
- The current seed data remains explicitly labelled demo data; authoritative government financial terms are not claimed.
- Detailed moratorium repayment treatment remains scheme/lender dependent because the current model stores duration only.

## Next Step
According to `docs/phases.md`:

- Begin Phase 5: Channel Partner System.
