# Design System & UI/UX Specification

## AI-Driven Scheme Matching for Marginalized Entrepreneurs

> **Design Philosophy:** Simple enough for a first-time applicant. Professional enough for a financial platform. Transparent enough to build trust.

---

# 1. Design Vision

The platform should feel like a **trusted public financial service**, not a complicated banking portal.

The primary users may have limited financial or digital literacy. Therefore, every screen should prioritize:

* Clarity over decoration
* Guidance over complexity
* Trust over visual gimmicks
* Simple language over technical terminology
* Large touch targets
* Clear next steps
* Transparent calculations
* Explainable recommendations

The interface should feel **modern, calm, accessible, and human**.

Avoid making the platform look like a typical "AI dashboard".

---

# 2. Visual Identity

## 2.1 Overall Style

The visual style should combine:

**Government Service + Modern FinTech + Human-Centered UX**

The interface should have:

* Clean white/light surfaces
* Subtle neutral backgrounds
* Strong typography
* Moderate use of accent colors
* Soft borders
* Small amounts of elevation
* Rounded but not overly playful components
* Clear information hierarchy

Avoid:

* Excessive gradients
* Neon colors
* Glassmorphism everywhere
* Excessive animations
* Giant AI chat bubbles
* Overly rounded "AI startup" cards
* Dark futuristic dashboards

---

# 3. Color System

Use a restrained color palette.

## Primary

```text
Primary:        #14532D
Primary Hover:  #166534
Primary Light:  #DCFCE7
```

The primary green represents:

* Growth
* Financial stability
* Opportunity
* Trust
* Economic empowerment

## Secondary

```text
Secondary:      #1D4ED8
Secondary Light:#DBEAFE
```

Used for:

* Information
* Navigation
* Links
* Supporting actions

## Accent

```text
Accent:         #D97706
Accent Light:   #FEF3C7
```

Used sparingly for:

* Important notices
* Pending states
* Financial highlights

## Semantic Colors

```text
Success:        #15803D
Warning:        #D97706
Error:          #DC2626
Info:           #2563EB
```

## Neutral Colors

```text
Background:     #F8FAFC
Surface:        #FFFFFF
Border:         #E2E8F0
Text Primary:   #0F172A
Text Secondary: #475569
Text Muted:     #64748B
Disabled:       #94A3B8
```

### Color Rule

Do not use color as the only way to communicate information.

For example:

```text
✓ Eligible
⚠ Additional information required
✕ Not eligible
```

rather than relying only on green, yellow, and red.

---

# 4. Typography

Use a highly readable sans-serif typeface.

Recommended:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## Type Scale

| Element    | Size | Weight |
| ---------- | ---: | -----: |
| Display    | 40px |    700 |
| H1         | 32px |    700 |
| H2         | 24px |    700 |
| H3         | 20px |    600 |
| H4         | 18px |    600 |
| Body Large | 18px |    400 |
| Body       | 16px |    400 |
| Body Small | 14px |    400 |
| Caption    | 12px |    500 |

On mobile, reduce large headings where necessary.

---

# 5. Spacing System

Use a consistent 4px-based spacing system.

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
80px
```

Common usage:

```text
Card padding:        24px
Section spacing:     48px
Input spacing:       16px
Button gap:          8px
Page horizontal:     24px
```

Mobile:

```text
Page horizontal:     16px
Card padding:        16px
Section spacing:     32px
```

---

# 6. Border Radius

Keep the interface professional.

```text
Small:      6px
Medium:     10px
Large:      14px
Pill:       999px
```

Recommended:

* Inputs → 8px
* Buttons → 8px
* Cards → 12px
* Status badges → pill

Avoid making every component extremely rounded.

---

# 7. Shadows

Use elevation carefully.

### Card

```text
0 1px 3px rgba(...)
```

### Elevated Card

```text
0 4px 12px rgba(...)
```

### Modal

```text
0 10px 30px rgba(...)
```

Most cards should rely primarily on **borders**, not heavy shadows.

---

# 8. Layout Principles

## Desktop

Use a centered layout.

```text
┌────────────────────────────────────────────────────┐
│ Header                                             │
├────────────────────────────────────────────────────┤
│                                                    │
│                  Main Content                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

Maximum content width:

```text
1200px – 1280px
```

## Dashboard

```text
┌──────────────┬─────────────────────────────────────┐
│              │                                     │
│   Sidebar    │            Main Content              │
│              │                                     │
│              │                                     │
└──────────────┴─────────────────────────────────────┘
```

## Mobile

The sidebar becomes a compact navigation system.

```text
┌────────────────────────────┐
│ Logo              Menu     │
├────────────────────────────┤
│                            │
│        Main Content        │
│                            │
├────────────────────────────┤
│ Home | Schemes | Profile   │
└────────────────────────────┘
```

---

# 9. Navigation

## Main Navigation

```text
Home
Find a Scheme
My Recommendations
Loan Calculator
Find a Partner
Applications
Help
```

For administrators:

```text
Dashboard
Schemes
Eligibility Rules
Partners
Applications
Users
Analytics
Audit Logs
Settings
```

Navigation should always make the user's current location obvious.

---

# 10. Landing Page

The landing page should immediately explain what the platform does.

## Hero

```text
Find the right financial scheme
for your next step.

Tell us what you need.
We'll help you understand which government-backed
scheme may fit your requirements.

[ Find a Scheme ]

No complicated forms • Simple explanations • Multilingual
```

Avoid saying:

> "Our AI will find the perfect scheme for you."

Instead use:

> "Find schemes that match your requirements."

This avoids creating unrealistic expectations.

---

# 11. How It Works

Use three or four simple steps.

```text
01
Tell us about yourself

02
Tell us what you need

03
Compare suitable schemes

04
Connect with a partner
```

Each step should have a simple icon and one-sentence explanation.

---

# 12. Scheme Discovery Flow

The scheme discovery experience is the most important part of the product.

It should behave like a **guided application wizard**.

## Progress Indicator

```text
About You ─── Requirement ─── Financials ─── Results
```

Show progress clearly.

Example:

```text
Step 2 of 4

What are you looking for?

○ Starting a new business
○ Expanding an existing business
○ Education
○ Working capital
○ Other
```

---

# 13. Questionnaire Design

Do not show a huge form.

Use progressive disclosure.

### Bad

```text
Name
Age
Gender
Income
Address
Occupation
Business Type
Business Cost
Loan Amount
Education
Documents
...
```

### Good

```text
What do you need financial assistance for?

[ Start a business ]

[ Expand my business ]

[ Education ]

[ Other ]
```

Then continue based on the selected answer.

---

# 14. Form Components

All inputs should include:

* Clear label
* Optional helper text
* Validation
* Error message
* Accessible keyboard navigation

Example:

```text
Estimated project cost

₹ [ 2,50,000 ]

Enter the approximate amount required
for your project.

✓ Looks good
```

Never rely on placeholder text as the field label.

---

# 15. Recommendation Results

The result page should be the visual centerpiece.

## Header

```text
Your Scheme Matches

Based on the information you provided,
we found 3 schemes that may fit your requirements.
```

---

# 16. Scheme Card

Each scheme should use a consistent structure.

```text
┌──────────────────────────────────────────────┐
│ Recommended                                  │
│                                              │
│ Micro Finance Scheme                         │
│ Suitable for small-scale business projects  │
│                                              │
│ Match                                       │
│ ████████████████████░░  92%                 │
│                                              │
│ Maximum Assistance       Interest            │
│ ₹1,40,000                6.5%                │
│                                              │
│ ✓ Income requirement met                     │
│ ✓ Project amount within limit                │
│ ✓ Purpose supported                          │
│                                              │
│ [ View Details ]     [ Compare ]             │
└──────────────────────────────────────────────┘
```

Do not call this:

```text
Approval Probability: 92%
```

Use:

```text
Scheme Match: 92%
```

The system must never imply guaranteed approval.

---

# 17. Explainability

Every recommendation should answer:

> Why am I seeing this scheme?

Example:

```text
Why this scheme?

✓ Your estimated project cost is within the
  scheme's supported range.

✓ Your reported income meets the listed
  income requirement.

✓ Your selected business activity is supported.

⚠ Final eligibility will be determined by
  the authorized channel partner.
```

This section should be visible without requiring users to understand AI.

---

# 18. Scheme Details Page

Structure the information into clear sections.

```text
Scheme Overview

Who can apply?

Financial Assistance

Interest Rate

Repayment Period

Moratorium

Eligible Activities

Required Documents

How to Apply

Nearby Partners
```

Use accordions on mobile.

Avoid long blocks of government/legal text.

Provide:

```text
Simple explanation
+
Official source/reference
```

---

# 19. Scheme Comparison

Users should be able to compare two or three schemes.

```text
                 Scheme A       Scheme B       Scheme C

Maximum Loan     ₹1.4L         ₹5L            ₹50L

Interest         6.5%          7%             8%

Moratorium       3 months      6 months       12 months

Purpose          Business      Business       Education

Your Fit         High          High           Low
```

Highlight differences rather than repeating identical information.

---

# 20. Financial Calculator

The calculator should feel like a simple financial planning tool.

## Input

```text
Loan Amount
₹ 5,00,000

Interest Rate
7.00%

Loan Duration
5 years

Moratorium
6 months
```

## Result

```text
Estimated Monthly EMI

₹9,901

Total Interest
₹94,060

Total Repayment
₹5,94,060
```

Include a clear disclaimer:

> These figures are estimates for planning purposes. Actual terms may vary according to the applicable scheme and lending institution.

---

# 21. Partner Locator

The partner locator should combine:

**Map + List**

Desktop:

```text
┌──────────────────────┬──────────────────────────┐
│                      │                          │
│   Partner List       │          MAP             │
│                      │                          │
│   Partner A          │      📍                 │
│   2.4 km             │             📍           │
│                      │                          │
│   Partner B          │   📍                    │
│   4.1 km             │                          │
└──────────────────────┴──────────────────────────┘
```

Mobile:

```text
[ Map ]

Nearby Partners

┌─────────────────────┐
│ Partner A           │
│ 2.4 km away         │
│ Scheme supported ✓  │
│                     │
│ [ View ] [ Route ]  │
└─────────────────────┘
```

---

# 22. Partner Card

Display:

```text
Partner Name

2.4 km away

✓ Supports your selected scheme

Address

Working Hours

Services

[ View Details ]

[ Get Directions ]
```

Do not display operational metrics such as:

```text
NPA: 3.4%
Fund Utilization: 82%
```

unless the platform has a verified real-time data source.

For prototype/demo data, clearly label it:

```text
Demo Data
```

---

# 23. AI Assistant

The AI assistant should **not dominate the interface**.

It should be an optional support layer.

Example:

```text
Need help understanding something?

Ask about:
• Scheme eligibility
• Required documents
• Loan terms
• Application process

[ Ask a question ]
```

The assistant can explain:

> "What does moratorium mean?"

But it should not say:

> "You are guaranteed to receive this loan."

---

# 24. AI Chat Design

Keep the conversation simple.

```text
┌─────────────────────────────────────┐
│ Scheme Assistant                    │
├─────────────────────────────────────┤
│                                     │
│ You: What documents do I need?     │
│                                     │
│ Assistant:                          │
│ For this scheme, you may need...   │
│                                     │
├─────────────────────────────────────┤
│ Ask a question...             Send │
└─────────────────────────────────────┘
```

Provide suggested questions:

```text
What is the maximum loan?

Why am I eligible?

What documents do I need?

Find a nearby partner
```

---

# 25. Multilingual Design

Language switching should always be easy to find.

Header:

```text
EN | हिन्दी | Regional Language
```

The system should preserve the user's selected language throughout the journey.

Translated content should maintain the same layout hierarchy.

Do not simply translate buttons while leaving critical instructions untranslated.

---

# 26. Accessibility

The application should target **WCAG 2.1 AA** principles.

Requirements:

* Keyboard accessible
* Visible focus states
* Sufficient contrast
* Screen-reader-friendly labels
* Semantic HTML
* Descriptive buttons
* No color-only indicators
* Minimum comfortable touch targets
* Clear form errors
* Reduced-motion support

---

# 27. Responsive Design

The application must work on:

```text
Mobile
Tablet
Laptop
Desktop
```

Recommended breakpoints:

```text
Mobile:   < 640px
Tablet:   640px – 1024px
Desktop:  > 1024px
```

Design mobile-first.

Never allow:

* Horizontal scrolling
* Text overflowing cards
* Tables breaking the layout
* Buttons becoming too small
* Maps covering important controls

---

# 28. Loading States

Never leave the user staring at a blank screen.

Use skeletons for:

* Scheme cards
* Partner cards
* Dashboard statistics

Example:

```text
┌─────────────────────────┐
│ █████████████           │
│ ███████████████████     │
│                         │
│ ███████     █████       │
└─────────────────────────┘
```

For recommendation processing:

```text
Analyzing your requirements...

✓ Understanding your needs
✓ Checking scheme requirements
○ Ranking suitable schemes
```

Avoid fake progress percentages.

---

# 29. Error States

Errors should explain what happened and what the user can do next.

### Bad

```text
Error 500
Something went wrong.
```

### Good

```text
We couldn't load scheme information.

Please try again.

[ Try Again ]
```

For network failure:

```text
You're currently offline.

Some information may not be available
until your connection is restored.
```

---

# 30. Empty States

Every major page should have a designed empty state.

Example:

```text
No recommendations yet.

Complete your requirement details to discover
schemes that may match your needs.

[ Find a Scheme ]
```

---

# 31. Notifications

Use notifications only for meaningful events.

Examples:

```text
✓ Recommendation updated
✓ Application information saved
⚠ Additional information required
✕ Unable to load partner information
```

Avoid excessive toast notifications.

---

# 32. Button Hierarchy

Every screen should have one clear primary action.

### Primary

```text
[ Find a Scheme ]
```

### Secondary

```text
[ Compare Schemes ]
```

### Tertiary

```text
View details →
```

### Destructive

```text
[ Delete Application ]
```

Do not make every button visually dominant.

---

# 33. Icons

Use one consistent icon library.

Recommended:

```text
Lucide
```

Icons should support the text, not replace it.

Good:

```text
📍 Find a Partner
```

Better for production:

```text
[location icon] Find a Partner
```

Avoid mixing multiple icon styles.

---

# 34. Tables

Tables should be used primarily for:

* Scheme comparison
* Admin data
* Application records
* Analytics

For mobile, convert complex tables into cards or horizontally scrollable sections only when necessary.

---

# 35. Dashboard Design

The beneficiary dashboard should not look like an enterprise analytics dashboard.

It should focus on actions.

```text
Good morning

Continue where you left off.

┌──────────────────────┐
│ Scheme Matches       │
│ 3 suitable schemes   │
│ [ View ]             │
└──────────────────────┘

┌──────────────────────┐
│ Loan Calculator      │
│ Estimate your EMI    │
│ [ Calculate ]        │
└──────────────────────┘

┌──────────────────────┐
│ Nearby Partners      │
│ 5 available nearby  │
│ [ Find ]             │
└──────────────────────┘
```

---

# 36. Admin Dashboard

The admin interface may be more information-dense.

Main metrics:

```text
Total Schemes
Active Partners
Applications
Recommendations
```

Admin pages should support:

* Search
* Filtering
* Sorting
* Pagination
* Edit
* Enable/disable
* Audit history

Important changes should require confirmation.

---

# 37. Motion & Animation

Animations should communicate state changes.

Use:

* Fade
* Slide
* Expand/collapse
* Skeleton shimmer
* Subtle button feedback

Duration:

```text
100–250ms
```

Avoid:

* Constant floating elements
* Excessive bouncing
* Long page transitions
* Decorative animations
* Distracting background effects

---

# 38. Trust Indicators

Because this is a financial-assistance platform, trust is critical.

Include:

```text
✓ Information-based recommendation
✓ Transparent eligibility criteria
✓ Official scheme references
✓ Secure handling of user information
```

Where applicable, clearly distinguish:

```text
Verified Information
Demo Data
Estimated Calculation
User-provided Information
```

---

# 39. Content Guidelines

Use simple language.

### Instead of:

> "The applicant shall satisfy the aforementioned eligibility criteria."

Use:

> "You may qualify if you meet these requirements."

### Instead of:

> "Financial assistance shall be disbursed through channelizing agencies."

Use:

> "Applications are processed through authorized channel partners."

### Instead of:

> "AI-powered intelligent scheme recommendation."

Use:

> "Find schemes that match your requirements."

---

# 40. Design Principles for AI Coding Agents

Any AI coding agent working on the frontend must follow these rules.

### MUST

* Follow this design system.
* Reuse existing components.
* Maintain consistent spacing.
* Use semantic HTML.
* Make every screen responsive.
* Handle loading, error, and empty states.
* Use accessible form controls.
* Keep primary actions obvious.
* Preserve the established visual language.
* Use real data structures rather than hardcoded UI-only logic.

### MUST NOT

* Introduce random colors.
* Introduce new UI libraries without approval.
* Add unnecessary gradients.
* Add excessive animations.
* Create a different design style for every page.
* Use huge decorative AI elements.
* Hide important eligibility information.
* Claim loan approval.
* Invent government schemes.
* Invent interest rates or eligibility criteria.
* Present demo data as real government data.

---

# 41. Component Design Philosophy

Build reusable components instead of page-specific duplicates.

Recommended component categories:

```text
components/
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Card
│   ├── Badge
│   ├── Modal
│   ├── Alert
│   ├── Skeleton
│   └── Progress
│
├── scheme/
│   ├── SchemeCard
│   ├── SchemeComparison
│   ├── EligibilitySummary
│   └── SchemeDetails
│
├── partner/
│   ├── PartnerCard
│   ├── PartnerList
│   └── PartnerMap
│
├── finance/
│   ├── LoanCalculator
│   └── LoanSummary
│
└── layout/
    ├── Header
    ├── Sidebar
    ├── Footer
    └── PageContainer
```

---

# 42. Design Consistency Rule

Before creating a new component, ask:

> "Does an existing component already solve this problem?"

If yes, reuse it.

If no, create a reusable component rather than a one-off implementation.

---

# 43. Page Inventory

The initial product should contain:

```text
Public
├── Landing
├── About
├── Help
└── Language Selection

Beneficiary
├── Dashboard
├── Scheme Discovery
├── Recommendation Results
├── Scheme Details
├── Scheme Comparison
├── Loan Calculator
├── Partner Locator
├── Partner Details
├── Documents
├── Applications
└── Profile

AI
└── Scheme Assistant

Admin
├── Dashboard
├── Schemes
├── Scheme Rules
├── Partners
├── Applications
├── Users
├── Analytics
└── Audit Logs
```

---

# 44. UX Priority

When making a design decision, follow this order:

```text
1. Accessibility
2. Clarity
3. Trust
4. Usability
5. Performance
6. Visual polish
```

A beautiful interface that users cannot understand is a failed design.

---

# 45. Hackathon Demo Experience

The demo should tell a clear story.

### Step 1

User lands on the platform.

```text
Find financial support
that fits your needs.
```

### Step 2

User selects:

```text
Start a Business
```

### Step 3

User enters:

```text
Project Cost: ₹2,50,000
Annual Income: ₹3,50,000
Location: Selected Location
```

### Step 4

Platform shows:

```text
3 Scheme Matches
```

### Step 5

User opens the top recommendation.

The platform explains:

```text
Why this scheme?
✓ Income requirement met
✓ Purpose supported
✓ Amount within limit
```

### Step 6

User calculates EMI.

### Step 7

User finds the nearest suitable partner.

### Step 8

User sees:

```text
What you need
Where to go
What to bring
What happens next
```

This creates a complete and understandable story for judges.

---

# 46. Final Design Standard

Every screen in the application should answer three questions:

### Where am I?

The navigation and page title should make this obvious.

### What am I looking at?

Information should be grouped and labelled clearly.

### What should I do next?

Every important screen should provide an obvious next action.

---

# 47. Design North Star

The final product should feel like:

> **A trustworthy digital financial-assistance guide that helps an ordinary citizen move from "I don't know which scheme I need" to "I understand my options and know where to go next."**

The technology should stay in the background.

The user experience should remain in the foreground.
