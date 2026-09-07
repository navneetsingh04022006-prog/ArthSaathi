# System Architecture

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

**Version:** 1.0
**Project Type:** Smart India Hackathon (SIH)
**Architecture Style:** Modular Monolith → Service-Oriented Evolution
**Primary Users:** Beneficiaries, Channel Partners, Administrators

---

# 1. System Overview

The platform is an intelligent multilingual financial-assistance discovery and routing system designed to help marginalized entrepreneurs identify suitable government-backed credit/education schemes and locate an eligible channel partner.

The system combines:

1. Rule-based scheme eligibility engine
2. AI-powered conversational assistance
3. Scheme recommendation engine
4. Financial calculator
5. Geospatial partner locator
6. Channel-partner eligibility/routing engine
7. Multilingual interface
8. Explainable recommendations
9. Administrative data management
10. Analytics and monitoring

### High-Level Flow

```text
                    ┌───────────────────────┐
                    │       Citizen         │
                    │ Web / Mobile / PWA    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    API / Backend      │
                    │     Application       │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
      ┌──────────────┐  ┌───────────────┐  ┌──────────────┐
      │ User Profile │  │ AI Assistant  │  │ Auth / RBAC  │
      │ Service      │  │ Service       │  │              │
      └──────┬───────┘  └───────┬───────┘  └──────────────┘
             │                  │
             └──────────┬───────┘
                        ▼
              ┌──────────────────────┐
              │ Scheme Matching      │
              │ Engine               │
              │                      │
              │ Rules + Scoring      │
              └──────────┬───────────┘
                         │
             ┌───────────┼────────────┐
             ▼           ▼            ▼
      ┌────────────┐ ┌──────────┐ ┌──────────────┐
      │ Scheme DB  │ │ Financial│ │ Partner      │
      │            │ │ Calculator│ │ Router       │
      └────────────┘ └──────────┘ └──────┬───────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ GeoSpatial      │
                                │ Partner Search  │
                                └─────────────────┘
```

---

# 2. Architectural Principles

The following principles govern the entire system.

## 2.1 Rules Before AI

Financial eligibility must not depend entirely on an LLM.

The system should use:

```text
User Input
   ↓
Validation
   ↓
Deterministic Eligibility Rules
   ↓
Eligible Schemes
   ↓
Ranking / Recommendation
   ↓
AI Explanation
```

The AI should explain recommendations rather than invent eligibility criteria.

---

## 2.2 Explainability

Every recommendation must contain:

* Why the scheme was recommended
* Eligibility conditions satisfied
* Conditions not satisfied
* Maximum applicable loan amount
* Applicable interest rate
* Expected EMI
* Required documents
* Recommended channel partners

Example:

```text
Recommended Scheme:
Micro Finance Scheme

Why:
✓ Project cost falls within scheme limit
✓ Annual family income satisfies requirement
✓ Applicant meets required beneficiary criteria

Loan Requirement:
₹1,20,000

Estimated EMI:
₹2,400/month

Nearest eligible channel partner:
XYZ Agency — 8.4 km
```

---

## 2.3 Configuration Over Hardcoding

Government scheme rules should NOT be hardcoded throughout the application.

Instead:

```text
Scheme Configuration
       ↓
Database
       ↓
Rules Engine
       ↓
Recommendation
```

This allows administrators to update:

* Loan limits
* Interest rates
* Income limits
* Moratorium periods
* Eligible purposes
* Required documents
* Partner eligibility
* Scheme status

without changing application code.

---

# 3. Recommended Technology Stack

## Frontend

Recommended:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* TanStack Query
* Zod
* Recharts

Optional:

* PWA support
* i18next
* Leaflet / MapLibre

---

# 4. Backend

Recommended:

* Node.js
* TypeScript
* Fastify

Alternative:

* NestJS

For the SIH prototype, a modular Node.js backend is sufficient.

Architecture:

```text
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── schemes/
│   │   ├── matching/
│   │   ├── finance/
│   │   ├── partners/
│   │   ├── routing/
│   │   ├── chatbot/
│   │   ├── applications/
│   │   └── admin/
│   │
│   ├── shared/
│   ├── config/
│   ├── middleware/
│   ├── database/
│   └── server.ts
```

---

# 5. Database

Recommended database:

**MongoDB**

MongoDB is suitable because scheme rules, partner information, documents, and user profiles contain semi-structured data.

Recommended architecture:

```text
Application
     │
     ▼
Repository Layer
     │
     ▼
MongoDB
```

Do not allow controllers to directly access MongoDB.

Use:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

---

# 6. Core Data Models

## 6.1 User

```text
User
├── id
├── name
├── phone
├── language
├── location
├── income
├── beneficiaryCategory
├── educationStatus
├── createdAt
└── updatedAt
```

---

# 6.2 Entrepreneur Profile

```text
EntrepreneurProfile
├── userId
├── businessType
├── projectType
├── projectCost
├── existingBusiness
├── businessExperience
├── requiredLoan
├── location
└── purpose
```

---

# 6.3 Scheme

```text
Scheme
├── id
├── name
├── category
├── description
├── active
├── eligibilityRules
├── financialRules
├── requiredDocuments
├── applicableStates
├── beneficiaryCategories
├── createdAt
└── updatedAt
```

Example:

```json
{
  "name": "Example Micro Finance Scheme",
  "category": "MICRO_FINANCE",
  "active": true,
  "eligibilityRules": {
    "maxFamilyIncome": 500000,
    "minAge": 18
  },
  "financialRules": {
    "maxLoanAmount": 140000,
    "interestRate": 6.5,
    "moratoriumMonths": 3
  }
}
```

Actual scheme values must come from authoritative government scheme documentation rather than being assumed from the prototype.

---

# 6.4 Channel Partner

```text
ChannelPartner
├── id
├── name
├── type
├── address
├── state
├── district
├── latitude
├── longitude
├── supportedSchemes
├── serviceTypes
├── fundStatus
├── utilizationPercentage
├── active
└── lastUpdated
```

Partner types:

```text
SCA
PSB
RRB
NBFC-MFI
```

---

# 6.5 Partner Health / Routing Data

```text
PartnerHealth
├── partnerId
├── npaRatio
├── overdueRatio
├── utilizationPercentage
├── availableCapacity
├── routingEligible
├── lastUpdated
└── reason
```

This allows the routing engine to avoid unsuitable partners.

---

# 6.6 Recommendation

```text
Recommendation
├── id
├── userId
├── schemeId
├── eligibilityStatus
├── matchScore
├── reasons[]
├── missingRequirements[]
├── recommendedLoanAmount
├── estimatedEMI
├── recommendedPartners[]
└── createdAt
```

---

# 7. Scheme Recommendation Engine

This is the heart of the platform.

The engine should NOT simply ask an LLM:

> "Which scheme should this person use?"

Instead use a hybrid architecture.

```text
                    User Profile
                         │
                         ▼
                 Input Validation
                         │
                         ▼
              Eligibility Rule Engine
                         │
                ┌────────┴────────┐
                ▼                 ▼
          Eligible             Ineligible
           Schemes               Schemes
                │
                ▼
         Matching / Ranking
                │
                ▼
       Recommendation Result
                │
                ▼
          AI Explanation
```

---

# 8. Eligibility Engine

Each scheme contains structured rules.

Example:

```text
IF
income <= scheme.maxIncome
AND projectCost <= scheme.maxProjectCost
AND projectType IN scheme.allowedProjectTypes
AND beneficiaryCategory satisfies scheme requirement
THEN
eligible = true
```

The engine should return:

```json
{
  "eligible": true,
  "schemeId": "scheme_001",
  "reasons": [
    "Income is within the eligible limit",
    "Project cost is within the permitted range",
    "Project type is supported"
  ]
}
```

---

# 9. Recommendation Ranking

Multiple schemes may be eligible.

Therefore, calculate a recommendation score.

Example:

```text
Match Score =
    30% Financial Fit
  + 25% Purpose Fit
  + 20% Eligibility Fit
  + 15% Loan Amount Fit
  + 10% Location / Partner Availability
```

The weights should be configurable.

Example:

```text
Scheme A → 94%
Scheme B → 82%
Scheme C → 67%
```

Important:

The score should represent **fit**, not probability of loan approval.

---

# 10. AI Assistant Architecture

The AI assistant should provide:

* Natural-language interaction
* Scheme explanations
* Multilingual responses
* Question answering
* Guidance through the application process
* Financial-literacy explanations

Example:

```text
User:
"Mujhe dairy business start karna hai.
Meri family income 3 lakh hai aur mujhe
1 lakh loan chahiye."

        ↓

Language Detection

        ↓

Structured Information Extraction

        ↓

Profile Builder

        ↓

Eligibility Engine

        ↓

Scheme Ranking

        ↓

AI Response Generator

        ↓

Hindi Response
```

---

# 11. AI Safety Architecture

The LLM must never become the source of truth for:

* Interest rates
* Loan limits
* Eligibility requirements
* Government policy
* Partner eligibility
* Approval decisions

Instead:

```text
Government Data
      ↓
Verified Scheme Database
      ↓
Rules Engine
      ↓
Structured Result
      ↓
LLM
      ↓
Human-friendly explanation
```

This prevents hallucinated financial information.

---

# 12. Retrieval-Augmented Generation

For scheme-related questions, use RAG.

Architecture:

```text
Government Documents
        ↓
Document Processing
        ↓
Chunking
        ↓
Embeddings
        ↓
Vector Database
        ↓
Retriever
        ↓
Relevant Information
        ↓
LLM
        ↓
Answer
```

Possible documents:

* Scheme guidelines
* Official circulars
* Application instructions
* Eligibility documents
* Partner guidelines
* FAQs

The assistant should cite the source document where practical.

---

# 13. Multilingual Architecture

The platform should support languages relevant to the target users.

Recommended initial languages:

```text
English
Hindi
Regional language(s)
```

Architecture:

```text
User Input
    ↓
Language Detection
    ↓
Translation / Multilingual Model
    ↓
Structured Query
    ↓
Recommendation Engine
    ↓
Response Generation
    ↓
Target Language
```

Important:

**Business rules remain language-independent.**

Only presentation changes.

---

# 14. Financial Calculator

The financial calculator calculates projected repayment.

Inputs:

```text
Loan Amount
Interest Rate
Tenure
Moratorium
```

Standard EMI formula:

```text
EMI = P × r × (1+r)^n
             ----------------
             (1+r)^n - 1
```

Where:

```text
P = Principal
r = Monthly interest rate
n = Number of monthly installments
```

The calculator should also support:

```text
Loan Amount
Interest Rate
Tenure
Moratorium
Total Interest
Total Repayment
```

---

# 15. Scheme-Aware Financial Calculation

The calculator must first validate the requested loan.

```text
Requested Loan
      ↓
Scheme Maximum
      ↓
Eligible Loan Amount
      ↓
Interest Rate
      ↓
Moratorium
      ↓
EMI Calculation
```

Example:

```text
Requested amount: ₹2,00,000
Maximum permitted: ₹1,40,000

Eligible calculation amount:
₹1,40,000
```

The UI should clearly explain why the requested amount was adjusted.

---

# 16. Geo-Spatial Partner Locator

The partner locator uses:

```text
User Location
+
Partner Location
+
Scheme Compatibility
+
Partner Health
+
Availability
```

Architecture:

```text
                User Location
                     │
                     ▼
             GeoSpatial Search
                     │
                     ▼
          Nearby Channel Partners
                     │
                     ▼
           Scheme Compatibility
                     │
                     ▼
             Partner Health
                     │
                     ▼
            Routing Algorithm
                     │
                     ▼
            Ranked Partners
```

---

# 17. Partner Ranking

Partner ranking can consider:

```text
Distance
Scheme compatibility
Current capacity
NPA/overdue status
Service availability
Partner type
Historical processing performance
```

Example:

```text
Partner Score =
    35% Scheme Compatibility
  + 25% Distance
  + 20% Capacity
  + 10% Operational Health
  + 10% Service Availability
```

The weights should be configurable.

---

# 18. Important Routing Rule

Do NOT simply route users to the nearest bank.

Instead:

```text
Nearest Partner
       ≠
Best Eligible Partner
```

Correct process:

```text
Nearest Partners
      ↓
Supported Scheme?
      ↓
Operationally Eligible?
      ↓
Capacity Available?
      ↓
Partner Health Acceptable?
      ↓
Rank
      ↓
Recommend
```

---

# 19. Mapping Architecture

The frontend can display:

```text
User Location
       ●

Partner A
       ●

Partner B
       ●

Partner C
       ●
```

Possible technologies:

* Leaflet
* MapLibre
* OpenStreetMap-based services
* Government/approved mapping services if required

The mapping provider should be abstracted behind a service interface so it can be replaced later.

---

# 20. Application Routing

After recommendation:

```text
User
 ↓
Scheme Recommendation
 ↓
Partner Recommendation
 ↓
Partner Details
 ↓
Application Guidance
 ↓
Application Status
```

The prototype does not necessarily need to submit the actual loan application.

Instead, it can provide:

* Correct agency
* Correct scheme
* Required documents
* Application instructions
* Contact information
* Directions
* Application tracking reference

---

# 21. Admin Dashboard

Administrators should be able to manage:

### Schemes

```text
Create
Update
Deactivate
Version
Review
```

### Partners

```text
Add partner
Update location
Update supported schemes
Update capacity
Update operational status
```

### Documents

```text
Upload
Replace
Version
Verify
```

### Analytics

```text
Total users
Recommendations
Popular schemes
Rejected matches
Partner routing
Application journeys
Language usage
```

---

# 22. Authentication & Authorization

Use Role-Based Access Control.

Roles:

```text
CITIZEN
PARTNER
ADMIN
SUPER_ADMIN
```

Example:

```text
Citizen
 ├── Manage profile
 ├── Find schemes
 ├── Calculate EMI
 └── Find partners

Partner
 ├── View routed applications
 └── Update operational information

Admin
 ├── Manage schemes
 ├── Manage partners
 └── View analytics
```

---

# 23. API Architecture

Recommended REST API.

Example:

```text
/api/v1/auth
/api/v1/users
/api/v1/schemes
/api/v1/matching
/api/v1/calculator
/api/v1/partners
/api/v1/routing
/api/v1/chat
/api/v1/applications
/api/v1/admin
```

---

# 24. Example API Endpoints

## Schemes

```http
GET /api/v1/schemes
GET /api/v1/schemes/:id
```

## Matching

```http
POST /api/v1/matching/recommend
```

Request:

```json
{
  "income": 300000,
  "projectType": "DAIRY",
  "projectCost": 100000,
  "educationStatus": "NOT_APPLICABLE",
  "location": {
    "latitude": 23.02,
    "longitude": 72.57
  }
}
```

Response:

```json
{
  "recommendations": [
    {
      "schemeId": "scheme_001",
      "matchScore": 94,
      "eligible": true,
      "reasons": [
        "Income is within the eligible range",
        "Project type is supported",
        "Requested amount is within the scheme limit"
      ]
    }
  ]
}
```

---

# 25. Partner API

```http
GET /api/v1/partners/nearby
POST /api/v1/routing/recommend
```

Example:

```json
{
  "schemeId": "scheme_001",
  "latitude": 23.02,
  "longitude": 72.57
}
```

---

# 26. Application Architecture

Recommended frontend architecture:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── features/
│   │   ├── schemes/
│   │   ├── matching/
│   │   ├── calculator/
│   │   ├── partners/
│   │   ├── chatbot/
│   │   └── profile/
│   │
│   ├── services/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── i18n/
│   └── App.tsx
```

---

# 27. Backend Architecture

```text
backend/
├── src/
│   ├── config/
│   ├── database/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── schemes/
│   │   ├── matching/
│   │   ├── finance/
│   │   ├── partners/
│   │   ├── routing/
│   │   ├── chatbot/
│   │   ├── applications/
│   │   └── admin/
│   │
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.ts
│
├── tests/
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

# 28. Module Structure

Each backend module should follow:

```text
module/
├── controller.ts
├── service.ts
├── repository.ts
├── model.ts
├── schema.ts
├── routes.ts
└── types.ts
```

Example:

```text
matching/
├── matching.controller.ts
├── matching.service.ts
├── matching.repository.ts
├── matching.schema.ts
├── matching.routes.ts
└── matching.types.ts
```

---

# 29. Request Lifecycle

Example recommendation request:

```text
Frontend
   │
   ▼
API
   │
   ▼
Validation
   │
   ▼
User Profile Service
   │
   ▼
Matching Service
   │
   ├── Scheme Repository
   │
   ├── Eligibility Engine
   │
   └── Ranking Engine
   │
   ▼
Financial Calculator
   │
   ▼
Partner Router
   │
   ▼
Recommendation
   │
   ▼
AI Explanation
   │
   ▼
Frontend
```

---

# 30. Caching

Cache frequently accessed data:

```text
Scheme list
Scheme details
Partner locations
Static configuration
```

Possible technology:

```text
Redis
```

For the SIH MVP, caching can initially be omitted or implemented using an application-level cache.

---

# 31. Security Architecture

Security is particularly important because financial and personal information may be processed.

Implement:

* HTTPS
* JWT/session-based authentication
* Password hashing
* Role-based authorization
* Input validation
* Rate limiting
* CORS configuration
* Secure HTTP headers
* Audit logging
* Encryption for sensitive data
* Environment-based secrets
* No secrets in Git

---

# 32. Data Privacy

Collect only information necessary for recommendation.

Example:

```text
Required:
Income
Project type
Project cost
Location
Education status
Beneficiary information required by the scheme
```

Avoid collecting unnecessary information.

Sensitive information should never be logged.

---

# 33. Audit Logging

Important actions should be recorded.

```text
Admin changed scheme
Admin changed partner
User requested recommendation
Partner status changed
Scheme version changed
```

Example:

```text
AuditLog
├── userId
├── action
├── entity
├── entityId
├── timestamp
└── metadata
```

---

# 34. Error Handling

All APIs should return a consistent structure.

Example:

```json
{
  "success": false,
  "error": {
    "code": "SCHEME_NOT_FOUND",
    "message": "Requested scheme was not found."
  }
}
```

Never expose:

* Stack traces
* Database errors
* Internal service details
* API keys
* Sensitive information

to users.

---

# 35. Observability

Track:

```text
API response time
API errors
Recommendation failures
AI failures
Database errors
Partner routing failures
```

Useful tools:

* Structured logging
* Error monitoring
* Health checks

Example:

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

---

# 36. AI Failure Handling

If the AI service fails:

```text
AI unavailable
      ↓
Rule Engine still works
      ↓
Recommendation displayed
      ↓
Generic explanation shown
```

The platform must remain usable without the AI layer.

This is a critical architectural property.

---

# 37. Offline / Low Connectivity Strategy

Because the target users may have poor connectivity, the frontend should be designed as a PWA.

Cache:

```text
Basic scheme information
FAQs
Financial calculator
Language resources
Static UI
```

Dynamic information such as:

```text
Partner availability
Fund utilization
Current scheme status
```

should require an online connection.

---

# 38. Deployment Architecture

Recommended SIH deployment:

```text
                   Internet
                       │
                       ▼
                ┌──────────────┐
                │ CDN / Hosting│
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ React PWA    │
                └──────┬───────┘
                       │ HTTPS
                       ▼
                ┌──────────────┐
                │ Backend API  │
                └──────┬───────┘
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
      MongoDB        AI API       Maps API
          │
          ▼
    Scheme / Partner
       Database
```

---

# 39. Environment Architecture

Development:

```text
Developer Machine
    ↓
Local Frontend
    ↓
Local Backend
    ↓
Development MongoDB
```

Production:

```text
Production Frontend
    ↓
Production Backend
    ↓
Production Database
```

Never connect development code directly to the production database.

---

# 40. Environment Variables

Use:

```text
.env
.env.example
```

Example:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
AI_API_KEY=
MAP_API_KEY=
```

`.env` must NEVER be committed to Git.

Only `.env.example` should be committed.

---

# 41. Recommended Repository Structure

```text
scheme-match-ai/
│
├── frontend/
├── backend/
├── docs/
│   ├── architecture.md
│   ├── requirements.md
│   ├── rules.md
│   ├── phases.md
│   ├── api.md
│   ├── database.md
│   ├── designs.md
│   └── ai.md
│
├── scripts/
├── tests/
│
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

---

# 42. Recommended Documentation

Your `docs/` folder should eventually contain:

```text
docs/
├── architecture.md
├── requirements.md
├── database.md
├── api.md
├── ai.md
├── rules.md
├── security.md
├── designs.md
├── phases.md
└── deployment.md
```

---

# 43. End-to-End User Journey

```text
                    START
                      │
                      ▼
              Select Language
                      │
                      ▼
             Create User Profile
                      │
                      ▼
          Enter Business / Education
                 Information
                      │
                      ▼
             Enter Project Cost
                      │
                      ▼
             Enter Family Income
                      │
                      ▼
             Select Location
                      │
                      ▼
             Eligibility Engine
                      │
                      ▼
             Scheme Matching
                      │
                      ▼
           Ranked Recommendations
                      │
                      ▼
             Explain Recommendation
                      │
                      ▼
             Financial Calculator
                      │
                      ▼
              Partner Locator
                      │
                      ▼
           Eligible Partner Ranking
                      │
                      ▼
            Application Guidance
                      │
                      ▼
                     END
```

---

# 44. Key Innovation

The key innovation should not be presented simply as:

> "We built an AI chatbot."

Instead:

> **An explainable AI-assisted decision-support and routing platform that converts a citizen's natural-language financial need into a verified scheme recommendation and routes them toward an eligible channel partner.**

This is substantially stronger for SIH.

---

# 45. AI + Rules Hybrid Model

The final architecture is:

```text
                    USER
                      │
                      ▼
              Natural Language
                      │
                      ▼
                 AI Layer
             Information Extraction
                      │
                      ▼
             Structured User Profile
                      │
                      ▼
             ┌──────────────────┐
             │  RULES ENGINE    │
             │                  │
             │ Eligibility      │
             │ Constraints      │
             │ Scheme Rules     │
             └────────┬─────────┘
                      │
                      ▼
             Eligible Schemes
                      │
                      ▼
             Ranking Engine
                      │
                      ▼
             Financial Engine
                      │
                      ▼
             Partner Router
                      │
                      ▼
             Recommendation
                      │
                      ▼
                 AI Layer
              Explanation
                      │
                      ▼
                    USER
```

---

# 46. MVP Scope for SIH

Do NOT attempt to build every possible feature initially.

### Phase 1 — Core

```text
✓ User profile
✓ Scheme database
✓ Eligibility engine
✓ Recommendation engine
✓ Financial calculator
```

### Phase 2 — Differentiation

```text
✓ Multilingual support
✓ AI assistant
✓ Explainable recommendations
✓ Partner locator
```

### Phase 3 — Advanced

```text
✓ Partner routing
✓ Partner health score
✓ Application guidance
✓ Admin dashboard
✓ Analytics
```

### Phase 4 — Polish

```text
✓ PWA
✓ Accessibility
✓ Performance
✓ Security
✓ Error handling
✓ Demo data
```

---

# 47. Final Architecture Decision

The recommended architecture is:

```text
Frontend
    │
    │ REST API
    ▼
Node.js Backend
    │
    ├── Authentication
    ├── User Management
    ├── Scheme Management
    ├── Eligibility Engine
    ├── Recommendation Engine
    ├── Financial Engine
    ├── Partner Router
    ├── AI Assistant
    └── Admin
           │
           ▼
       MongoDB
           │
           ├── Users
           ├── Schemes
           ├── Partners
           ├── Applications
           └── Audit Logs

External Services
    │
    ├── LLM / AI
    ├── Maps
    └── Translation
```

The system should initially be implemented as a **modular monolith**, not as multiple microservices. This keeps the SIH prototype easier to develop, debug, deploy, and demonstrate while preserving clear module boundaries for future scaling.
