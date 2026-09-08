# ArthSaathi Development Memory

## Current Phase
Phase 5 - Channel Partner System

## Status
Phase 5 implemented and tested.

## Completed Work

- Added a structured Mongoose `Partner` model with controlled partner types, services, status, verification status, address, future-routing coordinates, supported scheme IDs, operating information, and source metadata.
- Added a data-driven `supportedSchemes` relationship referencing existing Scheme business IDs without duplicating scheme rules or financial data.
- Added repository, service, controller, validator, and route layers for partner retrieval and discovery.
- Added deterministic active-partner filtering by selected scheme, service, state, and district.
- Added transparent relevance reasons and verified-before-demo-before-unverified ordering without distance or geospatial calculations.
- Added public serialization that excludes internal database fields while preserving trust and provenance metadata.
- Added repeatable demo partner seeding that uses `DEMO` verification/source metadata and does not overwrite existing records.
- Added `GET /api/v1/partners`, `GET /api/v1/partners/:partnerId`, and `GET /api/v1/schemes/:schemeId/partners`.
- Preserved the existing Scheme model, Phase 1 retrieval APIs, Phase 2 eligibility API, Phase 3 recommendation API, and Phase 4 financial calculator API.

## Files Created

- `backend/src/models/Partner.js`
- `backend/src/repositories/partner.repository.js`
- `backend/src/validators/partner.validator.js`
- `backend/src/services/partner.service.js`
- `backend/src/controllers/partner.controller.js`
- `backend/src/routes/partner.routes.js`
- `backend/src/routes/scheme-partner.routes.js`
- `backend/scripts/seedPartners.js`
- `backend/test/partner.test.js`

## Files Modified

- `backend/src/app.js`
- `backend/package.json`
- `docs/memory.md`

## API Changes

- Added `GET /api/v1/partners` with filters for type, service, state, district, status, verification status, scheme ID, and pagination.
- Added `GET /api/v1/partners/:partnerId`.
- Added `GET /api/v1/schemes/:schemeId/partners` for active partners supporting the selected scheme.
- Partner responses use the existing `{ success, data, message }` and `{ success, error }` formats.
- Empty partner discovery returns `partners: []`, `count: 0`, and an explanatory message rather than an error.
- Added `npm run seed:partners` for explicitly labelled demo records.

## Tests

- Backend test suite: 41 tests passed.
- Phase 5 tests cover Partner model validation, controlled values, malformed URLs and coordinates, scheme relationships, active/status filtering, service/state/district filtering, verification ordering, empty results, and API validation.
- Existing Phase 1, Phase 2, Phase 3, and Phase 4 tests passed.
- Backend ESLint: passed.
- Static error checks: no errors found.

## Known Issues

- Live MongoDB-backed partner retrieval and seeding were not run because this environment has no configured `MONGODB_URI` or local MongoDB executable.
- Demo partners are not official government entities and make no authorization claim.
- Verified real-world partner data is not yet integrated.
- Advanced geospatial routing, distance/radius search, maps, and route optimization are intentionally deferred to Phase 6.
- Frontend partner discovery is not implemented yet.

## Integration Notes

- Phase 2 remains authoritative for eligibility.
- Phase 3 selects/recommends schemes; Phase 5 consumes a selected scheme ID.
- Phase 4 remains responsible for financial estimates; partners do not calculate EMI or eligibility.

## Next Step
According to `docs/phases.md`:

- Begin Phase 6: Geo-Spatial Partner Routing.
