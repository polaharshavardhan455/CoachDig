# CoachDig
## Problem Statement

### Who is Suffering
Students across India — from tier 1 cities to tier 3 towns,school students preparing for JEE/NEET,graduates preparing for GATE/UPSC,and freshers seeking tech skill training.Anyone who has ever paid for coaching and wondered if they made the right choice.
### Why It Happens
College curriculums don't prepare students for:
- GATE → needs problem based learning
- JEE/NEET → needs different methods than curriculum
- Tech skills → needs industry relevant training
So students are forced to seek external coaching.
But choosing the wrong one leads to:
- Financial loss (lakhs spent)
- Time loss (1-2 years gone)
- Long term career damage
### How They're Currently Choosing
1. Advertisements
2. Word of mouth
3. Fancy offices and big claims
4. No verified data to cross check

### What's Missing
- Honest, unbiased performance data
- Most review websites are paid by coachings
- Only positive reviews surface
- Red flags are hidden or removed
- Real success/failure ratios unavailable

### The Real Cost
- Lakhs of rupees from struggling families
- Mental stress on students and parents
- Students becoming substandard employees
  after wrong tech coaching
- Years of life lost on wrong decisions
---

## Solution

CoachDig gives students what no platform currently offers:

- Real performance data → not self reported by coachings
- One place comparison → all exams, all coachings
- Verified Red Flags → personally investigated, not algorithm
- Better visualizations → graphs, trends, year on year data
- Public honest ratings → Reddit, student calls, ground research
- AI Assistant (Phase 3) → ask questions, get honest coaching advice

### Core Action Flow
Search → See Real Performance → Decide

---

## Competitors

| Platform | Problem |
|----------|---------|
| Careers360 | Paid listings, coachings pay for better ranks |
| Shiksha.com | Only positive reviews, no red flags |
| Google Reviews | Easily manipulated, fake reviews common |
| Reddit | Honest but scattered, no structure |
| YouTube reviews | Influenced, sponsored content |

### What Makes CoachDig Different
- We are not paid by any coaching centre. Ever.
- Red flags are personally verified, not crowdsourced
- Success rate = students who cleared / students who joined
  (not what coaching claims)
- Focus on tier 2/3 city coachings ignored by big platforms
- Domain specific: JEE/NEET, GATE, UPSC, Tech — not generic

---

## Challenges

### Data Collection (Hardest Problem)
- Coachings hide failure data
- Students hesitant to share honest opinions publicly
- No central database of results exists in India
- Scraping has legal grey areas

### Trust Building
- Why would a coaching share real numbers?
- Why would students trust a new unknown platform?
- Fake reviews can be submitted

### Sustainability
- No paid listings = no easy revenue model
- Need alternative: premium student features,
  counselling connect, or grant funding

### Scale
- 15 coachings manually researched is doable
- 1500 coachings needs a different system entirely

---

## Phases

### Phase 1 — Foundation (May - July 2025)
Simple webapp with manually researched data

Scope:
- 15 coaching centres
- JEE/NEET → 2-3 centres
- GATE → 2 centres
- UPSC → 2 centres
- Tech/CS coaching → 3 centres (highest scam rate)

Features:
- Search by coaching name or exam type
- Students entered vs students who cleared
- Pricing plans
- Public ratings (Reddit + personal research)
- Red flags and cons section
- Performance graph (year on year)

Stack:
- Frontend: HTML/CSS (ugly is fine)
- Backend: Python + Flask
- Database: Supabase (free tier)
- Hosting: Vercel + Render (free)

### Phase 2 — Credibility (August - October 2025)
- Students submit verified results (marksheet upload)
- Coaching claims vs actual data comparison
- Coaching A vs Coaching B direct comparison
- Filter by city, exam, fees range
- Anonymous student reviews

### Phase 3 — Intelligence (November 2025 onwards)
- AI Assistant → "Which GATE coaching in Hyderabad
  under 50k has best success rate?"
- Scrape publicly available result PDFs
- Trend detection → coaching improving or declining
- Price vs performance index
- Red flag auto detection from review patterns

### Phase 4 — Community (2026)
- Student to student Q&A
- Connect with students currently enrolled
- Counsellor network for confused students
- RTI data integration (Right to Information)

---

## Current Status

🟡 Research Phase — May 2025

- [ ] Talk to 2 students per coaching category
- [ ] Collect ground data on 15 centres
- [ ] Identify public data sources
- [ ] Build Phase 1 webapp

---

## Why This Exists

Built by someone from a tier 3 college
who watched students — including people around him —
spend everything their family had
on coachings that promised the world
and delivered nothing.

No investor. No team. No fancy office.
Just data, honesty, and students who deserve better.
