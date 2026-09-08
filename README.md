# ArthSaathi
# AI-Driven Scheme Matching Platform for Marginalized Entrepreneurs
chhavi
An intelligent, multilingual, and explainable digital platform that helps marginalized entrepreneurs discover suitable government financial assistance schemes, estimate loan repayments, and locate authorized Channel Partners.

Built for **Smart India Hackathon (SIH)**, this project addresses the challenge of improving awareness, accessibility, and transparency in government-backed financial support programs.

---

## Problem Statement

Many citizens struggle to determine:

* Which government scheme fits their needs
* Whether they are eligible
* How much financial assistance they can receive
* What their EMI and repayment obligations will be
* Which authorized bank, SCA, RRB, or NBFC can process their application

The existing ecosystem is fragmented, resulting in confusion, incorrect applications, and delays in accessing financial support.

This platform acts as an intelligent bridge between beneficiaries and the channel finance ecosystem.

---

## Key Features

### Smart Scheme Recommendation

* Rule-based eligibility engine
* AI-assisted recommendation system
* Explainable scheme matching
* Match score generation

### Financial Calculator

* EMI calculation
* Interest estimation
* Moratorium support
* Repayment breakdown

### Geo-Spatial Partner Locator

* Nearby Channel Partner discovery
* Distance-based ranking
* Scheme compatibility filtering
* Interactive map interface

### AI Assistant

* Natural language interaction
* Multilingual support
* Scheme explanation
* Document guidance

### Document Assistance

* Required document checklist
* Missing document identification
* Application guidance

### Multilingual Accessibility

* English
* Hindi
* Regional language support
* Simple and inclusive user experience

---

## Core Innovation

This platform follows a **Hybrid AI + Rule Engine Architecture**:

```text
User Input
     ↓
AI Understanding
     ↓
Structured Data
     ↓
Eligibility Rules
     ↓
Scheme Ranking
     ↓
Financial Analysis
     ↓
Partner Routing
     ↓
AI Explanation
     ↓
User-Friendly Recommendations
```

Instead of relying solely on AI, the system uses:

* **Deterministic rules** for eligibility
* **AI for explanations and guidance**
* **Geospatial intelligence** for partner routing

This ensures transparency, reliability, and explainability.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* i18next
* Leaflet / MapLibre

### Backend

* Node.js
* TypeScript
* Fastify / Express
* JWT Authentication

### Database

* PostgreSQL
* PostGIS
* Redis

### AI Layer

* LLM API
* Prompt Engineering
* Structured Output Validation

---

## Project Architecture

```text
Frontend
    ↓
Backend API
    ↓
Eligibility Engine
    ↓
Scheme Ranking Engine
    ↓
Financial Calculator
    ↓
Partner Locator
    ↓
AI Explanation Service
    ↓
Database
```

---

## Project Structure

```text
project/
│
├── frontend/
├── backend/
├── docs/
├── data/
├── scripts/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## Documentation

```text
docs/
│
├── PRD.md
├── architecture.md
├── phases.md
├── rules.md
├── database.md
├── api.md
├── security.md
└── deployment.md
```

---

## Impact

This platform aims to:

* Increase financial awareness
* Simplify scheme discovery
* Reduce application errors
* Improve access to financial support
* Promote inclusive economic growth
* Enable faster and more transparent financial assistance

---

## Future Scope

* Government API integration
* OCR-based document verification
* Voice-based interaction
* WhatsApp integration
* Real-time partner status
* Personalized financial advisory

---

## Team

Developed as part of **Smart India Hackathon (SIH)** to create an accessible, transparent, and intelligent financial assistance ecosystem for marginalized communities.

---

> **"Making government financial assistance easier to discover, understand, and access through AI-powered, explainable, and multilingual technology."**

