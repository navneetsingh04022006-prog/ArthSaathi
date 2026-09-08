# ArthSaathi Development Memory

## Current Phase
Phase 6 - Geo-Spatial Partner Routing

## Status
Phase 6 implemented and tested.

## Completed Work

- Extended the Phase 5 Partner System with reusable coordinate validation and Haversine geographic distance calculation.
- Added bounded nearby routing with configurable default/max radius and result limits from environment configuration.
- Added scheme-aware and service-aware nearby filtering before distance ranking.
- Excluded inactive partners and partners without valid coordinates from geographic results.
- Added deterministic ranking: verification priority, then geographic distance, then partner name.
- Added structured geographic distance output in kilometers with `method: geographic`.
- Added deterministic routing explanations from scheme support, service support, active status, verification, and distance data.
- Added `GET /api/v1/schemes/:schemeId/partners/nearby`.
- Reused the existing Partner model, repository, public serializer, scheme relationship, verification metadata, and centralized error handling.
- Added demo coordinates to the existing demo seed records while retaining `DEMO` provenance.
- Preserved the existing Scheme model, eligibility, recommendation, financial calculator, and Phase 5 partner APIs.

## Files Created

- `backend/src/utils/geo.js`
- `backend/src/validators/routing.validator.js`
- `backend/src/services/routing.service.js`
- `backend/test/routing.test.js`

## Files Modified

- `backend/src/config/env.js`
- `backend/src/repositories/scheme.repository.js`
- `backend/src/controllers/partner.controller.js`
- `backend/src/routes/scheme-partner.routes.js`
- `backend/src/validators/partner.validator.js`
- `backend/scripts/seedPartners.js`
- `docs/memory.md`

## API Changes

- Added `GET /api/v1/schemes/:schemeId/partners/nearby`.
- Query parameters: required `latitude` and `longitude`; optional `radiusKm`, `service`, and `limit`.
- Defaults: 10 km radius and 20 results; maximums: 100 km radius and 100 results.
- Results use the existing `{ success, data, message }` and `{ success, error }` formats.
- Empty routing results return `partners: []`, `count: 0`, and an explanatory message rather than an error.
- Missing schemes return `404` with `SCHEME_NOT_FOUND` after repository lookup.

## Geographic Method

- Uses the Haversine formula with an Earth radius of 6371 km.
- Distances are rounded to two decimal places and labelled as geographic kilometers.
- Geographic distance is not represented as road distance, travel time, or navigation guidance.
- No geospatial database index was added because the current Partner location schema is a simple nested latitude/longitude structure and the prototype uses bounded application-side candidate retrieval.

## Tests

- Backend test suite: 48 tests passed.
- Phase 6 tests cover known Haversine distances, same-location distance, coordinate validation, radius/default/limit validation, scheme/service/status filtering, missing coordinates, outside-radius exclusion, trust/distance ordering, deterministic limits, empty results, and API validation.
- Existing Phase 1, Phase 2, Phase 3, Phase 4, and Phase 5 tests passed.
- Backend ESLint: passed.
- Static error checks: no errors found.

## Known Issues

- Live MongoDB-backed routing and seeding were not run because this environment has no configured `MONGODB_URI` or local MongoDB executable.
- Demo partners and demo coordinates are not official government entities or verified real-world locations.
- Verified real-world partner data is not yet integrated.
- No road-network routing, travel-time calculation, real-time traffic, external geocoding, or map frontend is implemented.
- User coordinates are validated and used transiently for routing; they are not persisted by this feature.

## Integration Notes

- Phase 2 remains authoritative for eligibility.
- Phase 3 selects/recommends schemes; Phase 6 requires a selected scheme ID and never substitutes generic nearby search.
- Phase 4 remains responsible for financial estimates; routing does not calculate EMI or eligibility.
- Phase 6 extends the Phase 5 Partner System rather than creating a separate partner architecture.

## Next Step
According to `docs/phases.md`:

- Begin Phase 7: Frontend Application.
