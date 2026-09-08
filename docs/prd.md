# Product Requirements Document (PRD)

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

**Version:** 1.0
**Project Type:** Smart India Hackathon (SIH)
**Status:** Development
**Document Owner:** Development Team
**Last Updated:** September 2026

---

# 1. Executive Summary

## 1.1 Product Overview

The **AI-Driven Scheme Matching Platform** is a multilingual digital platform designed to help marginalized entrepreneurs and eligible beneficiaries identify suitable government financial assistance and educational loan schemes.

The platform addresses the difficulty citizens face in understanding:

* Which government scheme is suitable for their requirements
* Whether they satisfy the eligibility criteria
* How much financing they may be eligible for
* What the expected EMI and repayment obligations may be
* Which authorized Channel Partner can process their application
* What documents are required
* Why a particular scheme has been recommended

The platform combines a **deterministic rule-based eligibility engine**, a **scheme ranking engine**, an **AI conversational layer**, a **financial calculator**, and a **geo-spatial Channel Partner routing system**.

---

# 2. Problem Statement

Government-backed financial assistance is available to support marginalized communities and entrepreneurs. However, citizens often struggle to identify the appropriate financial product because multiple schemes have different:

* Eligibility criteria
* Income limits
* Loan limits
* Interest rates
* Moratorium periods
* Project categories
* Educational requirements
* Channelizing agencies

Applications are also routed through a distributed ecosystem of State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), NBFCs, and other authorized partners.

This fragmentation can result in:

* Lack of scheme awareness
* Incorrect scheme selection
* Misrouted applications
* Unnecessary visits to offices
* Difficulty finding appropriate Channel Partners
* Delays in application processing
* Poor understanding of loan repayment obligations

The proposed platform provides a unified digital interface that guides users from **requirement discovery → scheme matching → financial planning → partner discovery → application guidance**.

---

# 3. Product Vision

> **Make government financial assistance easier to discover, understand, compare, and access through an intelligent, multilingual, and explainable digital platform.**

The platform should act as a **decision-support and guidance system**, not as a replacement for the official government approval process.

---

# 4. Product Goals

## 4.1 Primary Goals

1. Help users discover relevant financial and educational loan schemes.
2. Determine eligibility using transparent and configurable rules.
3. Rank eligible schemes according to user requirements.
4. Explain why each scheme was recommended.
5. Calculate estimated loan repayment and EMI.
6. Identify nearby eligible Channel Partners.
7. Route users toward suitable partners based on configured partner conditions.
8. Provide multilingual access.
9. Reduce confusion and unnecessary offline interactions.
10. Improve financial awareness.

---

# 5. Non-Goals

The initial system will **not**:

* Guarantee government loan approval.
* Replace official government application systems.
* Make autonomous financial approval decisions.
* Approve or reject loan applications.
* Fabricate government scheme information.
* Treat an LLM's output as authoritative eligibility information.
* Claim real-time partner capacity unless verified data is available.
* Collect unnecessary sensitive personal information.

---

# 6. Target Users

## 6.1 Primary User — Beneficiary / Entrepreneur

A person looking for financial assistance for:

* Starting a business
* Expanding a business
* Purchasing equipment
* Micro-enterprise activities
* Self-employment
* Agriculture/allied activities where supported
* Education
* Vocational or professional education

### User needs

The user wants to know:

> "Which scheme is suitable for me?"

> "How much can I borrow?"

> "What will my EMI be?"

> "Which organization should I approach?"

> "What documents do I need?"

---

# 7. Secondary Users

## 7.1 Channel Partner

Authorized agencies or financial institutions processing applications.

Needs:

* Applicant information
* Recommended scheme
* Eligibility reasoning
* Application information
* Required documents

---

## 7.2 Administrator

Government/program administrator or authorized system operator.

Needs:

* Scheme management
* Eligibility rule management
* Partner management
* Application monitoring
* Analytics
* Audit logs
* Data management

---

# 8. Core User Journey

```text
Landing Page
      ↓
Select Language
      ↓
User Profile / Basic Information
      ↓
Select Requirement
      ↓
Business / Education Details
      ↓
Eligibility Evaluation
      ↓
Scheme Recommendations
      ↓
Compare Schemes
      ↓
Financial Calculator
      ↓
Find Suitable Channel Partner
      ↓
View Required Documents
      ↓
Application Guidance
      ↓
Application / Official Portal
```

---

# 9. Functional Requirements

# FR-01: Multilingual Interface

The platform shall support multiple languages.

### MVP languages

The initial implementation should support:

* English
* Hindi
* One additional regional language

The architecture should allow additional languages to be added without modifying core business logic.

### Requirements

* Language selector
* Translated UI labels
* Translated scheme explanations
* Multilingual AI responses
* Language preference persistence

---

# FR-02: Beneficiary Profile

The platform shall collect only information required for scheme matching.

### Example information

* Applicant type
* Annual family income
* State
* District
* Location
* Project/education purpose
* Estimated project cost
* Education status
* Relevant scheme-specific information

### Requirements

* Input validation
* Required/optional field distinction
* Clear explanations for fields
* Mobile-friendly forms
* Ability to edit information

---

# FR-03: Requirement Discovery

Users shall be able to specify what they need assistance for.

### Example categories

```text
Business
├── Micro Business
├── Small Enterprise
├── Equipment Purchase
├── Business Expansion
└── Self Employment

Education
├── Higher Education
├── Professional Education
├── Technical Education
└── Vocational Education
```

---

# FR-04: Smart Scheme Recommendation

The system shall recommend schemes based on user information.

### Input

```text
Applicant profile
Income
Purpose
Project type
Project cost
Education status
Location
Requested amount
```

### Processing

```text
Input
 ↓
Validation
 ↓
Normalization
 ↓
Eligibility Rules
 ↓
Eligible Schemes
 ↓
Ranking
 ↓
Recommendations
```

### Output

Each recommendation shall contain:

* Scheme name
* Match score
* Maximum loan amount
* Applicable interest rate
* Moratorium
* Eligibility status
* Reasons for recommendation
* Missing requirements
* Required documents

---

# FR-05: Eligibility Engine

The eligibility engine shall use deterministic business rules.

Example:

```text
IF income <= maximum_income
AND project_type is supported
AND requested_amount <= maximum_loan
AND applicant satisfies scheme conditions

THEN eligible
```

The system shall provide reasons for:

* Eligibility
* Ineligibility
* Missing requirements

### Important requirement

The AI model must not independently determine official eligibility.

The rule engine remains the authoritative decision-support component.

---

# FR-06: Scheme Ranking

Eligible schemes shall be ranked according to configurable criteria.

Possible ranking factors:

| Factor               | Example Weight |
| -------------------- | -------------: |
| Project fit          |            30% |
| Financial fit        |            25% |
| Loan amount fit      |            20% |
| Interest advantage   |            10% |
| Moratorium advantage |            10% |
| Partner availability |             5% |

Weights shall be configurable.

The system shall avoid presenting the ranking as a government-approved score.

The UI shall use terminology such as:

> Scheme Match Score

rather than:

> Approval Probability

---

# FR-07: Explainable Recommendations

For every recommendation, the platform shall explain:

### Why this scheme?

Example:

```text
✓ Your reported income is within the configured income limit.

✓ Your proposed project type is supported.

✓ Your estimated project cost fits within the scheme's
  financing range.

✓ The scheme provides a concessional interest rate.

⚠ A project report may be required before application.
```

This explanation should be generated using verified structured scheme information.

---

# FR-08: AI Conversational Assistant

The platform shall provide an AI assistant for natural-language interaction.

Example:

> "I want to start a small dairy business and need around ₹2 lakh."

The AI should extract structured information:

```json
{
  "purpose": "BUSINESS",
  "projectType": "DAIRY",
  "estimatedCost": 200000
}
```

This information is passed to the rule engine.

### AI responsibilities

* Understand natural-language requirements
* Extract structured information
* Answer general questions
* Explain recommendations
* Provide multilingual assistance
* Explain financial concepts
* Help users understand required documents

### AI restrictions

The AI must not:

* Invent schemes
* Invent eligibility criteria
* Guarantee approval
* Invent interest rates
* Invent partner availability
* Override deterministic eligibility rules

---

# FR-09: Financial Calculator

The platform shall provide a loan calculator.

### Inputs

* Principal amount
* Interest rate
* Loan tenure
* Moratorium period

### Outputs

* Monthly EMI
* Total repayment
* Total interest
* Principal amount
* Repayment schedule

### EMI Formula

```text
EMI = P × r × (1+r)^n
     -------------------
        (1+r)^n - 1
```

Where:

```text
P = Principal
r = Monthly interest rate
n = Number of monthly installments
```

The calculator shall clearly state that the result is an **estimate** and that actual repayment terms are determined by the applicable scheme and lending institution.

---

# FR-10: Scheme Comparison

Users shall be able to compare recommended schemes.

Example:

| Feature       | Scheme A | Scheme B  |
| ------------- | -------- | --------- |
| Maximum Loan  | ₹X       | ₹Y        |
| Interest Rate | X%       | Y%        |
| Moratorium    | X months | Y months  |
| Purpose       | Business | Education |
| Match Score   | X%       | Y%        |

The comparison shall use verified scheme data.

---

# FR-11: Channel Partner Locator

The platform shall identify nearby Channel Partners.

### Inputs

* User location
* Selected scheme
* Project/education category

### Processing

```text
User Location
 ↓
Geo Search
 ↓
Nearby Partners
 ↓
Scheme Compatibility Filter
 ↓
Partner Status Filter
 ↓
Ranking
```

### Output

* Partner name
* Partner type
* Address
* Distance
* Supported scheme
* Status
* Available application route

---

# FR-12: Geo-Spatial Routing

The system shall support geographic search.

Example:

```text
Find partners
within 25 km
```

Partners can be ranked according to:

```text
Distance
+
Scheme compatibility
+
Configured availability
+
Configured operational metrics
```

The system shall not represent simulated or stale partner metrics as real-time government data.

---

# FR-13: Required Documents

For each scheme, the platform shall display the required documents.

Example:

```text
Required Documents

✓ Identity Proof
✓ Income Certificate
✓ Relevant Category Certificate
✓ Bank Account Details
✓ Project Report
```

The system shall distinguish between:

```text
Required
Optional
Scheme-specific
Potentially required
```

where the underlying source permits such distinction.

---

# FR-14: Application Guidance

The platform shall guide users toward the correct application process.

Possible actions:

```text
Apply through Channel Partner
View Application Process
View Required Documents
Visit Official Portal
Get Directions
```

The system shall not imply that the platform itself is the final government approval authority unless officially integrated for that purpose.

---

# FR-15: Application Tracking

If implemented in the MVP, users shall be able to see:

```text
Application Started
       ↓
Documents Pending
       ↓
Submitted
       ↓
Under Processing
       ↓
Approved / Rejected / Additional Information
```

For the hackathon prototype, this can use demonstration data.

---

# FR-16: Administrator Dashboard

The administrator dashboard shall provide:

### Scheme management

* Add scheme
* Edit scheme
* Activate/deactivate scheme
* Configure eligibility rules
* Configure loan limits
* Configure interest rates
* Configure moratorium
* Version scheme information

### Partner management

* Add partner
* Edit partner
* Update location
* Configure supported schemes
* Update operational status

### Analytics

* Number of users
* Popular schemes
* Recommendation distribution
* Partner selection
* Application funnel

### Audit

* Scheme changes
* Rule changes
* Partner changes
* Administrative actions

---

# 10. Scheme Data Requirements

Scheme information shall be stored as structured data rather than hard-coded into frontend components.

Example:

```json
{
  "schemeId": "scheme_001",
  "name": "Example Scheme",
  "category": "BUSINESS",
  "maxIncome": 500000,
  "maxLoanAmount": 140000,
  "interestRate": 6.5,
  "moratoriumMonths": 3,
  "eligibleProjectTypes": [
    "MICRO_BUSINESS"
  ],
  "active": true
}
```

Actual production values must be obtained from authoritative government sources.

---

# 11. Data Requirements

## User Data

```text
User ID
Language
Location
Profile information
```

## Applicant Data

```text
Income
Applicant category
Purpose
Project type
Project cost
Education status
```

## Scheme Data

```text
Scheme ID
Name
Description
Eligibility
Loan limits
Interest rate
Moratorium
Supported purposes
Required documents
Rules
Version
Source
Last updated
```

## Partner Data

```text
Partner ID
Name
Partner type
Address
Latitude
Longitude
Supported schemes
Status
Operational metrics
Last updated
```

---

# 12. Non-Functional Requirements

## NFR-01 Performance

Target:

* API response: < 500 ms for normal operations where practical
* Scheme recommendation: < 2 seconds excluding external AI latency
* Map search: < 3 seconds under normal conditions
* Responsive UI on mobile and desktop

---

## NFR-02 Availability

The application should be designed for high availability.

Backend services should be stateless wherever practical.

---

## NFR-03 Scalability

The architecture should support:

* Multiple backend instances
* Database scaling
* Redis caching
* Additional schemes
* Additional Channel Partners
* Additional languages
* Additional AI providers

---

## NFR-04 Accessibility

The application should support:

* Large readable text
* High-contrast interface
* Keyboard navigation
* Screen-reader-friendly labels
* Simple language
* Clear error messages
* Mobile-friendly design

Future enhancements may include voice interaction.

---

## NFR-05 Security

The platform shall implement:

* HTTPS
* Authentication
* Role-based authorization
* Input validation
* Rate limiting
* Secure environment variables
* Password hashing
* Audit logging
* Secure API communication
* Error sanitization

---

# 13. Privacy Requirements

The system shall follow the principle of **data minimization**.

Only information necessary for the application's purpose should be collected.

The system should:

* Clearly explain why information is collected
* Avoid unnecessary identity information
* Protect personal data
* Restrict administrative access
* Log sensitive administrative actions
* Avoid exposing personal information in logs

---

# 14. AI Requirements

## AI Architecture

```text
User
 ↓
Input
 ↓
AI/NLP
 ↓
Structured Intent
 ↓
Validation
 ↓
Rule Engine
 ↓
Scheme Recommendation
 ↓
AI Explanation
 ↓
User
```

## AI must be grounded in

* Scheme database
* Configured rules
* Verified partner information
* Approved documentation

## AI fallback

If information is unavailable:

> "I don't have enough verified information to answer that reliably. Please refer to the official scheme documentation or contact the authorized Channel Partner."

---

# 15. Error Handling Requirements

The system shall provide clear and user-friendly errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Please enter a valid project cost."
  }
}
```

Internal errors must not expose:

* Stack traces
* Database credentials
* API keys
* Internal server paths
* Sensitive information

---

# 16. Recommended Technology Stack

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
Zod
i18next
Leaflet / MapLibre
```

## Backend

```text
Node.js
TypeScript
Fastify
Zod
JWT
```

## Database

```text
PostgreSQL
PostGIS
```

## Cache

```text
Redis
```

## AI

```text
LLM API
```

The AI provider should be abstracted behind an internal service so it can be replaced without changing the application architecture.

---

# 17. System Architecture

```text
                        ┌───────────────────┐
                        │      USER         │
                        │ Web / Mobile / PWA │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │    FRONTEND       │
                        │ React + TypeScript│
                        └─────────┬─────────┘
                                  │
                              HTTPS/API
                                  │
                                  ▼
                        ┌───────────────────┐
                        │      BACKEND      │
                        │ Node + TypeScript │
                        └─────────┬─────────┘
                                  │
            ┌─────────────────────┼──────────────────────┐
            │                     │                      │
            ▼                     ▼                      ▼
     Scheme Engine         Financial Engine       Partner Router
            │                     │                      │
            │                     │                      │
            └─────────────────────┼──────────────────────┘
                                  │
                                  ▼
                          ┌───────────────┐
                          │   AI SERVICE  │
                          └───────┬───────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │   PostgreSQL   │
                         │    + PostGIS   │
                         └────────────────┘
```

---

# 18. Backend Modules

```text
backend/
└── src/
    ├── config/
    ├── middleware/
    ├── modules/
    │   ├── auth/
    │   ├── applicants/
    │   ├── schemes/
    │   ├── recommendations/
    │   ├── finance/
    │   ├── partners/
    │   ├── applications/
    │   └── ai/
    ├── services/
    ├── utils/
    ├── types/
    └── server.ts
```

---

# 19. Frontend Modules

```text
frontend/
└── src/
    ├── components/
    │   ├── ui/
    │   ├── scheme/
    │   ├── calculator/
    │   ├── partner/
    │   └── application/
    │
    ├── pages/
    │   ├── Home/
    │   ├── Questionnaire/
    │   ├── Recommendations/
    │   ├── SchemeDetails/
    │   ├── Calculator/
    │   ├── PartnerLocator/
    │   └── Application/
    │
    ├── services/
    ├── hooks/
    ├── stores/
    ├── types/
    ├── utils/
    └── i18n/
```

---

# 20. API Requirements

Base path:

```text
/api/v1
```

## Authentication

```text
POST /auth/register
POST /auth/login
```

## Applicant

```text
GET /applicants/profile
PUT /applicants/profile
```

## Schemes

```text
GET /schemes
GET /schemes/:id
```

## Recommendations

```text
POST /recommendations
```

## Finance

```text
POST /calculator/emi
```

## Partners

```text
GET /partners/nearby
GET /partners/:id
```

## Applications

```text
POST /applications
GET /applications/:id
```

## Documents

```text
GET /schemes/:id/documents
```

## AI

```text
POST /ai/understand
POST /ai/explain
```

---

# 21. Database Entities

Core entities:

```text
Users
ApplicantProfiles
Schemes
SchemeRules
SchemeDocuments
Partners
PartnerSchemes
PartnerMetrics
Recommendations
Applications
ApplicationDocuments
AuditLogs
```

Relationships:

```text
User
 │
 └── ApplicantProfile
        │
        └── Recommendations
                 │
                 └── Scheme
                        │
                        └── Partner

Application
 ├── User
 ├── Scheme
 ├── Partner
 └── Documents
```

---

# 22. Recommendation Output Contract

The recommendation service should return structured data.

Example:

```json
{
  "recommendations": [
    {
      "schemeId": "scheme_001",
      "matchScore": 91,
      "eligible": true,
      "reasons": [
        "Project type is supported",
        "Income falls within configured eligibility criteria",
        "Requested amount is within the configured loan limit"
      ],
      "missingRequirements": [],
      "financialSummary": {
        "maxLoanAmount": 140000,
        "interestRate": 6.5,
        "moratoriumMonths": 3
      }
    }
  ]
}
```

---

# 23. Partner Routing Output

Example:

```json
{
  "partners": [
    {
      "partnerId": "partner_001",
      "name": "Example Partner",
      "distanceKm": 4.2,
      "schemeSupported": true,
      "status": "ACTIVE",
      "routingScore": 89
    }
  ]
}
```

---

# 24. Analytics Requirements

The administrator should eventually be able to monitor:

```text
Total Users
Total Recommendations
Most Recommended Schemes
Most Selected Schemes
Partner Searches
Partner Selection
Application Starts
Application Completion
Most Common Ineligibility Reasons
```

This data can demonstrate measurable impact during the SIH presentation.

---

# 25. MVP Scope

The SIH MVP shall prioritize:

### Must Have

```text
✓ Multilingual interface
✓ Beneficiary questionnaire
✓ Scheme database
✓ Rule-based eligibility engine
✓ Scheme ranking
✓ Explainable recommendations
✓ EMI calculator
✓ Partner locator
✓ Partner filtering
✓ Required documents
✓ Responsive UI
```

### Should Have

```text
✓ AI conversational assistant
✓ Application guidance
✓ Admin dashboard
✓ Application tracking
✓ Analytics
```

### Future

```text
○ Government API integration
○ Real-time partner capacity
○ OCR document verification
○ Voice assistant
○ WhatsApp integration
○ Advanced ML personalization
○ Automated document validation
```

---

# 26. Success Metrics

The platform should measure:

## Discovery

Percentage of users who successfully receive a scheme recommendation.

## Relevance

Percentage of recommendations that satisfy configured eligibility rules.

## Routing

Percentage of users who successfully identify at least one suitable Channel Partner.

## Financial Literacy

Percentage of users who view the financial calculation before proceeding.

## Application Funnel

```text
Users
 ↓
Completed Questionnaire
 ↓
Received Recommendation
 ↓
Selected Scheme
 ↓
Found Partner
 ↓
Started Application
```

---

# 27. Acceptance Criteria

The MVP will be considered successful when:

### Scheme Matching

* User can enter required information.
* System evaluates configured eligibility rules.
* Ineligible schemes are filtered.
* Eligible schemes are ranked.
* User can understand why a scheme was recommended.

### Financial Calculator

* User can calculate estimated EMI.
* Calculations handle configurable interest rates and tenure.
* Results are clearly presented.

### Partner Locator

* User can provide/select a location.
* Nearby partners can be displayed.
* Partners can be filtered according to supported schemes.
* Distance can be displayed.

### AI

* User can ask questions naturally.
* AI can extract structured requirements.
* AI explanations are grounded in system data.
* AI does not override eligibility rules.

### Multilingual

* User can switch language.
* Core UI is translated.
* Recommendations can be explained in the selected language.

---

# 28. Risks

## Risk 1 — Incorrect Government Data

### Mitigation

Use authoritative sources and maintain:

```text
source
version
lastUpdated
```

for scheme information.

---

## Risk 2 — AI Hallucination

### Mitigation

Use:

```text
AI
 ↓
Structured Output
 ↓
Validation
 ↓
Rule Engine
```

and ground explanations in structured data.

---

## Risk 3 — Outdated Partner Information

### Mitigation

Display:

```text
Last Updated
```

and clearly distinguish demonstration data from verified live data.

---

## Risk 4 — Overengineering

### Mitigation

Build the MVP first.

Do not begin with:

* Microservices
* Complex ML training
* Kubernetes
* Advanced distributed systems

A modular monolith is sufficient for the SIH prototype.

---

# 29. Development Principles

The project shall follow these principles:

1. **Rule-first eligibility**
2. **AI-assisted, not AI-controlled**
3. **Explainability by default**
4. **Mobile-first design**
5. **Multilingual by architecture**
6. **Data-driven scheme configuration**
7. **Security by design**
8. **Minimal data collection**
9. **Modular backend**
10. **Testable business logic**

---

# 30. Definition of Done

A feature is considered complete only when:

```text
Implementation
     ↓
Input Validation
     ↓
Error Handling
     ↓
Responsive UI
     ↓
API Integration
     ↓
Testing
     ↓
Documentation
     ↓
Code Review
     ↓
Merged to Main
```

---

# 31. Future Vision

The platform can eventually evolve into a comprehensive financial-assistance discovery ecosystem.

Potential future capabilities:

```text
Government API Integration
        ↓
Real-Time Scheme Information
        ↓
Real-Time Partner Availability
        ↓
Document OCR
        ↓
Automated Document Validation
        ↓
Voice-Based Assistance
        ↓
WhatsApp Integration
        ↓
Personalized Financial Guidance
```

The long-term objective is to create a **single intelligent access layer between beneficiaries and the fragmented government-supported financial assistance ecosystem**.

---

# 32. Final Product Definition

The proposed platform is an **AI-assisted, rule-driven, multilingual financial assistance discovery and routing system**.

Its core architecture combines:

```text
        USER
          │
          ▼
    AI/NLP INTERFACE
          │
          ▼
   STRUCTURED USER DATA
          │
          ▼
   ELIGIBILITY ENGINE
          │
          ▼
    SCHEME RANKING
          │
      ┌───┴────┐
      ▼        ▼
 FINANCIAL   PARTNER
 CALCULATOR  ROUTING
      │        │
      └───┬────┘
          ▼
  EXPLAINABLE RESULT
          │
          ▼
       USER
```

The system should provide **guidance, transparency, and intelligent matching**, while keeping final eligibility and approval decisions with the appropriate authorized government/financial institution.

---
