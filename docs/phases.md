# Development Phases

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

**Project:** AI-Driven Scheme Matching for Marginalized Entrepreneurs
**Repository:** `ai-scheme-matcher`
**Development Approach:** Incremental / Phase-Based
**Architecture:** Modular Monolith
**Primary Strategy:** Rules Engine + AI Assistance

---

# 1. Development Philosophy

The project must be developed incrementally.

Do **not** attempt to build the complete application at once.

Each phase must:

1. Have a clearly defined objective.
2. Produce a working result.
3. Be tested before moving to the next phase.
4. Avoid introducing unnecessary dependencies.
5. Keep the application runnable after every major phase.
6. Update documentation when architecture or behavior changes.

The AI assistant must not independently change the project's architecture without documenting and validating the change.

---

# 2. Phase Overview

| Phase | Name                          | Priority | Main Output                    |
| ----- | ----------------------------- | -------: | ------------------------------ |
| 0     | Project Foundation            | Critical | Repository + project structure |
| 1     | Database & Scheme Data        | Critical | Scheme database                |
| 2     | Eligibility Rules Engine      | Critical | Deterministic eligibility      |
| 3     | Scheme Recommendation Engine  | Critical | Ranked recommendations         |
| 4     | Financial Calculator          | Critical | EMI + loan calculations        |
| 5     | Channel Partner System        |     High | Partner database               |
| 6     | Geo-Spatial Partner Routing   |     High | Nearest eligible partner       |
| 7     | Frontend Application          | Critical | Complete user interface        |
| 8     | AI Assistant                  |     High | Natural-language interaction   |
| 9     | Multilingual & Accessibility  |     High | Inclusive experience           |
| 10    | Application Tracking          |   Medium | Application workflow           |
| 11    | Admin Dashboard               |   Medium | Scheme + partner management    |
| 12    | Security & Validation         | Critical | Production security            |
| 13    | Testing & Optimization        | Critical | Reliable application           |
| 14    | Deployment                    | Critical | Live application               |
| 15    | Hackathon Demo & Presentation | Critical | SIH-ready final product        |

---

# 3. Phase 0 — Project Foundation

## Objective

Create a clean and stable foundation before implementing business logic.

## Tasks

### Repository

* Initialize Git repository.
* Connect local repository to GitHub.
* Configure `.gitignore`.
* Create README.
* Create project documentation.

### Directory Structure

```text
ai-scheme-matcher/
│
├── frontend/
├── backend/
├── docs/
├── tests/
├── scripts/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

### Documentation

Create:

```text
docs/
├── requirements.md
├── architecture.md
├── rules.md
├── phases.md
├── designs.md
├── api.md
├── database.md
├── ai.md
├── security.md
└── deployment.md
```

## Frontend Foundation

Set up:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* API client
* Form validation

## Backend Foundation

Set up:

* Node.js
* TypeScript
* Backend framework
* MongoDB connection
* Environment configuration
* API versioning
* Error handling
* Logging

## Completion Criteria

* Frontend runs successfully.
* Backend runs successfully.
* Database connection works.
* GitHub repository is connected.
* No secrets are committed.
* Basic API health endpoint works.

Example:

```text
GET /api/v1/health
```

Expected:

```json
{
  "status": "ok"
}
```

---

# 4. Phase 1 — Database & Scheme Data

## Objective

Create the data foundation required for scheme matching.

## Main Collections

```text
users
entrepreneur_profiles
schemes
scheme_rules
channel_partners
partner_health
recommendations
applications
audit_logs
```

## Scheme Model

A scheme should contain information such as:

```text
schemeId
name
description
category
targetBeneficiary
minimumIncome
maximumIncome
minimumLoanAmount
maximumLoanAmount
interestRate
moratorium
tenure
eligiblePurposes
requiredDocuments
status
source
lastVerifiedAt
```

## Important Rule

Government scheme information must come from verified sources.

Do not invent:

* Eligibility criteria
* Interest rates
* Loan limits
* Moratorium periods
* Income limits
* Required documents

Any demo values must be clearly marked as demo/configuration data.

## Completion Criteria

* MongoDB connection works.
* Scheme schema exists.
* Sample verified/demo schemes can be inserted.
* API can retrieve schemes.
* Validation works.

---

# 5. Phase 2 — Eligibility Rules Engine

## Objective

Create the deterministic system that decides whether an applicant is eligible for a scheme.

This is one of the most important components of the entire application.

## Principle

The LLM must **not** determine financial eligibility.

Eligibility must be determined by a deterministic rules engine.

## Input

Example:

```json
{
  "income": 300000,
  "age": 28,
  "purpose": "business",
  "projectCost": 250000,
  "educationStatus": false
}
```

## Processing

```text
User Profile
     ↓
Validation
     ↓
Eligibility Rules
     ↓
Eligible / Ineligible
     ↓
Reason
```

## Output

```json
{
  "eligible": true,
  "schemeId": "SCHEME001",
  "reasons": [
    "Income falls within the eligible range",
    "Requested purpose is supported"
  ]
}
```

## Requirements

The engine must support:

* Income conditions
* Purpose conditions
* Loan amount limits
* Education requirements
* Age requirements where applicable
* Beneficiary category
* Other scheme-specific rules

Rules should be configurable rather than hardcoded wherever practical.

## Completion Criteria

* Rules can be evaluated independently.
* Eligibility results are deterministic.
* Ineligibility reasons are returned.
* Unit tests cover important rules.
* AI is not responsible for final eligibility.

---

# 6. Phase 3 — Scheme Recommendation Engine

## Objective

Recommend the most suitable schemes instead of simply returning every eligible scheme.

## Pipeline

```text
User Information
       ↓
Validation
       ↓
Eligibility Engine
       ↓
Eligible Schemes
       ↓
Ranking Engine
       ↓
Top Recommendations
```

## Ranking Factors

The ranking system can consider:

* Purpose match
* Financial requirement
* Loan amount compatibility
* Applicant eligibility
* Location availability
* Partner availability

Example conceptual score:

```text
Recommendation Score =
    Purpose Fit
  + Financial Fit
  + Eligibility Fit
  + Loan Amount Fit
  + Partner Availability
```

Weights must remain configurable.

## Output

```json
{
  "recommendations": [
    {
      "scheme": "Scheme A",
      "score": 92,
      "reasons": [
        "Matches your business purpose",
        "Requested amount falls within the scheme limit"
      ]
    }
  ]
}
```

## Completion Criteria

* Eligible schemes are ranked.
* Each recommendation has understandable reasons.
* Ranking is deterministic.
* Recommendation API works.

---

# 7. Phase 4 — Financial Calculator

## Objective

Provide transparent financial calculations for users.

## Features

Calculate:

* Loan amount
* Interest rate
* Tenure
* EMI
* Total repayment
* Total interest
* Moratorium impact where applicable
* Scheme-specific limits

## EMI Formula

For a standard reducing-balance loan:

```text
EMI = P × r × (1+r)^n
     --------------------
        (1+r)^n - 1
```

Where:

```text
P = Principal
r = Monthly interest rate
n = Number of monthly installments
```

## Example Flow

```text
Select Scheme
      ↓
Enter Loan Amount
      ↓
Select Tenure
      ↓
Apply Scheme Parameters
      ↓
Calculate EMI
      ↓
Display Breakdown
```

## Requirements

The calculator must clearly distinguish:

* User-entered values
* Scheme-provided values
* Calculated values

## Completion Criteria

* EMI calculation works.
* Boundary values are validated.
* Results are tested.
* Calculator works independently from AI.

---

# 8. Phase 5 — Channel Partner System

## Objective

Create the database and APIs for authorized channel partners.

## Partner Information

Store:

```text
partnerId
name
type
address
state
district
latitude
longitude
supportedSchemes
contactInformation
operationalStatus
capacity
```

## Partner Types

The system may support categories such as:

* SCA
* PSB
* RRB
* NBFC-MFI
* Other authorized channel partners

The exact partner categories and eligibility must be based on verified project data.

## Completion Criteria

* Partner database exists.
* Partner API works.
* Partners can be filtered by scheme.
* Location information is available.

---

# 9. Phase 6 — Geo-Spatial Partner Routing

## Objective

Find the most appropriate channel partner for the applicant.

## Important Principle

Do not simply choose the nearest partner.

The routing engine should first filter eligible partners.

```text
Applicant
    ↓
Required Scheme
    ↓
Eligible Partners
    ↓
Operational Filter
    ↓
Capacity / Health Filter
    ↓
Distance Calculation
    ↓
Partner Ranking
    ↓
Recommended Partner
```

## Ranking Factors

Possible factors:

```text
Scheme Compatibility
Distance
Operational Capacity
Partner Health
Service Availability
```

Weights should be configurable.

## Map

The frontend should display:

* Applicant location
* Partner locations
* Recommended partner
* Distance
* Basic partner information
* Directions option

## Completion Criteria

* Partner filtering works.
* Distance calculation works.
* Partner ranking works.
* Map displays partner locations.
* System can explain why a partner was recommended.

---

# 10. Phase 7 — Frontend Application

## Objective

Build the complete user-facing application.

Frontend development should now connect to the previously developed backend services.

## Main Screens

### Landing Page

```text
Hero
Problem Explanation
How It Works
Benefits
CTA
```

### User Assessment

Collect:

```text
Purpose
Project Cost
Required Loan
Income
Education Status
Location
```

### Recommendation Dashboard

Display:

```text
Recommended Schemes
Eligibility
Loan Limits
Interest Rate
Estimated EMI
Reasons
```

### Scheme Details

Show:

* Eligibility
* Benefits
* Loan limits
* Interest
* Tenure
* Moratorium
* Documents
* Application process

### Partner Locator

Display:

* Map
* Eligible partners
* Recommended partner
* Distance
* Contact information

### Financial Calculator

Provide an interactive calculator.

### AI Assistant

Provide conversational assistance.

## UI Requirements

The application must be:

* Responsive
* Mobile-friendly
* Accessible
* Simple for first-time users
* Low-clutter
* Easy to understand
* Suitable for users with limited technical literacy

---

# 11. Phase 8 — AI Assistant

## Objective

Add AI only after the deterministic system works.

The AI assistant should make the system easier to use, not replace the core decision engine.

## AI Responsibilities

The AI may:

* Understand natural-language queries.
* Extract user information.
* Explain scheme eligibility.
* Explain recommendations.
* Explain financial calculations.
* Translate responses.
* Answer FAQs.
* Guide users through the application process.

## Example

User:

```text
I need around 2 lakh rupees to start a small dairy business.
My family income is around 3 lakh per year.
```

AI extracts:

```json
{
  "purpose": "dairy business",
  "requiredAmount": 200000,
  "annualIncome": 300000
}
```

Then:

```text
Extract Information
        ↓
Validate
        ↓
Rules Engine
        ↓
Recommendation Engine
        ↓
AI Explanation
```

## AI Must NOT

The AI must not independently:

* Approve loans.
* Reject loans.
* Determine official eligibility.
* Modify scheme rules.
* Invent government schemes.
* Invent interest rates.
* Invent loan limits.
* Invent partner information.

## Hallucination Protection

If information is unavailable:

```text
"I don't have verified information for that requirement."
```

The system should not guess.

---

# 12. Phase 9 — Multilingual & Accessibility

## Objective

Make the platform usable by a wider population.

## Language Architecture

Business logic must remain language-independent.

```text
User Language
     ↓
Translation Layer
     ↓
Structured Data
     ↓
Rules Engine
     ↓
Results
     ↓
Translation Layer
     ↓
User
```

## Potential Languages

Start with:

* English
* Hindi

Additional Indian languages can be added later.

## Accessibility

Support:

* Large readable text
* Clear buttons
* Simple terminology
* Screen-reader-friendly structure
* Keyboard navigation
* Strong visual hierarchy
* Voice interaction where feasible

---

# 13. Phase 10 — Application Tracking

## Objective

Allow users to track their scheme application.

## Application States

Example:

```text
Draft
↓
Submitted
↓
Under Review
↓
Documents Required
↓
Approved
↓
Rejected
↓
Disbursed
```

The exact workflow must be configurable.

## Features

* Application ID
* Scheme
* Partner
* Submission date
* Current status
* Status history
* Required actions
* Notifications

## Completion Criteria

* User can create an application.
* Application status can be updated.
* Status history is preserved.
* User can view application progress.

---

# 14. Phase 11 — Admin Dashboard

## Objective

Provide administrators with controlled management capabilities.

## Features

### Scheme Management

* Add scheme
* Edit scheme
* Activate/deactivate scheme
* Update verified information
* Track verification date

### Partner Management

* Add partner
* Update partner
* Update operational status
* Update capacity/health information

### Analytics

Display:

```text
Total Users
Total Recommendations
Most Recommended Schemes
Applications
Successful Applications
Partner Utilization
Common User Questions
```

## Security

Admin functionality must use role-based access control.

---

# 15. Phase 12 — Security & Validation

## Objective

Make the system secure enough for deployment/demo.

## Requirements

Implement:

* Input validation
* Authentication
* Authorization
* RBAC
* Rate limiting
* Secure headers
* CORS configuration
* Secure cookies/tokens
* Environment variables
* Audit logging
* Error handling
* API validation

## Sensitive Information

Never store:

* API keys in Git
* Database credentials in Git
* Secret tokens in frontend code
* Unnecessary personal information

## Security Testing

Test:

* Invalid inputs
* Unauthorized API requests
* Privilege escalation
* Injection attempts
* Authentication failures
* Rate limiting

---

# 16. Phase 13 — Testing & Optimization

## Objective

Ensure the application is reliable before deployment.

## Testing Levels

### Unit Tests

Test:

* Eligibility rules
* Recommendation scoring
* EMI calculations
* Distance calculations
* Validation

### Integration Tests

Test:

```text
Frontend
   ↓
API
   ↓
Database
   ↓
Rules Engine
```

### End-to-End Tests

Test complete workflows:

```text
User enters information
        ↓
Scheme recommendation
        ↓
Financial calculation
        ↓
Partner recommendation
        ↓
Application
```

## Performance

Optimize:

* API response times
* Database queries
* Frontend bundle
* Images
* Map loading
* AI requests

---

# 17. Phase 14 — Deployment

## Objective

Deploy a stable production/demo version.

## Deployment Components

```text
Frontend
   ↓
Hosting Platform

Backend
   ↓
Cloud Hosting

Database
   ↓
Managed MongoDB

AI
   ↓
AI API

Maps
   ↓
Mapping Provider
```

## Deployment Checklist

* Production environment variables configured.
* Database secured.
* HTTPS enabled.
* CORS configured.
* API URL configured.
* Error monitoring enabled.
* Logging enabled.
* Demo data verified.
* Mobile responsiveness tested.

---

# 18. Phase 15 — SIH Demo Preparation

## Objective

Create a compelling and reliable hackathon demonstration.

The demo should focus on the actual problem rather than showing unnecessary technical complexity.

## Recommended Demo Flow

### Step 1 — User Introduction

Show:

```text
"I need ₹2 lakh to start a small business."
```

### Step 2 — Profile

Enter:

```text
Purpose
Income
Project Cost
Loan Requirement
Education Status
Location
```

### Step 3 — AI Understanding

Show how natural language is converted into structured information.

### Step 4 — Scheme Matching

Display:

```text
Best Scheme
Eligibility
Loan Limit
Interest
Reasons
```

### Step 5 — Financial Calculator

Show:

```text
Loan Amount
Interest
Tenure
Estimated EMI
Total Repayment
```

### Step 6 — Partner Routing

Show:

```text
Eligible Partners
       ↓
Health/Capacity Filtering
       ↓
Nearest Suitable Partner
```

### Step 7 — Application

Create a sample application.

### Step 8 — Tracking

Show the application status.

---

# 19. Definition of Done

A phase is considered complete only when:

* [ ] Feature is implemented.
* [ ] Feature works locally.
* [ ] Input validation exists.
* [ ] Error handling exists.
* [ ] Tests exist for important logic.
* [ ] API documentation is updated.
* [ ] Database changes are documented.
* [ ] UI is responsive where applicable.
* [ ] No secrets are committed.
* [ ] Git commit has been created.
* [ ] Existing features still work.

---

# 20. Recommended Git Commit Strategy

Use small, meaningful commits.

Examples:

```text
chore: initialize project structure
docs: add project requirements
docs: add system architecture
feat: add scheme database model
feat: implement scheme eligibility engine
test: add eligibility rule tests
feat: implement scheme recommendation engine
feat: add financial calculator
feat: add channel partner model
feat: implement partner routing
feat: build recommendation dashboard
feat: integrate AI assistant
feat: add multilingual support
feat: add application tracking
feat: add admin dashboard
security: add API validation and rate limiting
test: add end-to-end application flow
chore: prepare production deployment
```

---

# 21. AI Coding Agent Rules

AI coding agents must follow the project's `rules.md`.

Before implementing a phase, the agent must:

1. Read `requirements.md`.
2. Read `architecture.md`.
3. Read `rules.md`.
4. Read the current phase in `phases.md`.
5. Inspect the existing code.
6. Understand existing dependencies.
7. Avoid rewriting working code unnecessarily.
8. Implement only the requested phase.
9. Test the implementation.
10. Report files changed and tests performed.

The AI agent must not:

* Rewrite the entire project.
* Replace the architecture without approval.
* Add unnecessary libraries.
* Hardcode government scheme rules.
* Allow an LLM to make eligibility decisions.
* Put secrets in source code.
* Remove existing functionality without justification.

---

# 22. Phase Dependency Graph

```text
                    ┌─────────────────┐
                    │ Phase 0         │
                    │ Foundation      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 1         │
                    │ Scheme Data     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 2         │
                    │ Rules Engine    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 3         │
                    │ Recommendations │
                    └───────┬─┬───────┘
                            │ │
              ┌─────────────┘ └──────────────┐
              ▼                              ▼
      ┌───────────────┐              ┌────────────────┐
      │ Phase 4       │              │ Phase 5        │
      │ Calculator    │              │ Partners       │
      └───────┬───────┘              └───────┬────────┘
              │                              │
              │                              ▼
              │                      ┌────────────────┐
              │                      │ Phase 6        │
              │                      │ Partner Routing│
              │                      └───────┬────────┘
              │                              │
              └──────────────┬───────────────┘
                             ▼
                    ┌─────────────────┐
                    │ Phase 7         │
                    │ Frontend        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 8         │
                    │ AI Assistant    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 9         │
                    │ Multilingual    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 10        │
                    │ Applications    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 11        │
                    │ Admin           │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 12        │
                    │ Security        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 13        │
                    │ Testing         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 14        │
                    │ Deployment      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Phase 15        │
                    │ SIH Demo        │
                    └─────────────────┘
```

---

# 23. MVP Priority

If development time becomes limited, prioritize:

### Must Have

1. Project foundation
2. Scheme database
3. Eligibility rules engine
4. Scheme recommendation engine
5. Financial calculator
6. Channel partner database
7. Partner routing
8. Core frontend
9. Basic AI assistant

### Should Have

10. Multilingual support
11. Application tracking
12. Admin dashboard

### Nice to Have

13. Voice interaction
14. Advanced analytics
15. Offline/PWA capabilities
16. Advanced personalization
17. Automated notifications

The goal is to have a **fully working MVP** before implementing advanced features.

---

# 24. Golden Rule

> **Build the deterministic financial system first. Add AI as an intelligent interface on top of it.**

The application should remain useful even if the AI service is temporarily unavailable.

The core workflow must work without AI:

```text
User Data
    ↓
Eligibility Rules
    ↓
Scheme Matching
    ↓
Financial Calculation
    ↓
Partner Routing
    ↓
Application
```

AI enhances this workflow by making it:

```text
Natural
Conversational
Multilingual
Explainable
Accessible
```

but AI must never become the source of truth for official financial eligibility or scheme rules.
