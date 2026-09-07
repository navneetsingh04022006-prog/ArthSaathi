# AI DEVELOPMENT RULES

# PathPilot Project Development Guidelines

Version: 1.0

Purpose:

This document defines strict rules and boundaries for AI coding assistants working on the PathPilot project.

AI agents must read and follow this document before making any changes.

---

# 1. General Development Principles

## AI MUST:

* Understand existing code before modifying it.
* Follow the current project architecture.
* Prefer simple and maintainable solutions.
* Reuse existing components and utilities.
* Write production-quality code.
* Explain major changes before implementation.
* Verify changes do not break existing functionality.

---

## AI MUST NOT:

* Rewrite the entire project without permission.
* Remove working features.
* Change frameworks without approval.
* Introduce unnecessary dependencies.
* Create duplicate components.
* Modify unrelated files.
* Hardcode sensitive information.
* Ignore existing errors.

---

# 2. Technology Restrictions

## Frontend Stack

Approved:

* React
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Recharts
* Lucide React Icons

Do NOT use:

* Next.js
* Angular
* Vue
* Material UI
* Bootstrap
* jQuery

Reason:

The project architecture is already based on React + Vite + Tailwind.

---

# 3. Backend Rules

Approved:

Preferred:

* FastAPI (Python)

OR

* Node.js

Allowed libraries:

Python:

* FastAPI
* Pydantic
* SQLAlchemy
* Uvicorn

Node:

* Express
* Mongoose
* JWT libraries

Avoid:

* Large unnecessary frameworks
* Overengineering
* Microservices for MVP

---

# 4. Database Rules

Preferred Database:

* PostgreSQL through Supabase

AI must:

* Use proper schema design.
* Create relationships where required.
* Validate input data.
* Avoid storing unnecessary information.

AI must not:

* Store API keys.
* Store passwords directly.
* Create random tables without explanation.

---

# 5. AI Integration Rules

AI Model:

Preferred:

* Gemini API

AI responses must:

* Use structured JSON whenever possible.
* Validate AI output before displaying.
* Handle API failures gracefully.

Example:

Correct:

```json
{
"roadmap":[],
"resources":[],
"projects":[]
}
```

Incorrect:

Plain unstructured paragraphs.

---

# 6. Dependency Rules

Before installing any library:

AI must:

1. Explain why the library is needed.
2. Check if existing libraries can solve the problem.
3. Prefer lightweight solutions.

Avoid installing:

* Duplicate libraries.
* Unmaintained packages.
* Packages with security issues.

---

# 7. Code Quality Rules

All code must follow:

## React

* Functional components only.
* Use hooks properly.
* Avoid unnecessary state.
* Keep components reusable.

## Naming

Components:

```
PascalCase
```

Example:

```
RoadmapCard.jsx
```

Functions:

```
camelCase
```

Example:

```
generateRoadmap()
```

Files:

Clear descriptive names.

---

# 8. Component Rules

Before creating a component:

Ask:

"Can this reuse an existing component?"

Avoid:

```
DashboardCard1.jsx
DashboardCard2.jsx
DashboardCard3.jsx
```

Prefer:

```
Card.jsx
```

with reusable props.

---

# 9. Error Handling Rules

Every API call must handle:

* Loading state
* Success state
* Error state

Example:

Required:

```
Loading...

Data loaded

Something went wrong. Try again.
```

Never:

* Show blank screens.
* Crash the application.
* Hide errors silently.

---

# 10. Security Rules

AI must:

Never expose:

* API keys
* Database credentials
* Tokens
* Environment variables

Sensitive information must be stored in:

```
.env
```

Example:

```
GEMINI_API_KEY=
DATABASE_URL=
```

---

# 11. Authentication Rules

Authentication must:

* Validate users.
* Protect private routes.
* Handle expired sessions.

Never:

* Store passwords as plain text.
* Store authentication tokens insecurely.

---

# 12. File Modification Rules

Before editing:

AI must:

1. Read the complete file.
2. Understand dependencies.
3. Identify possible side effects.

AI should modify the smallest number of files required.

---

# 13. UI/UX Rules

Design principles:

* Clean
* Modern
* Responsive
* Accessible

Must support:

* Desktop
* Tablet
* Mobile

Avoid:

* Excessive animations.
* Confusing layouts.
* Too many colors.
* Poor spacing.

---

# 14. Responsive Design Rules

Every page must work on:

Desktop:

```
1920px
```

Tablet:

```
768px
```

Mobile:

```
375px
```

Avoid:

* Fixed widths.
* Horizontal scrolling.
* Overflow issues.

---

# 15. Testing Rules

Before completing any task:

AI must check:

Frontend:

* Build errors
* Console errors
* Broken imports
* UI issues

Backend:

* API responses
* Validation
* Error handling

---

# 16. Git Rules

Before major changes:

Create checkpoint:

```
git commit
```

Commit messages:

Good:

```
Added AI roadmap generation
```

Bad:

```
changes
```

---

# 17. AI Behaviour Rules

AI should behave as:

A senior software engineer.

Before coding:

* Analyze.
* Plan.
* Explain.

During coding:

* Follow architecture.
* Keep code clean.

After coding:

* Test.
* Review.
* Report changes.

---

# 18. Hackathon Priority Rules

Priority order:

1. Working product
2. User experience
3. Core features
4. Code quality
5. Advanced features

Do not spend excessive time on:

* Perfect architecture
* Unnecessary optimization
* Features outside MVP

---

# 19. Forbidden Actions

AI must never:

❌ Delete the project structure

❌ Replace technology stack

❌ Add random dependencies

❌ Create fake functionality without marking it

❌ Generate insecure authentication

❌ Ignore errors

❌ Modify environment files without permission

---

# 20. Final Rule

When uncertain:

Do not guess.

Ask for clarification.

A smaller correct implementation is better than a large incorrect implementation.

---

END OF RULES
