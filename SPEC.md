# SPEC.md — Båtintygsplattform v2

> **Build specification for Claude Code**  
> **Document status:** Product, learning-design, content, legal-risk, and engineering source of truth  
> **Version:** 2.0  
> **Research last checked:** 2026-07-16  
> **Primary launch market:** Sweden  
> **Product language:** Swedish (`sv-SE`)  
> **Specification language:** English, with Swedish UI copy examples  
> **Working product name:** `Sjöklart` (placeholder; run a trademark/domain check before use)

Place this file in the repository root as `SPEC.md`, next to `CLAUDE.md`. Claude Code must read this document before changing application code. When code, tickets, or older product notes conflict with this specification, this specification wins unless a newer signed decision record explicitly supersedes it.

---

## 0. How to use this document

This is intentionally more than a feature list. It combines:

1. verified product constraints from the relevant Swedish authorities;
2. a commercial recommendation;
3. a learning system for theory and practical preparation;
4. interaction specifications for charts, radio, rules, lights, knots, and weather;
5. a content-governance and review process;
6. a build-ready technical architecture and data model;
7. milestones with Definitions of Done;
8. launch, legal, accessibility, security, and analytics requirements.

### 0.1 Instruction hierarchy for Claude Code

Use this order when resolving ambiguity:

1. Laws, official requirements, and current primary-source material.
2. Domain guardrails and safety rules in this specification.
3. Accepted architecture decision records in `/docs/adr`.
4. This specification.
5. Tests.
6. Existing implementation.
7. Ticket descriptions and informal notes.

If an official requirement is unclear or appears to have changed, do **not** silently encode an assumption. Add a configurable value, label the assumption in the admin interface, create a `HUMAN_VERIFY` issue, and keep public copy conservative.

### 0.2 Mandatory terminology

Use these distinctions everywhere:

- **Utbildning / förberedelse / övning:** what this product provides.
- **Prov:** the real assessment booked separately through NFB or an approved organiser.
- **Intyg:** issued through the official process, never by this product.
- **Träningssimulering:** our timed practice experience when the precise official item count or structure has not been published.
- **Officiellt övningsprov:** only material explicitly published as such by NFB. Do not reproduce it without permission.

Never call the product, its questions, its chart, or its radio simulator “official”, “NFB-approved”, or “identical to the real exam” unless written permission has been obtained and recorded.

### 0.3 Non-negotiable launch gate

No certification product may be sold until:

- its syllabus version has been mapped to current official requirements;
- every live instructional claim has a primary-source reference;
- every live assessment item has passed domain review;
- exam duration and pass rule have been verified and date-stamped;
- legal copy, consumer terms, privacy handling, and minor-account flow have been reviewed;
- the product clearly states that the real exam and certificate are separate.

---

# Part I — Product and commercial strategy

## 1. Executive recommendation

Build a serious Swedish exam-preparation platform whose main advantage is **learning by doing**, not a larger pile of text or generic multiple-choice questions.

The recommended value proposition is:

> **“Lär dig det du faktiskt behöver kunna — med interaktivt sjökortsarbete, tydlig återkoppling och en plan fram till provdagen.”**

The product should combine five strengths:

1. **Verified curriculum coverage.** Every lesson and question maps to a current objective and primary source.
2. **Interactive procedural practice.** Learners measure, plot, choose, listen, transmit, diagnose, and plan rather than only recognise answers.
3. **Adaptive preparation.** The study plan prioritises weak, overdue, safety-critical, and exam-relevant skills.
4. **Transparent readiness.** The dashboard explains what is mastered, what is weak, and why the learner is or is not ready.
5. **Professional trust.** Original illustrations, restrained Scandinavian visual design, expert review, version dates, and precise disclaimers.

### 1.1 Recommended launch sequence

Do not launch all requested certificates at once. The platform and data model must support all of them, but the content should ship in this order:

| Release | Product | Why this order |
|---|---|---|
| v1 | Förarintyg | Broadest beginner demand; proves the study engine and chart lab. |
| v1.1 | Båtpraktik dag preparation | Natural companion to Förarintyg and a lead source for partner instructors. It is preparation for supervised practice, not an online certificate. |
| v1.2 | SRC preparation | Strong fit for a radio scenario simulator and audio-based practice. Must direct learners to NFB’s mandatory simulator. |
| v2 | Kustskepparintyg | Reuses the chart engine but requires substantially deeper navigation content and stricter review. |
| v2.1 | Seglarintyg 1 preparation | Add practical-readiness tools and provider partnerships. |
| Later | Seglarintyg 2 and 3 | Smaller, more advanced market; practical assessment is central. |

### 1.2 What not to compete on

Do not position the product as:

- the cheapest PDF course;
- a question dump;
- a shortcut that guarantees a certificate;
- a replacement for supervised practical training;
- a navigation application for use at sea;
- an official NFB service;
- a copy of a competitor’s course, chart, illustrations, questions, or simulator.

### 1.3 Product thesis

Existing online offerings commonly combine text, video, chapter tests, and practice exams. Free resources also exist for lights, sound signals, chart symbols, VHF phrases, and sample questions. Therefore, “we have lessons and quizzes” is not sufficient differentiation.

The defensible product is the integrated system:

- original fictional chart environment;
- graduated chart-skills curriculum;
- adaptive review and misconception diagnosis;
- realistic scenario trainers;
- instructor-reviewed content provenance;
- exam-date planning;
- exports for lightweight memorisation;
- clear bridge from online theory to required physical or supervised practice.

## 2. Audit of the earlier specification

The previous draft is a strong technical starting point. Keep its emphasis on pure business logic, RLS, test coverage, original chart assets, content review, Stripe idempotency, and a milestone-based build. Replace or amend the following items before development.

### 2.1 Keep

- Next.js App Router, strict TypeScript, Supabase in an EU region, Stripe Checkout, Resend, PostHog EU, Vitest, Playwright, and Vercel.
- A fictional, original practice chart whose interaction layer depends on a manifest rather than artwork coordinates embedded in components.
- `ts-fsrs` for memory scheduling rather than a custom spaced-repetition algorithm.
- Pure functions for chart mathematics, grading, exam assembly, entitlement decisions, and readiness calculations.
- Status-gated content and mandatory `source_ref`/source citations.
- A public free experience as the primary acquisition loop.
- Explicit separation between this training service and the real NFB exam.

### 2.2 Correct immediately

1. **Do not hard-code “50 questions, five sections, 60% in every section”.** Current NFB information states a 75% pass threshold for the relevant digital exams and certificate-specific time limits. The current public pages do not establish a universal 50-question/five-section structure. Section scores may be useful diagnostics, but must not be presented as an official pass rule unless verified.
2. **Båtpraktik dag is not an online exam.** It is a supervised practical exercise. The digital product may prepare, brief, checklist, log, and debrief; it must not issue or imply completion of the official practical certificate.
3. **SRC has an official NFB simulator step.** Our radio lab is supplementary preparation. It must not clone or replace NFB’s simulator and must link learners to the official process.
4. **“Seglarintyg” is not one product.** NFB has Seglarintyg 1, 2, and 3, each with practical and theoretical requirements and different prerequisites.
5. **The age-12 Förarintyg audience creates a minor-data and contracting requirement.** The purchaser flow must support a guardian-owned account and a separate learner profile.
6. **Do not make pass-rate claims from a small, self-selected email survey.** Display any outcome statistic only with a clearly defined denominator, minimum sample, confidence interval, and “self-reported” label.
7. **Do not auto-refund a broad pass guarantee without fraud and legal controls.** Prefer a narrowly defined study guarantee, manual review, or continued-access promise.
8. **Do not treat item volume as the primary quality target.** A smaller, fully reviewed and instrumented bank is safer than 900 lightly reviewed generated questions.

### 2.3 Improve structurally

- Separate memory scheduling from procedural-skill mastery.
- Add content and source versioning, reviewer attribution, audit logs, and stale-content workflows.
- Normalise exam-session items rather than storing a UUID array.
- Add prerequisite graphs between certifications and objectives.
- Add guardian consent, learner profiles, marketing consent, legal acceptance, and deletion workflows.
- Add a physical-material bridge and partnership strategy because the actual Förarintyg and Kustskepparintyg workflows require physical charts/tools.
- Add accessibility alternatives for chart interactions.
- Add a first-party “error notebook” and misconception taxonomy.
- Make official exam facts data-driven, date-stamped, and editable without deploying code.

## 3. Truth hierarchy and research policy

### 3.1 Source hierarchy

Use content sources in this order:

1. Current NFB product pages and current NFB knowledge-requirement PDFs.
2. Swedish authorities: Transportstyrelsen, PTS, Sjöfartsverket, Konsumentverket, IMY, Skatteverket, MSB, SMHI, and applicable Swedish law.
3. International primary standards and conventions where relevant: COLREG, IALA, ITU/CEPT, GMDSS, INT-1 facts, and manufacturer-neutral technical standards.
4. Commissioned domain experts and approved internal interpretations.
5. Commercial providers only for feature and positioning research, never as the factual source for lessons or questions.

### 3.2 Research record requirements

Every imported source must store:

- title;
- issuing organisation;
- canonical URL;
- document version/effective date;
- date retrieved;
- file checksum where a file is stored;
- licence/copyright notes;
- affected certifications and objectives;
- next review date;
- reviewer and review status.

### 3.3 Change monitoring

Create a monthly scheduled job that checks headers, file hashes, or page fingerprints for high-priority official sources. A detected change must:

1. create an admin alert;
2. mark affected objectives `review_required`;
3. prevent new AI-generated drafts against the obsolete source version;
4. not automatically unpublish content unless a reviewer marks it unsafe;
5. create a change log visible to admins.

### 3.4 Competitor research guardrail

Competitors may be used to answer questions such as:

- Which features are common?
- What access periods and price anchors are visible?
- Which free tools attract traffic?
- Which trust objections are addressed?

Competitor lessons, wording, diagrams, videos, question banks, answer explanations, course structures, and chart exercises must never be ingested into the generation pipeline.

## 4. Verified official-fact register

The values below were checked on 2026-07-16. They must still be rechecked before launch and stored as editable, date-stamped configuration rather than constants hidden in code.

| Topic | Current product rule to implement | Public-copy rule |
|---|---|---|
| NFB role | NFB defines requirements, administers the official digital process, and issues certificates; course providers prepare learners. | State that the platform is independent and that exam booking/certificate issuance happen separately. |
| General digital exam pass threshold | 75% for the relevant certificates in this scope. | Never claim a per-section pass rule unless a current source establishes it. |
| Förarintyg time | Maximum 90 minutes. | Display “Nuvarande officiell provtid: högst 90 minuter”, with last-checked date. |
| Kustskepparintyg time | Maximum 120 minutes. | Same date-stamped wording. |
| SRC digital time | Maximum 60 minutes; official requirements also include practical/simulator competence. | Explain the separate official simulator/process. |
| Förarintyg minimum age | 12 years. | Purchases remain guardian/adult-owned where the learner is a minor. |
| Kustskeppar prerequisites | Age 15, Förarintyg, and Båtpraktik day/night for a valid certificate; current NFB material must be checked for exact sequencing. | Show prerequisites clearly; never promise that an online module fulfils practical requirements. |
| SRC prerequisite/process | Age 15; complete the free NFB VHF simulator before purchasing the official exam licence. | Link to NFB and label our simulator as extra practice. |
| Seglarintyg | Levels 1–3; practical and theoretical assessment. | Sell “förberedelse”, not a fully online certificate. |
| Båtpraktik dag | A supervised exercise, not a conventional written exam. | Use “förberedelse inför Båtpraktik” throughout. |
| Official exam cost | Fees can change and are paid separately from this product. At the research date, NFB described a licence fee plus a booking fee. | Never bundle official fees into our price unless contractually arranged. Show “betalas separat” and last-checked date. |
| VHF operation | A PTS radio permit is required to use marine VHF in a leisure boat; competence and MMSI/DSC rules also apply. | Include a post-certificate checklist, without presenting legal advice as personalised advice. |
| Chart copyright | Sjöfartsverket requires permission to publish chart extracts or create a map using its chart information as a basis/model. | Use only original fictional charts unless a written licence is obtained. |

## 5. Product principles

1. **Source before feature.** No lesson or item without a traceable source.
2. **Practice before polish.** Prioritise learner actions and feedback over long passive videos.
3. **Teach the procedure, not merely the answer.** Show reasoning steps and then fade support.
4. **Measure readiness, not vanity activity.** Minutes watched and streaks are secondary.
5. **Never hide uncertainty.** Unknown official details remain configurable and explicitly labelled.
6. **No unsafe realism.** The chart is fictional and watermarked; the service is not for real navigation.
7. **Human review is mandatory.** AI drafts; experts approve.
8. **Minors deserve a safer default.** No profiling, manipulative urgency, or unnecessary data collection.
9. **Accessible alternatives are first-class.** Every core learning objective must have a non-pointer-only path where feasible.
10. **Professional, calm, and precise.** Avoid childish gamification and fear-based selling.

## 6. Target users and jobs to be done

### 6.1 Primary personas

#### A. First-time motorboat owner

- Age: typically adult, but may be buying for a 12–17-year-old family member.
- Goal: understand rules, safety, and basic navigation; pass Förarintyg.
- Friction: unfamiliar vocabulary, chart tools, uncertainty about what the real process requires.
- Winning experience: a diagnostic, short study plan, clear worked examples, and visible improvement in chart work.

#### B. Experienced boat user formalising knowledge

- Goal: prepare quickly without sitting through a broad beginner course.
- Friction: overconfidence, patchy rules knowledge, poor recall of sound/light signals.
- Winning experience: fast diagnostic, “test out” of mastered objectives, targeted weak-area practice.

#### C. Kustskeppar progression learner

- Goal: travel farther, handle darkness/restricted visibility, and complete a more advanced certificate.
- Friction: multi-step chart calculations, prerequisites, publication/document knowledge, and a larger syllabus.
- Winning experience: advanced chart scenarios, explicit prerequisite tracker, and procedural mastery rather than question memorisation.

#### D. SRC learner

- Goal: communicate confidently and correctly, especially in distress/urgency scenarios.
- Friction: unfamiliar radio controls, protocol order, marine English, anxiety about speaking.
- Winning experience: listen-repeat-record scenarios, a generic interactive radio, immediate sequence feedback, and a clear official-process checklist.

#### E. Sailing learner

- Goal: prepare theory and practical routines before supervised sailing assessment.
- Friction: theory is disconnected from boat handling; practical confidence varies.
- Winning experience: manoeuvre visualisations, briefing checklists, self-assessment, instructor handoff, and debrief logs.

#### F. Guardian purchasing for a minor

- Goal: give the learner a trustworthy, age-appropriate course and see progress.
- Friction: payment/account ownership, privacy, and knowing what remains to be done offline.
- Winning experience: guardian account, learner PIN/profile, progress summary, no advertising to the child, and explicit official next steps.

### 6.2 Core jobs

- “Tell me exactly what I need to learn and what I still cannot do.”
- “Let me practise chart work repeatedly without consuming paper exercises.”
- “Explain why my answer is wrong, not just which option is correct.”
- “Give me a realistic plan based on my exam date.”
- “Help me remember facts without rereading the whole course.”
- “Prepare me for supervised practice without pretending it can be completed online.”
- “Show me how the official process, fees, materials, and prerequisites fit together.”

### 6.3 Anti-personas

The product is not designed for:

- professional maritime certification;
- live voyage planning;
- replacement of official charts, notices, or navigation systems;
- people seeking leaked or memorised official questions;
- automatic issuance of NFB certificates;
- unsupervised practical certification.

---

# Part II — Catalogue, packaging, brand, and user experience

## 7. Certification catalogue and product boundaries

Represent every learning offer as a `certification` plus one or more sellable `products`. A certification describes official requirements; a product describes access and commercial packaging.

### 7.1 Certification IDs

Use stable machine IDs:

```text
forarintyg
batpraktik_dag_prep
batpraktik_morker_prep
kustskepparintyg
src
seglarintyg_1
seglarintyg_2
seglarintyg_3
```

Do not use `seglarintyg` as a single ID.

### 7.2 Förarintyg product boundary

**The product teaches:**

- chart concepts and chart symbols;
- marks, lights, courses, position, speed/time/distance;
- basic compass concepts including variation/deviation at the level required by the current syllabus;
- navigation planning within the intended scope;
- collision regulations, sound/light/day signals, and traffic behaviour;
- safety, seamanship, first aid, environment, weather, and relevant regulations;
- test-taking and time management.

**The product does not:**

- issue the certificate;
- supply an official chart unless separately licensed/fulfilled by a partner;
- replace required physical equipment;
- provide real-voyage navigation advice.

### 7.3 Båtpraktik preparation boundary

**The product may provide:**

- official-requirement overview;
- interactive pre-brief;
- personal equipment and boat-safety checklist;
- manoeuvre diagrams and short original videos;
- knots and line-handling trainer;
- electronic-chart settings/overzoom simulation;
- waypoint/MOB button simulation;
- practice log and instructor handoff sheet;
- provider directory or booking referral;
- post-session reflection and remediation.

**The product must not:**

- mark the official practical exercise complete;
- generate a certificate;
- allow a self-attestation to appear equivalent to instructor sign-off;
- call a web quiz a “Båtpraktikprov”.

### 7.4 Kustskepparintyg product boundary

Build on Förarintyg with:

- advanced chart work;
- route and passage planning;
- night and restricted-visibility knowledge;
- light characteristics and sectors;
- satellite navigation, radar/AIS awareness, VHF and publications at the required level;
- safety, seamanship, weather, environment, customs/documentation, and relevant regulations;
- prerequisite tracking for Förarintyg and practical requirements.

Do not sell Kustskeppar access as “complete” until the chart and navigation modules have been reviewed by a qualified navigation instructor.

### 7.5 SRC product boundary

**The product teaches and practises:**

- VHF controls and generic radio operation;
- channels and station types;
- call structure;
- distress, urgency, and safety communications;
- DSC concepts, MMSI, position transfer, EPIRB/SART/NAVTEX/GMDSS concepts at the required level;
- phonetic alphabet and marine English;
- false-alert handling and traffic procedures;
- listening, speaking, and sequence fluency.

**The product must:**

- direct the learner to NFB’s current mandatory simulator/process;
- use an original, manufacturer-neutral radio interface;
- avoid copying NFB simulator screens, wording, scenario sequence, or assets;
- explain the separate PTS permit step for operating VHF on a leisure boat.

### 7.6 Seglarintyg product boundaries

Each level is a separate curriculum.

- **Seglarintyg 1 preparation:** basic sailing theory, boat parts, points of sail, sail handling, tack/gybe, docking, collision rules, knots, MOB, weather, and practical-readiness checklists.
- **Seglarintyg 2 preparation:** requires Seglarintyg 1 and Förarintyg in the current official structure; adds modern yacht equipment, maintenance, trim, confined manoeuvring, anchoring, seamanship, heavier MOB drills, and local weather/fog.
- **Seglarintyg 3 preparation:** requires Seglarintyg 2 and Kustskepparintyg in the current official structure; adds offshore/heavy-weather preparation, advanced sail/rig handling, night/offshore work, weather interpretation, MOB, and maintenance.

The digital product can support theory and practical readiness. It cannot substitute for practical assessment.

## 8. Release scope

### 8.1 v1 launch scope: Förarintyg

**Required:**

- public marketing site;
- guardian-safe account and learner profiles;
- checkout and 12-month entitlement;
- diagnostic assessment;
- syllabus browser and short lessons;
- adaptive study sessions;
- MCQ, multi-select, numeric, ordering, matching, hotspot, and chart tasks;
- original interactive chart with at least the Foundation and Intermediate task families;
- rules/lights/day-shapes/sound-signals trainers;
- readiness dashboard;
- configurable timed training simulations;
- error notebook;
- Anki package and Quizlet-compatible export;
- admin content studio;
- source/version/review workflow;
- public free diagnostic/chart demo;
- account deletion/export;
- analytics and support tooling.

**Not required for the first paid beta:**

- AI tutor;
- native mobile applications;
- community/forum;
- B2B school accounts;
- live instructor marketplace;
- full offline exam simulation;
- real chart imagery;
- automated pass guarantee refunds;
- Kust, SRC, or Seglar paid content.

### 8.2 v1 content launch targets

Use quality gates rather than vanity totals. Initial targets:

| Content type | Paid beta minimum | Public launch target |
|---|---:|---:|
| Atomic Förar objectives | 55 | 65–85, depending on final taxonomy |
| Reviewed assessment items | 220 | 350–450 |
| Interactive chart tasks | 45 | 80–120 |
| Worked chart examples | 18 | 30 |
| Rules/lights/signal scenarios | 40 | 75 |
| Short lessons | 45 | 65–85 |
| Full training simulations | generated from blueprint | enough item diversity for 5 low-overlap attempts |
| Free diagnostic items | 15 | 20–25 |
| Free interactive chart tasks | 2 | 3–5 |

No objective may launch with only one item. Critical safety/rules objectives should have at least six reviewed variants and at least two formats.

### 8.3 Content quality launch gate

A certification is sellable only when:

- 100% of required objectives have at least one reviewed lesson;
- 100% have at least four reviewed assessment opportunities, or an approved exception for a practical-only objective;
- all safety-critical objectives have reviewer sign-off from two people or one qualified domain reviewer plus editorial review;
- every item has a source citation, explanation, misconception tags, difficulty estimate, and accessibility review;
- two independent experts have run the full training simulation and logged no critical content errors;
- no unresolved `blocker` or `safety` content issue remains.

## 9. Commercial model

### 9.1 Pricing principle

The earlier proposed price of 495 kr for Förarintyg may be too low for a professionally reviewed, interactive product. Current commercial competitors visibly anchor complete online Förarintyg offers around the high hundreds to low thousands of kronor, often including or upselling physical materials. Treat pricing as a hypothesis and test it before hard-coding.

Recommended initial packaging, inclusive of VAT, subject to accountant/legal confirmation:

| Product | Price hypothesis | Includes |
|---|---:|---|
| Free | 0 kr | Diagnostic, selected lessons, 15–25 questions, 2–5 chart tasks, readiness preview. |
| Förarintyg Digital | 795–995 kr | 12 months, full course, chart lab, adaptive study, simulations, deck exports. |
| Förarintyg Plus | 1,195–1,495 kr | Digital plus a physical chart/tool-kit voucher or partner fulfilment and one group Q&A. |
| SRC Digital | 495–695 kr | Full theory, radio lab, audio scenarios, official-process guide. |
| Kustskeppar Digital | 995–1,295 kr | Advanced curriculum and chart lab. |
| Seglarintyg 1 Prep | 595–795 kr | Theory and practical-readiness companion; practical assessment separate. |
| All-access bundle | 1,995–2,495 kr | Available products for 18 months, not lifetime. |

Do not advertise a crossed-out “ordinary price” unless it has actually been charged for a legally meaningful period.

### 9.2 Recommended access model

- One-time purchase.
- 12 months for single-certification products.
- 18 months for a multi-certification progression bundle.
- Entitlement extensions for verified source updates or support remedies.
- No silent auto-renewal in v1.
- Content updates included during entitlement.

### 9.3 Free acquisition model

Do not hide a basic result behind mandatory email capture. Use:

1. immediate on-screen result;
2. optional email for a detailed study plan and saved progress;
3. separate unticked marketing consent;
4. age/guardian-safe copy;
5. one free interactive task that demonstrates the differentiator.

This is more trustworthy and reduces the risk of treating personal data as hidden payment for results.

### 9.4 Upsells and partnerships

Permitted, clearly separated upsells:

- official/authorised physical chart and navigation-tool kit from a partner;
- Båtpraktik provider booking referral;
- live online Q&A;
- instructor-reviewed chart assignment pack;
- family/second learner profile;
- Kust or SRC progression bundle.

Do not accept referral fees from providers without a disclosure on the directory/listing.

### 9.5 Guarantee recommendation

Use a **Studiegaranti**, not an unconditional “pass guarantee”, for v1.

Recommended promise:

> “Har du följt hela din personliga studieplan, uppnått godkänd beredskap och ändå inte klarat provet? Då förlänger vi din tillgång utan kostnad och granskar din studieplan tillsammans med dig.”

Optional later benefit after legal review:

- one additional 12-month access period;
- a credit up to a fixed amount toward a new official exam booking;
- manual verification of completion and official result.

Never automatically refund solely from a self-reported failure link. Never suggest that completing the app guarantees a certificate.

### 9.6 Refund and withdrawal handling

- Display prices inclusive of VAT.
- Record product price, VAT rate, currency, country, terms version, and consent evidence at checkout.
- Use an unchecked, explicit consent control if immediate delivery is intended to affect the statutory withdrawal right for digital content/service.
- Send durable confirmation by email.
- Preserve statutory complaint/remedy rights even where withdrawal rights are waived.
- Have Swedish counsel approve the exact checkout wording and classification of the service.

## 10. Brand and visual direction

### 10.1 Brand attributes

- competent;
- calm;
- exact;
- maritime without nostalgia kitsch;
- supportive without being childish;
- modern Swedish public-service clarity with commercial polish.

### 10.2 Visual system

Recommended palette direction, to be validated for contrast:

- deep navy for structure and authority;
- off-white/warm paper for reading surfaces;
- muted sea blue for interactive elements;
- restrained amber for warnings;
- green only for confirmed success;
- red only for errors/safety-critical states.

Do not rely on red/green alone. Pair colour with labels, icons, patterns, and text.

### 10.3 Typography

Use a highly legible variable sans-serif with strong Swedish glyph support. A secondary serif may be used sparingly for editorial headings, but the learning and chart interfaces should remain sans-serif. Avoid condensed display fonts.

### 10.4 UI tone

Preferred:

- “Du har tre områden kvar att befästa.”
- “Det här steget blev fel eftersom deviationen ska läggas till med sitt tecken.”
- “Öva två uppgifter till innan du går vidare.”

Avoid:

- “Oops!”
- excessive celebration;
- fake urgency;
- infantilising badges;
- “Du kommer garanterat att klara provet.”

### 10.5 Trust blocks

Every product page should show:

- what the product prepares for;
- what is not included;
- the current official next steps;
- source/version last checked;
- reviewer credentials once available;
- support response promise;
- access duration;
- exact price including VAT;
- separate official exam/material costs;
- independent-service disclaimer.

## 11. Information architecture

### 11.1 Public routes

```text
/
/forarintyg
/kustskepparintyg
/src
/batpraktik
/seglarintyg-1
/seglarintyg-2
/seglarintyg-3
/priser
/gratis-kunskapstest
/gratis-sjokortsovning
/sa-fungerar-provet
/kunskapsbank/[slug]
/ordlista/[term]
/om-oss
/experter-och-kallor
/kundtjanst
/kopvillkor
/integritet
/cookies
/tillganglighet
/sakerhetsinformation
```

Unlaunched product pages may exist as accurate waitlist pages, but must not imply that content is available.

### 11.2 Authenticated routes

```text
/app
/app/start
/app/plan
/app/kurser
/app/kurser/[certification]
/app/lektion/[lessonId]
/app/ova
/app/ova/session/[sessionId]
/app/sjokort
/app/sjokort/[scenarioId]
/app/regler
/app/ljus-signaler
/app/radio
/app/simuleringar
/app/simuleringar/[sessionId]
/app/felbok
/app/framsteg
/app/material
/app/decks
/app/praktik
/app/profil
/app/konto
/app/support
```

### 11.3 Guardian routes

```text
/app/guardian
/app/guardian/learners
/app/guardian/learners/[learnerId]
/app/guardian/consents
/app/guardian/purchases
```

### 11.4 Admin routes

```text
/admin
/admin/certifications
/admin/syllabi
/admin/objectives
/admin/lessons
/admin/items
/admin/review
/admin/sources
/admin/charts
/admin/simulators
/admin/users
/admin/orders
/admin/refunds
/admin/outcomes
/admin/analytics
/admin/audit
/admin/settings/official-facts
```

## 12. End-to-end user journeys

### 12.1 Adult learner purchase journey

1. Land on a certificate page.
2. See the independent-service disclaimer and official process.
3. Try a free chart task or diagnostic.
4. Receive an immediate result.
5. Optionally save the result with email or continue to purchase.
6. Create/sign in with magic link or passkey when supported.
7. Confirm learner age group and whether purchaser and learner are the same person.
8. Accept terms and checkout consent.
9. Pay through Stripe Checkout.
10. Webhook grants entitlement idempotently.
11. Enter exam date if booked; otherwise choose a target pace.
12. Complete diagnostic.
13. Receive a study plan and first 15–20 minute session.

### 12.2 Guardian purchase journey

1. Adult purchases using their own identity/contact information.
2. Create a learner profile with minimal data: display name, age band, target certificate, optional exam date.
3. Record guardian relationship/authority and current policy acceptance.
4. Give learner either a short-lived sign-in link or local PIN tied to the guardian account.
5. Learner sees no marketing, payment, or third-party profiling controls.
6. Guardian receives progress summaries and manages deletion/export.

Avoid collecting the child’s full legal name or personal identity number unless a later official integration makes it necessary and legal review approves it.

### 12.3 Returning study journey

Dashboard prioritises one primary action:

> “Dagens pass — cirka 18 minuter”

The session contains:

1. overdue memory reviews;
2. one weak prerequisite refresher;
3. one worked example or guided procedural task;
4. 3–6 independent mixed tasks;
5. a short reflection/error classification;
6. next recommended action.

### 12.4 Failed-task journey

On a learning-mode error:

1. preserve the learner’s answer/line/sequence;
2. show correctness and tolerance clearly;
3. explain the exact error in one sentence;
4. show the correct method step by step;
5. explain relevant distractors or misconception;
6. cite the lesson/source in accessible form;
7. offer “försök igen med ny variant”, not the identical item;
8. add the underlying objective/misconception to the error notebook;
9. schedule a later independent retrieval.

### 12.5 Exam simulation journey

1. Show verified duration, pass threshold, allowed aids, and a non-official-format disclaimer where needed.
2. Run a device/tool check.
3. Assemble a low-overlap, blueprint-balanced item set.
4. Start server-authoritative timer.
5. Do not provide correctness feedback during the session.
6. Auto-save every response.
7. Allow flagging and navigation consistent with the intended simulation mode.
8. Submit manually or at timeout.
9. Show overall result under the configured rule.
10. Show diagnostic sections/objectives separately from official pass calculation.
11. Generate a remediation plan.

### 12.6 Official next-step journey

After readiness is achieved:

- show the current official process;
- list separately paid exam fees/materials;
- link to NFB and approved booking information;
- remind the learner which physical tools/materials are required;
- explain prerequisites;
- state when the information was last checked;
- never deep-link directly into a purchase flow that bypasses official prerequisites.

---

# Part III — Learning system

## 13. Instructional model

The learning system must be designed around retrieval practice, spacing, interleaving, worked examples, and deliberate procedural practice.

### 13.1 Standard learning sequence

For each objective, use this progression:

1. **Orientera** — explain why the skill matters and connect it to a realistic boating decision.
2. **Se ett löst exempel** — show a complete worked example with labelled steps.
3. **Gör med stöd** — learner completes a similar task with prompts and optional hints.
4. **Gör själv** — learner performs without hints.
5. **Förklara** — learner selects or states why the method/rule applies.
6. **Blanda** — interleave with neighbouring objectives so the learner must choose the method.
7. **Återkalla senare** — schedule retrieval after delay.
8. **Tillämpa under tid** — include in a timed mixed simulation.
9. **Reparera felmönster** — remediate recurring misconception, not only the individual item.

### 13.2 Learning modes

| Mode | Feedback | Hints | Timer | Purpose |
|---|---|---|---|---|
| Lesson check | Immediate | Yes | No | Comprehension while learning. |
| Guided practice | Step-level immediate | Yes, progressively | Optional soft timer | Build procedure. |
| Independent practice | After answer | No by default | Optional | Retrieval and transfer. |
| Mastery check | After short set | No | Yes, moderate | Verify objective mastery. |
| Training simulation | End of session | No | Official/configured | Exam readiness. |
| Free diagnostic | After each or at end, configurable | No | No | Demonstrate value and estimate gaps. |

### 13.3 Feedback rules

Immediate feedback in learning mode must include:

- result;
- correct method;
- the learner’s exact deviation/error;
- why the correct answer is correct;
- why each plausible wrong option is wrong where useful;
- a concise source reference;
- a new-variant retry.

Do not show a long wall of text by default. Use progressive disclosure:

1. one-sentence diagnosis;
2. visual correction/step list;
3. deeper explanation;
4. source and related lesson.

### 13.4 Confidence and calibration

After selected independent items, ask:

```text
Hur säker var du?
[ Gissade ] [ Ganska säker ] [ Mycket säker ]
```

Use confidence for metacognitive feedback, not as the primary correctness score.

Calibration cases:

- wrong + very sure → high-priority misconception;
- correct + guessed → not mastered;
- repeated correct + appropriately confident → stronger evidence;
- correct + consistently low confidence → schedule explanation/reassurance, not excessive repetition.

### 13.5 Hints

Hints are tiered:

1. **Concept cue:** which rule/formula/tool family applies.
2. **Step cue:** identify the next operation.
3. **Partial completion:** fill one step and ask learner to continue.
4. **Reveal:** show the worked solution.

Any hint beyond tier 1 means the attempt cannot count as independent mastery. Revealed answers are recorded as unsuccessful learning evidence even when the final field becomes correct.

### 13.6 Error notebook (`Felboken`)

Every meaningful error is classified into one or more tags:

```text
knowledge_gap
rule_confusion
sign_error
unit_error
chart_reading
measurement_error
tool_use
sequence_error
language_term
careless_reading
time_pressure
overconfidence
underconfidence
```

The error notebook groups by misconception and objective, not only chronological attempt. It should show:

- a learner-friendly diagnosis;
- most recent example;
- frequency and trend;
- recommended repair lesson;
- one-click mixed retry;
- “resolved” status only after two independent correct attempts on separate dates.

### 13.7 No streak-first design

A study streak may exist as an optional secondary cue, but must not dominate the dashboard. Missing a day must not use shame copy or reset substantive progress. The primary metric is durable readiness.

## 14. Curriculum model

### 14.1 Objective granularity

An objective must describe one observable capability, for example:

- “Identifiera en västprick och förklara på vilken sida den ska passeras.”
- “Mäta sann kurs mellan två punkter inom ±3° på övningskortet.”
- “Beräkna gångtid från distans och fart.”
- “Välja korrekt väjningsåtgärd i ett mötesscenario.”

Avoid objectives such as “Navigation” or “Säkerhet”; these are sections, not testable capabilities.

### 14.2 Objective types

```text
fact             # terms, symbols, limits, meanings
concept          # explanation and relationship
rule             # conditional legal/operational rule
procedure        # ordered multi-step calculation/action
perceptual       # recognise a visual/audio pattern
scenario         # choose action in context
practical_prep   # readiness for supervised physical task
```

### 14.3 Objective graph

Objectives form a directed acyclic prerequisite graph where possible.

Example:

```text
units.nautical-mile
  -> chart.scale-distance
  -> navigation.speed-time-distance

compass.cardinal-directions
  -> compass.true-magnetic-compass
  -> navigation.plot-course

rules.vessel-types
  -> rules.crossing
  -> rules.overtaking
  -> rules.restricted-visibility
```

The session planner may remediate a prerequisite when a learner repeatedly fails a dependent objective.

### 14.4 Criticality

Each objective has:

```text
criticality = informational | standard | important | safety_critical
```

Safety-critical objectives:

- receive higher review priority;
- cannot be “tested out” from one lucky answer;
- require stronger mastery evidence;
- require stricter content review;
- can cap the overall readiness score if weak.

### 14.5 Syllabus versions

A certification can have several syllabus versions. A user cohort is assigned to the active version at purchase, but content corrections may migrate them.

Required fields:

```text
id
certification_id
name
source_document_id
effective_from
effective_to
status: draft | review | active | superseded
verified_at
verified_by
change_summary
```

## 15. Memory scheduling with FSRS

Use `ts-fsrs` for atomic recall items and selected concept checks. Do not use FSRS as the sole model for procedural chart, radio, or practical skills.

### 15.1 Automatic FSRS rating mapping

The learner does not self-rate memory. Derive a rating from evidence:

```text
Again (1)
- incorrect; or
- answer revealed; or
- required a tier-2+ hint; or
- correct after changing from a submitted wrong answer in the same attempt.

Hard (2)
- correct with tier-1 hint; or
- correct but very slow relative to the user's item-kind baseline; or
- correct but marked "guessed"; or
- correct with an unresolved high-risk misconception pattern.

Good (3)
- correct independently;
- no hint;
- plausible latency;
- confidence is not "guessed".

Easy (4)
- correct independently on first response;
- no hint;
- calibrated confidence;
- latency below the user's robust baseline;
- at least two prior successful recalls separated in time;
- item is not newly introduced or safety-critical on its first reviews.
```

### 15.2 Latency baseline

Do not compare against a sparse per-item median. Use fallback order:

1. user + item kind + device class, minimum 15 valid observations;
2. user + item kind, minimum 15;
3. cohort + item kind + difficulty band;
4. do not use latency in the rating.

Exclude backgrounded, interrupted, and accessibility-accommodation sessions from latency penalties.

### 15.3 Exam-date planning

Do not blindly cap every FSRS interval to `0.4 × days_until_exam`; this can create unnecessary massed repetition. Instead:

1. let FSRS produce its interval;
2. guarantee at least one planned retrieval before the target exam for non-mastered/high-priority material;
3. prioritise overdue and weak objectives in daily sessions;
4. reserve the final 20% of study days for mixed retrieval and simulations;
5. shorten only when the next due date would fall after the target exam and the item lacks sufficient mastery evidence;
6. avoid scheduling every item on the final day.

Pure function:

```ts
planDueDate({
  fsrsDue,
  today,
  examDate,
  objectiveCriticality,
  masteryEvidence,
  dailyCapacity,
}): Date
```

The planner must be deterministic and unit tested.

### 15.4 Leech handling

An item becomes a potential leech after repeated failures, but the system should diagnose whether the problem is the item or learner understanding.

- 4 failures in 8 reviews → show alternate explanation and item variant.
- 6 failures → route to prerequisite lesson and flag for item-quality review.
- High cohort failure with poor discrimination → admin flag; do not blame learners.

## 16. Procedural-skill mastery

Maintain separate state for skills that require doing.

### 16.1 Skill evidence dimensions

```text
accuracy
independence        # hint/reveal use
precision           # geometric/numeric delta
sequence_quality    # radio/procedure steps
latency             # only where appropriate
transfer            # performance on a novel variant
recency
context_diversity   # different scenarios/assets
```

### 16.2 Skill stages

```text
unseen
introduced
supported
independent
stable
needs_refresh
```

Suggested transition rules:

- `introduced` after a worked example is completed.
- `supported` after one correct guided task.
- `independent` after two correct no-hint tasks, including one novel variant.
- `stable` after at least two independent successes on separate days and a later mixed-set success.
- `needs_refresh` when overdue, recently failed, or confidence/precision deteriorates.

Safety-critical or complex skills may require three separate-day successes.

### 16.3 Variant generation

A variant changes meaningful parameters without changing the objective:

- start/end points;
- direction/course;
- variation/deviation values;
- speed and distance;
- vessel arrangement;
- light sector;
- channel/call context;
- weather cues.

Random generation must use validated constraints and a deterministic seed stored with the attempt. Generated answers must be calculated by trusted pure functions, never by an LLM at runtime.

## 17. Readiness model

Do not call the v1 score a pass probability. Call it **Beredskap**.

### 17.1 Readiness components

Default weighting for Förarintyg:

| Component | Weight | Evidence |
|---|---:|---|
| Objective coverage | 15% | Required objectives encountered and independently assessed. |
| Durable recall | 25% | FSRS state, recent independent retrieval, difficulty-adjusted accuracy. |
| Procedural skill | 25% | Chart/calculation/scenario skill stages and precision. |
| Mixed simulations | 25% | Last three valid full or near-full simulations, recency-weighted. |
| Calibration and freshness | 10% | Confidence calibration, overdue load, time since evidence. |

Weights are certification-specific and stored in configuration.

### 17.2 Objective readiness

An objective is `ready` only when all applicable conditions pass:

- minimum item/variant coverage met;
- minimum two independent successful attempts;
- evidence spans at least two dates for standard/critical objectives;
- recent rolling performance meets the configured threshold;
- no unresolved severe misconception;
- no overdue critical review;
- procedural objective has reached `stable` or approved equivalent;
- safety-critical objective has not failed in the last two independent attempts.

Do not use “90% over the last ten attempts” alone. Ten attempts can be repeated on one easy item and do not prove transfer.

### 17.3 Readiness caps

Apply transparent caps:

- any unseen safety-critical objective → total readiness max 69;
- any failed safety-critical objective in last 72 hours → max 79;
- no valid timed simulation → max 84;
- no independent chart evidence where required → max 74;
- expired/stale official syllabus mapping → hide readiness and show admin alert, not a misleading score.

### 17.4 Readiness labels

```text
0–39    Börja med grunderna
40–59   På väg
60–74   Behöver mer träning
75–84   Nära provberedskap
85–94   God beredskap
95–100  Mycket god beredskap
```

These labels are product guidance, not a guarantee. Validate thresholds after collecting outcomes.

### 17.5 Dashboard explanation

Every score must have a “Så beräknas detta” panel. Show:

- which evidence raised/lowered it;
- top three weak objectives;
- overdue review count;
- chart skill status;
- simulation status;
- next recommended action.

## 18. Study-plan generator

### 18.1 Inputs

- certification;
- assigned syllabus;
- diagnostic evidence;
- target exam date or pace;
- available days per week;
- preferred session length;
- accessibility preferences;
- prior certificates/knowledge;
- learner age band;
- entitlement end date.

### 18.2 Output

Create a rolling plan, not a rigid calendar:

```text
Today: 18 min — rules review + chart distance practice
Tomorrow: 22 min — marks + speed/time/distance
Saturday: 35 min — mixed module check
Next week: first timed half simulation
```

The plan recalculates after each session, but preserves learner commitments and explains material changes.

### 18.3 Daily session assembly

Priority score for candidate learning activities:

```text
priority =
  overdue_weight
+ weakness_weight
+ criticality_weight
+ prerequisite_weight
+ exam_proximity_weight
+ diversity_weight
- fatigue/repetition_penalty
- recent_exposure_penalty
```

Session order:

1. quick confidence-building retrieval;
2. overdue critical review;
3. one main new/guided skill;
4. mixed independent practice;
5. short closure/reflection.

Do not serve 20 visually identical MCQs in a row.

### 18.4 Cram mode

When the target exam is within three days:

- explain that durable learning cannot be compressed completely;
- prioritise safety-critical rules, high-yield weak areas, and a realistic simulation;
- avoid introducing advanced low-weight material on the final evening;
- provide printable official-process/tool checklist;
- stop recommending late-night study after a configurable local time.

## 19. Assessment item system

### 19.1 Supported item kinds

```text
single_choice
multiple_select
true_false              # use sparingly
numeric
short_text_normalised   # exact terminology only, not open essays
ordering
matching
image_hotspot
chart_interaction
scenario_choice
sequence_builder
audio_identification
spoken_sequence         # optional recording; privacy reviewed
calculation_steps
```

The exam simulator may restrict itself to formats consistent with current official information. Richer formats may be used in learning mode.

### 19.2 Item anatomy

Every item version stores:

- objective(s), primary and secondary;
- item kind;
- stem/instructions;
- options or interaction schema;
- canonical answer and tolerance;
- concise explanation;
- worked explanation where applicable;
- misconception represented by each distractor;
- source citation(s) down to section/page where possible;
- certification/syllabus version;
- difficulty estimate;
- criticality;
- language level;
- media attribution/licence;
- reviewer decisions;
- status and effective dates;
- accessibility alternative;
- generation provenance and prompt version, if AI-assisted.

### 19.3 Item-writing rules

- Test one primary capability at a time unless explicitly a synthesis scenario.
- Use one unambiguously best answer.
- Avoid trick wording and irrelevant complexity.
- Avoid “all of the above” and “none of the above”.
- Avoid negative stems; when necessary, emphasise `INTE` visually and semantically.
- Keep options parallel in grammar and plausible in length.
- Each distractor should represent a distinct misconception, not random nonsense.
- Do not disclose the answer through grammar, units, or option length.
- Use Swedish nautical terms consistently with the approved glossary.
- For legal/rule items, distinguish the rule from recommended seamanship where they differ.
- Do not invent numeric thresholds from memory.
- Do not use official or competitor question wording.

### 19.4 Item exposure

Avoid memorisation by:

- parameterised variants;
- rotating visual orientation where pedagogically valid;
- separating practice and simulation pools;
- enforcing recent-exposure exclusions;
- limiting exact-item repeats in short windows;
- measuring answer-position bias;
- retiring overexposed items when alternatives exist.

### 19.5 Item telemetry

Admin metrics after sufficient sample:

- attempts and unique learners;
- p-value/difficulty;
- point-biserial discrimination;
- distractor selection rates;
- median/percentile latency;
- confidence calibration;
- hint rate;
- skip rate;
- device-specific anomalies;
- reviewer flags;
- exposure rate;
- differential performance by age band only when lawful, sufficiently aggregated, and useful for accessibility—not targeting.

Do not compute or display psychometric metrics below a configured minimum sample, e.g. 50 unique independent attempts.

### 19.6 Item quality automation

Automated checks before review:

- schema validity;
- exactly one correct single-choice answer;
- unit and tolerance consistency;
- duplicate/near-duplicate detection;
- option length outlier;
- prohibited phrases;
- missing source;
- stale source version;
- answer leakage;
- image alt text;
- chart geometry solvability;
- deterministic grading test;
- reading-level warning;
- trademark/copyright keyword warning.

Automation may reject or flag; it may never approve content for publication.

---

# Part IV — Interactive learning laboratories

## 20. Interactive chart laboratory

The chart laboratory is the main product differentiator and highest engineering priority after the core learning engine.

### 20.1 Safety and copyright boundary

- Use one or more completely fictional archipelagos.
- Do not trace, georeference, redraw, simplify, or derive coastlines, depths, fairways, names, marks, light positions, or other information from a Sjöfartsverket chart without written permission.
- Use original vector artwork and original fictional place names.
- Base instructional facts about symbol meaning on permitted primary references, but commission/draw original representations and record their provenance.
- Place a persistent but unobtrusive watermark: **“ÖVNINGSKORT — EJ FÖR NAVIGATION”**.
- The chart must not be exportable without the watermark.
- Do not expose chart tiles through a public unauthenticated tile endpoint except the limited free-demo asset.
- Commission a maritime-cartography/domain review before launch.

### 20.2 Chart worlds

Recommended progression:

1. **Grundviken** — simple scale, coordinates, lateral marks, isolated hazards, basic lights.
2. **Övningsskärgården** — full Förarintyg environment with more islands, sectors, fairways, depth contours, and multiple routes.
3. **Ytterskär** — advanced Kust environment with longer passages, night/restricted-visibility scenarios, tidal/current abstractions only where supported by curriculum.

v1 may ship one rich chart plus a small tutorial chart. The engine must support multiple chart manifests.

### 20.3 Asset architecture

```text
/public/charts/
  grundviken-v1/
    chart.svg
    manifest.json
    thumbnails/
  ovningsskargarden-v1/
    chart.svg
    manifest.json
    thumbnails/
/lib/chart/
  coordinates.ts
  geometry.ts
  compass.ts
  route.ts
  grading.ts
  generators.ts
  schemas.ts
/components/chart/
  ChartViewport.tsx
  ChartToolbar.tsx
  TaskPanel.tsx
  overlays/
  tools/
/tests/chart/
```

The SVG is visual only. All semantic objects used for tasks live in the manifest. No task should depend on parsing arbitrary SVG paths at runtime.

### 20.4 Manifest schema

Illustrative schema:

```json
{
  "id": "ovningsskargarden-v1",
  "title": "Övningsskärgården",
  "version": 1,
  "svg": "/charts/ovningsskargarden-v1/chart.svg",
  "widthPx": 3000,
  "heightPx": 2000,
  "coordinateSystem": {
    "type": "fictional_geographic",
    "originLatDeg": 58,
    "originLatMin": 10,
    "originLonDeg": 11,
    "originLonMin": 20,
    "pxPerLatMinute": 50,
    "pxPerLonMinuteAtChart": 50,
    "northVector": [0, -1]
  },
  "scale": {
    "pxPerNm": 50,
    "uniform": true
  },
  "compass": {
    "variationDeg": 6,
    "variationEpochLabel": "Fiktivt övningsvärde",
    "deviationTable": [
      {"compassDeg": 0, "deviationDeg": -3},
      {"compassDeg": 45, "deviationDeg": -1},
      {"compassDeg": 90, "deviationDeg": 2},
      {"compassDeg": 135, "deviationDeg": 4},
      {"compassDeg": 180, "deviationDeg": 3},
      {"compassDeg": 225, "deviationDeg": 0},
      {"compassDeg": 270, "deviationDeg": -2},
      {"compassDeg": 315, "deviationDeg": -4},
      {"compassDeg": 360, "deviationDeg": -3}
    ]
  },
  "layers": [
    {"id": "land", "defaultVisible": true},
    {"id": "depths", "defaultVisible": true},
    {"id": "marks", "defaultVisible": true},
    {"id": "lights", "defaultVisible": true},
    {"id": "labels", "defaultVisible": true},
    {"id": "teaching", "defaultVisible": false}
  ],
  "features": [
    {
      "id": "light-norrgrund",
      "type": "lighthouse",
      "position": {"x": 812, "y": 400},
      "name": "Norrgrund",
      "properties": {"character": "Fl(2) WRG 10s"},
      "hitRadiusPx": 24
    }
  ],
  "hazards": [],
  "routes": [],
  "legal": {
    "notice": "Fiktivt övningskort. Ej för navigation.",
    "assetAuthor": "...",
    "reviewedBy": "..."
  }
}
```

Validate manifests with Zod both at build time and in tests.

### 20.5 Coordinate conventions

- Screen coordinates: positive `x` east/right, positive `y` south/down.
- North vector: `(0, -1)`.
- Bearings/courses: degrees clockwise from north, normalised to `[0, 360)`.
- Variation and deviation: east positive, west negative.
- Course chain taught consistently with approved curriculum notation.
- Distances on the fictional chart use the latitude-scale convention and a uniform `pxPerNm` unless a later chart explicitly models projection effects.
- Store angles as floating-point degrees; round only for display or according to task tolerance.

### 20.6 Pure chart mathematics

Implement and unit test at minimum:

```ts
type Point = { x: number; y: number };
type Polar = { bearingDeg: number; distanceNm: number };

normalizeDeg(value: number): number;
shortestAngularDeltaDeg(a: number, b: number): number;
distancePx(a: Point, b: Point): number;
distanceNm(a: Point, b: Point, pxPerNm: number): number;
trueCourseDeg(from: Point, to: Point): number;
pointFromCourseDistance(from: Point, courseDeg: number, distanceNm: number, pxPerNm: number): Point;
interpolateDeviation(table: DeviationPoint[], compassDeg: number): number;
magneticFromCompass(compassDeg: number, deviationDeg: number): number;
trueFromMagnetic(magneticDeg: number, variationDeg: number): number;
trueFromCompass(compassDeg: number, variationDeg: number, table: DeviationPoint[]): number;
compassFromTrue(trueDeg: number, variationDeg: number, table: DeviationPoint[]): number;
timeHours(distanceNm: number, speedKn: number): number;
timeMinutes(distanceNm: number, speedKn: number): number;
distanceFromSpeedTime(speedKn: number, timeHours: number): number;
speedFromDistanceTime(distanceNm: number, timeHours: number): number;
lineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null;
bearingRayIntersection(fix1: BearingRay, fix2: BearingRay): Point | null;
closestPointOnSegment(point: Point, a: Point, b: Point): Point;
pointToSegmentDistanceNm(point: Point, a: Point, b: Point, pxPerNm: number): number;
polylineLengthNm(points: Point[], pxPerNm: number): number;
polygonContains(point: Point, polygon: Point[]): boolean;
routeIntersectsHazard(route: Point[], hazard: Polygon): boolean;
underKeelClearance(params: ClearanceInput): ClearanceResult;
applySetAndDrift(params: SetDriftInput): SetDriftResult;
```

`compassFromTrue` must solve deviation dependence deterministically. A fixed-point iteration is acceptable if convergence and fallback are tested. Prefer bounded iteration with explicit error return rather than an assertion that can crash a user session.

### 20.7 Test edge cases

Include:

- `0/360` wrap;
- `359°` versus `1°` tolerance;
- vertical/horizontal lines;
- coincident and parallel bearings;
- points on polygon edges;
- zero distance;
- invalid speed/time values;
- deviation interpolation across 315–360–0–45;
- negative west variation/deviation;
- rounding boundaries;
- precision at max zoom;
- route touching versus crossing a hazard;
- set/drift vectors in all quadrants;
- keyboard-entered coordinates versus pointer positions.

### 20.8 Viewport interaction

`ChartViewport` requirements:

- SVG or canvas-backed rendering with semantic overlay layer;
- mouse drag pan;
- wheel zoom centred on pointer;
- pinch zoom centred between touches;
- keyboard zoom/pan controls;
- fit-to-task button;
- zoom range initially `0.5×–5×`, configurable;
- inertia disabled by default during precision tasks;
- prevent accidental page scrolling while an active chart gesture is recognised;
- do not block browser zoom globally;
- persistent task instructions outside the chart;
- 44×44 CSS pixel minimum interactive targets;
- high-contrast focus indicators;
- no essential hover-only information;
- undo/redo for marks and lines;
- reset-view and clear-answer controls with confirmation only when destructive.

### 20.9 Tool state machine

Use an explicit reducer/state machine, not scattered component booleans.

```text
idle
inspect_feature
measure_distance.await_start
measure_distance.await_end
measure_bearing.await_start
measure_bearing.await_end
plot_course.await_origin
plot_course.adjusting
mark_position.await_point
polyline_route.drawing
parallel_ruler.await_reference
compass_rose.adjusting
submitted
feedback
```

State transitions must be covered by reducer tests. A route change or task load must not leave stale tool state.

### 20.10 Mobile design

On a 375 px viewport:

- chart occupies the majority of height;
- instructions open in a bottom sheet;
- active tool and numeric result remain visible;
- toolbar can horizontally scroll but essential actions remain fixed;
- a precision loupe appears while dragging a point;
- snap behaviour is optional and explicitly shown;
- landscape orientation is suggested for complex tasks but never required;
- typed coordinate/course inputs provide an accessible alternative.

### 20.11 Desktop design

Use a split layout:

- chart 65–75%;
- task panel 25–35%;
- optional collapsible scratchpad;
- keyboard shortcuts shown in tooltips and help;
- no browser-native context menu dependency.

## 21. Chart curriculum and task families

### 21.1 Foundation tasks

1. **Locate a named feature.** Tap the correct mark/light/island.
2. **Identify a chart symbol.** Select meaning and practical implication.
3. **Read a coordinate.** Enter latitude/longitude from a marked point.
4. **Plot a coordinate.** Place a mark from given coordinates.
5. **Read the scale.** Choose or calculate distance represented by a span.
6. **Identify lateral/cardinal marks.** Include colour/topmark/light pattern concepts with original artwork.
7. **Interpret a light characteristic.** Connect notation, colour, rhythm, and sector.
8. **Recognise depth/hazard information.** Use fictional values.

### 21.2 Measurement tasks

9. **Measure distance.** Two points; grade in NM.
10. **Measure true course/bearing.** Two points; grade angular delta.
11. **Plot a course and distance.** Origin plus numeric course/distance.
12. **Multi-leg route length.** Draw route through ordered waypoints.
13. **Speed–time–distance.** Solve any missing variable with unit handling.
14. **ETA.** Include departure time, leg times, and rounding.
15. **Fuel estimate.** Learning mode only unless in current syllabus; make assumptions explicit.

### 21.3 Compass tasks

16. **Variation sign.** Convert magnetic and true direction.
17. **Deviation-table interpolation.** Read/interpolate a fictional table.
18. **Full course conversion.** Compass ↔ magnetic ↔ true.
19. **Diagnose a wrong course chain.** Select which step/sign is wrong.
20. **Plot converted course.** Complete calculation and line placement.

### 21.4 Position and route tasks

21. **Single bearing line.** Draw a line of position.
22. **Cross bearings.** Mark the intersection and grade positional error.
23. **Dead reckoning.** Plot from course, speed, and time.
24. **Set and drift.** Compare intended versus actual track where in syllabus.
25. **Safe route selection.** Draw a route satisfying depth/hazard constraints.
26. **Hazard detection.** Identify every material hazard on a proposed route.
27. **Alternative route trade-off.** Compare distance, complexity, and margins.
28. **Under-keel clearance.** Use fictional depth and vessel assumptions; state simplifications.
29. **Light-sector route.** Determine what is visible along a route/time scenario.
30. **Fairway approach.** Choose entry/exit based on marks and traffic scenario.

### 21.5 Electronic-chart concepts

31. **Overzoom awareness.** Simulate loss of detail and ask what is unreliable.
32. **Layer/settings check.** Choose safe educational display settings for a fictional system.
33. **Waypoint entry.** Enter/check coordinates and detect transposition.
34. **MOB control.** Identify/execute the generic action in a training UI.
35. **Cross-check position.** Compare GNSS indication with visual/chart evidence.

Never make the generic electronic-chart interface resemble a named commercial navigation product closely enough to imply affiliation or copy trade dress.

### 21.6 Combined scenarios

Combined scenarios should require 3–6 steps, for example:

1. read start position;
2. select a route around a hazard;
3. measure course and distance;
4. convert course;
5. calculate time;
6. choose expected light/mark evidence.

Grade both final answer and steps. Give partial diagnostic credit in learning analytics, but use binary correctness only where the exam blueprint requires it.

## 22. Chart task schema

Use a discriminated union. Example:

```ts
type ChartTask =
  | MeasureDistanceTask
  | MeasureBearingTask
  | PlotCourseTask
  | CoordinateReadTask
  | CoordinatePlotTask
  | CompassConversionTask
  | PositionFixTask
  | RoutePlanningTask
  | HazardIdentificationTask
  | SpeedTimeDistanceTask
  | SetDriftTask
  | ElectronicChartTask
  | CompositeChartScenario;
```

Example JSON:

```json
{
  "schemaVersion": 1,
  "type": "plot_course",
  "chartId": "ovningsskargarden-v1",
  "prompt": "Från position A ska du styra rättvisande kurs 074° i 6,0 M. Rita kurslinjen och markera slutpunkten.",
  "origin": {"featureId": "point-a"},
  "answer": {"trueDeg": 74, "distanceNm": 6.0},
  "tolerance": {"angleDeg": 3, "distanceNm": 0.15, "endpointNm": 0.2},
  "allowedTools": ["plot_course", "inspect_feature"],
  "scaffolding": {
    "workedExampleLessonId": "lesson_plot_course_01",
    "hints": ["Börja vid A och rikta linjen medsols från norr."]
  },
  "gradingPolicy": "all_required",
  "sourceRefs": ["nfb-forar-2025:chartwork:course-distance"]
}
```

### 22.1 Grading response

```ts
type GradeResult = {
  correct: boolean;
  score01: number;
  dimensions: Array<{
    key: string;
    correct: boolean;
    actual: number | string | Point | null;
    expected: number | string | Point;
    delta?: number;
    tolerance?: number;
  }>;
  misconceptionTags: string[];
  feedbackKey: string;
  overlay?: FeedbackOverlay;
};
```

### 22.2 Tolerance rules

- Store tolerance in task data and validate against a safe range per task type.
- Angular grading uses shortest angular delta.
- Positional tolerance is converted to NM using manifest scale.
- Route tasks may require all mandatory waypoints and no hazard intersection.
- A learner line must not be graded from screen pixels after CSS transform; convert to chart coordinates first.
- Display actual, expected, delta, and tolerance in the learner’s units.

### 22.3 Feedback overlays

Overlay should distinguish:

- learner answer;
- correct answer;
- tolerance envelope;
- start/end points;
- hazard intersection;
- direction arrows;
- step labels.

Use pattern/dash/labels in addition to colour.

## 23. Physical chart and tool bridge

Because learners may need physical exercise charts and navigation tools in the official process, the product must prepare them for the medium change.

### 23.1 v1 approach

- Teach the same concepts on the fictional digital chart.
- Include original short videos showing generic dividers, parallel ruler/course plotter, pencil, eraser, and calculator use on a blank/original practice sheet.
- Provide a printable fictional chart segment and worksheet generated from our own asset.
- Offer a partner link for authorised physical materials.
- Include a “Från skärm till papper” lesson and checklist.

### 23.2 Licensed future mode

Only after written permission/licence:

- integrate exercises tied to official chart numbers;
- store licence scope and expiry;
- restrict display/download as required;
- watermark and audit access;
- re-review every derived task.

Do not attempt to avoid licensing by asking an LLM to “create something similar” to a real chart.

## 24. Rules-of-the-road scenario trainer

Build an original top-down/3D-lite scenario engine for collision rules and traffic decisions.

### 24.1 Scenario inputs

- vessel types;
- propulsion/status;
- relative positions and headings;
- day/night/restricted visibility;
- visual lights/day shapes where relevant;
- sound signals where relevant;
- sea-room/context;
- question objective.

### 24.2 Learner actions

- identify vessels/status;
- determine encounter type;
- determine obligations;
- select/plot action;
- choose sound/light signal;
- explain why;
- identify when a rule cannot be concluded from available evidence.

### 24.3 Grading

Separate:

1. perception: what is seen/heard;
2. classification: encounter/status;
3. rule: which obligation applies;
4. action: safe/compliant choice;
5. explanation.

This prevents a lucky final answer from hiding a conceptual error.

### 24.4 Rendering

- Use original vessel icons/models.
- Support a scrubber to advance time.
- Show relative bearing/trails only in feedback or advanced mode.
- Provide text-only diagrams and keyboard controls.
- Never train unsafe “closest possible” manoeuvres for entertainment.

## 25. Lights, day shapes, and sound-signal trainer

### 25.1 Modes

- identify from still image;
- build the correct light arrangement;
- identify vessel/status from animated lights;
- listen to sound sequence;
- reproduce a sequence with on-screen horn control;
- mixed night/restricted-visibility scenario;
- spaced flashcard review.

### 25.2 Audio

- Produce original audio files.
- Normalise volume and warn before playback.
- Show visual waveform/pulse alternative.
- Do not autoplay loud horn sounds.
- Add captions and text description.

### 25.3 Light rendering

Use an engine that defines lights semantically:

```ts
type NavigationLight = {
  color: 'white' | 'red' | 'green' | 'yellow';
  arcStartDeg: number;
  arcEndDeg: number;
  verticalOrder?: number;
  rhythm?: LightRhythm;
};
```

Render from data so variants can be generated and tested.

## 26. Knot trainer

### 26.1 Learning sequence

- purpose and selection;
- named parts of rope;
- slow, step-by-step original animation/video;
- learner orders steps;
- error spotting;
- timed recognition only after construction understanding;
- physical practice checklist.

### 26.2 Limits

A screen interaction cannot prove physical knot competence. Mark status as “teoretiskt förberedd” until a learner/instructor records practical practice. Do not state “behärskar knopen” solely from a quiz.

### 26.3 Media requirements

- original recordings or commissioned illustrations;
- left/right-handed view where useful;
- high-contrast rope/background;
- pause, scrub, speed control;
- text transcript and numbered stills;
- no embedded third-party video as the sole instruction.

## 27. Weather and decision trainer

Use scenario cards with fictional forecasts, observations, and route contexts.

Learner tasks:

- interpret symbols/terms;
- identify trend;
- connect wind direction/strength to local effects at the required level;
- choose conservative preparation/action;
- detect when information is insufficient;
- distinguish forecast from observation.

Do not provide live operational voyage advice in v1. A later live-weather feature requires a separate safety review, explicit location handling, and current authoritative data.

---

# Part V — Certificate-specific curricula and preparation plans

## 28. Förarintyg curriculum blueprint

The taxonomy script must derive the final atomic objectives from the active NFB knowledge-requirement document. The module map below is the intended learning architecture, not a substitute for that source.

### 28.1 Module F1 — The official process and safe scope

Learner outcomes:

- explain what the certificate represents and does not represent;
- identify current age, exam, material, and booking requirements;
- distinguish our training service from NFB and the exam organiser;
- understand that the course does not replace judgement, local knowledge, or current navigation information;
- prepare an exam-day checklist.

Product elements:

- official-process timeline;
- date-stamped fact cards;
- downloadable checklist;
- guardian note for younger learners.

### 28.2 Module F2 — Nautical language, units, and chart orientation

Learner outcomes:

- use nautical mile, knot, degree, minute, and time units correctly;
- identify north, cardinal/intercardinal directions, bearings, courses, and relative position;
- understand chart orientation, scale, latitude/longitude concept, and coordinate notation;
- avoid common unit and coordinate transposition errors.

Practice:

- unit matching;
- coordinate read/plot;
- scale comparison;
- “spot the impossible answer” tasks;
- short speed–time–distance prerequisites.

Common misconceptions:

- treating knots as distance;
- confusing decimal degrees and degrees/minutes;
- measuring distance on the wrong scale;
- swapping latitude/longitude;
- assuming screen zoom changes chart scale mathematically.

### 28.3 Module F3 — Chart information and symbols

Learner outcomes:

- interpret the chart information required by the active syllabus;
- identify depth information, hazards, shore/land features, fairway information, marks, and lights;
- explain what chart information cannot guarantee;
- recognise why up-to-date official material matters.

Practice:

- hotspot identification;
- symbol-to-meaning matching;
- scenario implication (“Vad betyder detta för din plan?”);
- layered chart exploration;
- overzoom simulation.

### 28.4 Module F4 — Marks, lights, and aids to navigation

Learner outcomes:

- recognise relevant lateral, cardinal, isolated danger, safe-water, and special marks at the level required;
- connect shape, colour, topmark, and light characteristic;
- determine the safe side/passage meaning;
- interpret lighthouse characteristics and sectors;
- distinguish charted information from what may be observed.

Practice:

- build-a-mark;
- rotating 3D/2D recognition;
- night-light animation;
- safe-route selection;
- mixed visual/notation item.

### 28.5 Module F5 — Compass, courses, and directional error

Learner outcomes:

- distinguish true, magnetic, and compass direction/course;
- use the approved sign convention consistently;
- understand variation and deviation conceptually;
- perform conversions at the required level;
- use a deviation table where required;
- detect implausible sign/direction results.

Practice sequence:

1. arrow/number-line worked examples;
2. one-step true↔magnetic;
3. compass↔magnetic;
4. full chain;
5. chart plotting;
6. mixed reverse-direction conversion;
7. error diagnosis.

### 28.6 Module F6 — Position, distance, course, and route work

Learner outcomes:

- measure distance on the chart;
- measure/plot course within configured tolerance;
- find or plot a position;
- use visual bearings/lines of position at the required level;
- plan a simple safe route;
- check route against hazards, depths, and marks;
- cross-check electronic and visual information conceptually.

Practice:

- progressive chart laboratory curriculum;
- paper-tool bridge;
- combined route scenarios;
- transfer tasks on a second fictional chart segment.

### 28.7 Module F7 — Speed, time, distance, and movement

Learner outcomes:

- calculate any missing variable;
- convert hours/minutes correctly;
- estimate arrival time;
- understand the effect of wind/current/drift at the required level;
- make a conservative plan with explicit assumptions.

Common errors:

- dividing the wrong way;
- treating 1.30 hours as 1 h 30 min;
- mixing NM, km, and knots;
- rounding too early;
- omitting route legs.

### 28.8 Module F8 — Collision regulations and traffic behaviour

Learner outcomes:

- identify vessel types/status relevant to the syllabus;
- classify meeting, crossing, overtaking, and other scenarios;
- determine responsibilities and appropriate action;
- understand look-out, safe speed, risk of collision, and action principles;
- interpret relevant lights, day shapes, and sound signals;
- respond conservatively where information is incomplete.

Practice:

- top-down encounter engine;
- night-light scenarios;
- time progression;
- “which fact changes the rule?” contrasts;
- mixed exam-format items after scenario mastery.

### 28.9 Module F9 — Safety, emergency, and first response

Learner outcomes:

- choose appropriate personal and boat safety equipment;
- understand lifejacket/PFD considerations at the required level;
- prevent and respond to fire, water ingress, grounding, collision, and person-overboard scenarios;
- make an alarm and communicate position;
- understand hypothermia/cold-water risk and first-response priorities;
- know when professional emergency help is required.

Every health/safety lesson must be reviewed carefully, avoid over-specific medical treatment beyond source support, and prioritise contacting emergency services.

### 28.10 Module F10 — Seamanship and boat handling theory

Learner outcomes:

- understand basic hull, propulsion, steering, anchoring, mooring, towing, and line-handling concepts required by the syllabus;
- understand rudder/propeller effects conceptually;
- choose conservative actions around wind, current, limited space, and other traffic;
- select suitable knots and equipment.

Practice:

- animated force diagrams;
- docking decision scenarios;
- knot trainer;
- Båtpraktik preparation handoff.

### 28.11 Module F11 — Weather, water, and environment

Learner outcomes:

- interpret the required weather concepts and forecast information;
- understand how wind and weather influence planning and comfort/safety;
- identify environmental duties and good practice;
- avoid pollution and disturbance;
- understand local/seasonal caution without relying on stale live advice.

### 28.12 Module F12 — Regulations, responsibilities, and final integration

Learner outcomes:

- identify the legal/administrative topics required by the active syllabus;
- understand responsibility of the person in charge and relevant local restrictions at the required level;
- integrate navigation, rules, safety, and weather in mixed decisions;
- complete realistic timed training simulations;
- prepare for the official process and physical materials.

### 28.13 Förar mastery profile

Before the dashboard shows “God beredskap”, require:

- all safety-critical objectives ready;
- chart foundation and measurement skills stable;
- at least two mixed independent chart scenarios passed on separate days;
- at least two valid timed simulations at or above the configured threshold, with no major safety-topic collapse;
- no large overdue review backlog;
- official-process checklist acknowledged.

## 29. Båtpraktik dag preparation blueprint

The official material describes a set of supervised exercises. Build exactly as a readiness companion.

### 29.1 Practice areas

Map the official areas into these modules:

1. **Safety equipment on board.** Locate, inspect, and explain use.
2. **Personal equipment.** Clothing, flotation, and preparation.
3. **Chart-to-reality orientation.** Relate visible objects and charted objects.
4. **Steering by landmark/transit.** Hold a line and identify deviation.
5. **Steering by compass.** Maintain heading and understand practical limitations.
6. **Navigation in and outside a fairway.** Look-out, route, margins, and traffic.
7. **Position fixing.** Visual/available methods at the required level.
8. **Wind and current effects.** Observe and compensate conservatively.
9. **Electronic chart settings and overzoom.** Configure/check generic training display.
10. **Waypoint handling.** Enter/check a waypoint and verify coordinate order.
11. **MOB function.** Locate and operate a generic training control.
12. **Rudder and propeller effect.** Predict turning/low-speed behaviour.
13. **Person-overboard manoeuvre.** Brief the sequence; practical execution remains supervised.
14. **Spring lines and mooring.** Select/use line concept and communicate roles.
15. **Economical/environmental operation.** Smooth operation and wake/noise awareness.

### 29.2 Readiness checklist

For each area, store:

```text
not_reviewed
understands_theory
practised_on_land_or_simulator
practised_on_boat_with_supervision
instructor_confirmed
needs_more_practice
```

Only the last two states require an instructor/approved provider entry or uploaded evidence according to legal/privacy policy. A learner’s self-check must remain visually distinct.

### 29.3 Session brief

Generate a printable/mobile brief:

- goals;
- equipment;
- safety briefing questions;
- manoeuvres to request;
- learner’s three weakest areas;
- instructor notes area;
- no medical or unnecessary personal data.

### 29.4 Provider directory

Later release:

- location and available practice types;
- provider identity and declared qualifications;
- availability link;
- transparent paid placement/referral label;
- no ranking solely by referral fee;
- complaint/report mechanism;
- annual verification.

## 30. Kustskepparintyg curriculum blueprint

Kust content must not be produced by simply adding harder Förar questions. It requires a distinct mapping and more integrated passage planning.

### 30.1 Module K1 — Prerequisites and progression

- verify Förarintyg status;
- explain Båtpraktik requirement and sequencing;
- verify age/process information;
- diagnostic review of Förar fundamentals;
- create a bridge plan for weak prerequisite skills.

### 30.2 Module K2 — Advanced charts and publications

- chart types/projections at the required level;
- chart references, publications, and correction concepts;
- chart selection and limitations;
- light lists/characteristics and sectors;
- source-date awareness;
- no reproduction of protected chart material without licence.

### 30.3 Module K3 — Advanced compass and position work

- full course conversions;
- deviation-table use;
- bearings and position lines;
- multi-source position fixing;
- dead reckoning and uncertainty;
- transfer between calculation and chart plotting.

### 30.4 Module K4 — Route and passage planning

- route objectives and constraints;
- safe margins;
- distances, courses, times, alternatives;
- darkness/restricted visibility considerations;
- contingency points;
- arrival/departure planning;
- documentation of assumptions.

Use multi-step chart scenarios that can take 10–20 minutes, with saved scratch work and step-level feedback after submission.

### 30.5 Module K5 — Electronics and cross-checking

At the level in the active requirements:

- GNSS/satellite navigation limitations;
- electronic charts and settings;
- AIS concepts and limitations;
- radar concepts and limitations;
- VHF role;
- cross-checking independent sources;
- failure-mode scenarios.

Avoid training learners to trust a display uncritically.

### 30.6 Module K6 — Lights, night, and restricted visibility

- advanced recognition of lights/characteristics;
- sector interpretation;
- look-out and safe-speed principles;
- sound signals;
- uncertainty and conservative action;
- route planning for darkness/restricted visibility.

### 30.7 Module K7 — Weather and exposed-water planning

- interpret required forecast/weather information;
- local versus larger-scale effects at syllabus level;
- sea-state/wind implications;
- go/no-go and alternative decisions;
- update plan when assumptions change.

### 30.8 Module K8 — Safety, seamanship, and emergencies

- equipment and preparation for less sheltered waters;
- communications and emergency planning;
- crew briefing;
- person overboard and recovery concepts;
- grounding/collision/fire/water ingress scenarios;
- first aid at the required level;
- tow/assistance and risk management concepts.

### 30.9 Module K9 — Regulations, documents, customs, and environment

- current legal/document topics from the active syllabus;
- responsibilities and voyage documentation;
- customs/border topics where required;
- environmental protection;
- source-specific date warnings for changeable rules.

### 30.10 Module K10 — Integrated passage cases

Each case combines:

- chart selection;
- route and alternatives;
- course/distance/time;
- lights/marks;
- weather assumptions;
- safety/crew/equipment;
- regulatory/document consideration;
- decision review.

The final result should be a structured passage-plan exercise, not a single MCQ.

## 31. SRC curriculum blueprint

### 31.1 Module R1 — Official process, scope, and radio permit

- distinguish certificate, official simulator/exam process, and PTS radio permit;
- explain station, operator, vessel, call sign, and MMSI concepts;
- show current official links and last-checked dates;
- emphasise that our simulator is supplementary.

### 31.2 Module R2 — VHF fundamentals

- propagation/range concepts at required level;
- simplex/duplex concepts;
- channel purpose and transfer concept;
- coast/ship stations and traffic types;
- power selection and antenna/GPS connection concepts;
- limitations and radio discipline.

### 31.3 Module R3 — Generic radio controls

Learner operates an original generic radio:

- power;
- volume;
- squelch;
- channel selection;
- high/low power;
- dual/tri watch if relevant;
- channel 16 shortcut;
- push-to-talk;
- DSC menu concepts;
- distress button guard;
- position/GPS status;
- MMSI display/setup concept.

### 31.4 Module R4 — Routine traffic

- listen before transmitting;
- call structure;
- identify stations;
- move to working channel where appropriate;
- message brevity/clarity;
- acknowledgement and closure;
- spelling with phonetic alphabet;
- numbers and positions.

### 31.5 Module R5 — Distress: MAYDAY

Train the sequence and judgement required by the active syllabus:

- when distress applies;
- DSC distress concept and categories where required;
- voice call and message structure;
- vessel identity;
- position;
- nature of distress;
- assistance required;
- persons/other useful information;
- acknowledgement/relay concepts;
- cancellation of a false alert according to approved source material.

The interface must grade missing, wrong-order, and dangerous substitutions separately.

### 31.6 Module R6 — Urgency and safety

- PAN-PAN use and structure;
- SÉCURITÉ use and structure;
- channel transition and message handling;
- compare with distress;
- realistic but fictional scenarios.

### 31.7 Module R7 — GMDSS and equipment concepts

At required level:

- GMDSS purpose;
- sea areas where applicable;
- DSC;
- NAVTEX;
- EPIRB;
- SART/AIS-SART where current syllabus requires;
- SAR organisation and information flow;
- equipment limitations and registration/programming concepts.

### 31.8 Module R8 — Marine English and phonetic fluency

- alphabet and digits;
- vessel names/call signs;
- coordinates and times;
- standard message fragments required by syllabus;
- listening under moderate noise;
- speaking pace and confirmation.

Do not penalise accent. Grade required words/order/intelligibility conservatively and provide a non-recording alternative.

### 31.9 Module R9 — Rules, secrecy, and responsible operation

- current regulatory concepts from PTS/NFB/primary sources;
- secrecy/confidentiality obligations;
- false transmissions;
- record/licence concepts where required;
- post-certificate permit checklist.

### 31.10 Module R10 — Official readiness handoff

- our radio-lab mastery summary;
- link to NFB simulator;
- completion reminder;
- official licence/booking steps;
- physical/device requirements;
- PTS permit next step;
- date-stamped disclaimer.

## 32. Generic VHF radio lab specification

### 32.1 Radio state

```ts
type RadioState = {
  powered: boolean;
  volume: number;
  squelch: number;
  channel: string;
  transmitPower: 'low' | 'high';
  watchMode: 'off' | 'dual' | 'tri';
  gpsFix: { lat: number; lon: number; ageSec: number } | null;
  mmsiConfigured: boolean;
  dscMenu: DscScreen;
  pttPressed: boolean;
  transmitting: boolean;
  receiverBusy: boolean;
};
```

### 32.2 Scenario engine

Each scenario defines:

- learning objective;
- starting state;
- scripted incoming transmissions;
- allowable actions;
- required state transitions;
- speech/text sequence slots;
- timeout rules;
- safety-critical errors;
- feedback and source references.

### 32.3 Example scenarios

- routine call to a marina/other vessel in a fictional context;
- choose correct calling/working channel from provided training table;
- MAYDAY with known position;
- MAYDAY with stale/missing GPS position;
- PAN-PAN medical/mechanical urgency scenario without inventing medical advice;
- SÉCURITÉ navigational safety message;
- received distress acknowledgement decision;
- distress relay concept;
- accidental DSC distress cancellation workflow;
- identify duplicate/wrong MMSI risk;
- switch low/high power appropriately;
- diagnose closed squelch, low volume, wrong channel, or disconnected GPS.

### 32.4 Audio recording privacy

- Recording is optional and off by default.
- Process locally where feasible.
- Do not retain raw audio without explicit, purpose-specific consent.
- Provide text/sequence alternative with equivalent learning access.
- Do not use learner recordings to train models without separate explicit consent.
- Deletion must remove stored recordings and derived transcripts according to retention policy.

## 33. Seglarintyg preparation blueprints

### 33.1 Seglarintyg 1

Digital modules:

1. boat and rig parts;
2. sail theory and points of sail;
3. hoisting, lowering, and reefing concepts;
4. sail trim fundamentals;
5. tack and gybe sequence;
6. departure, approach, and docking plan;
7. collision rules relevant to sailing;
8. knots and line handling;
9. person-overboard sequence;
10. weather and local decision-making;
11. practical session brief and debrief.

Practical-readiness tasks:

- order manoeuvre steps;
- identify sail/boat-state errors from original diagrams/video;
- choose crew commands;
- predict sail/boat response;
- instructor checklist.

### 33.2 Seglarintyg 2

Add:

- modern yacht systems/equipment;
- maintenance checks;
- more precise trim;
- coordinated tacks/gybes;
- confined-water manoeuvring;
- docking/anchoring in varied conditions;
- seamanship routines;
- heavier-object MOB practice concepts;
- fog/local weather/prognosis interpretation;
- prerequisite verification.

### 33.3 Seglarintyg 3

Add:

- offshore planning and watches;
- heavy-weather preparation and conservative decision-making;
- advanced rig/sail trim;
- spinnaker/gennaker concepts where in current requirements;
- night/offshore routines;
- advanced MOB planning;
- weather interpretation;
- maintenance and failure scenarios;
- prerequisite verification.

### 33.4 Sailing visual simulator boundary

A simplified force/trim visualiser may teach relationships, but it must not claim to reproduce a specific boat. Display assumptions and focus on qualitative learning unless a validated physical model is commissioned.

## 34. Recommended study plans

All plans are adaptive. These templates provide onboarding expectations.

### 34.1 Förarintyg — six-week plan

**Week 1:** official process, terminology, units, chart orientation, first diagnostic. 3 sessions × 20–30 minutes.

**Week 2:** symbols, marks, lights, coordinates, distance. 3 sessions plus one 35-minute chart lab.

**Week 3:** courses, compass concepts, speed/time/distance, simple routes. 4 sessions.

**Week 4:** collision rules, lights/day shapes/sounds, scenario practice. 4 sessions.

**Week 5:** safety, seamanship, weather, environment, regulations; first timed half simulation. 4 sessions.

**Week 6:** interleaved review, two full training simulations, chart transfer tasks, official-process checklist, rest plan.

### 34.2 Förarintyg — three-week intensive plan

- 5 days/week;
- 35–50 minutes/day split into two blocks where possible;
- first simulation at end of week 1;
- chart work on at least six separate days;
- final two simulations not back-to-back on the same evening;
- mandatory remediation after each simulation.

### 34.3 Seven-day emergency plan

Use only when necessary:

- Day 1: diagnostic + rules/safety gaps.
- Day 2: chart basics and distance/course.
- Day 3: marks/lights + compass/calculations.
- Day 4: collision scenarios + sound/day signals.
- Day 5: safety/weather/regulations + mixed set.
- Day 6: full simulation + targeted repair.
- Day 7: brief retrieval, physical-tool/process check, no last-minute content flood.

### 34.4 SRC plan

Suggested 7–14 days:

- fundamentals and controls;
- routine calls;
- phonetic/numbers/positions;
- MAYDAY;
- PAN-PAN/SÉCURITÉ;
- GMDSS/equipment/rules;
- mixed radio scenarios;
- NFB simulator handoff and official process.

Require speaking/listening practice on at least three separate days where accessible.

### 34.5 Kust plan

Suggested 6–10 weeks depending on prerequisite fluency:

- prerequisite diagnostic;
- advanced chart methods;
- repeated long-form route cases;
- night/restricted visibility;
- electronics/publications;
- weather/safety/regulations;
- at least four full integrated passage cases;
- timed simulations only after chart procedures are stable.

### 34.6 Practical-preparation plan

Before Båtpraktik or Seglar practical session:

- complete theory brief;
- review equipment list;
- watch/step through manoeuvres;
- practise knots physically;
- identify three goals;
- bring instructor sheet;
- debrief within 24 hours;
- schedule repair work while memory is fresh.

---

# Part VI — Simulations, exports, and content operations

## 35. Training simulation system

### 35.1 Naming

Use **“Träningsprov”** or **“Provsimulering”** in Swedish. Use “officiellt format” only for specific properties that have been verified. When item count/section structure is internal, show:

> “Detta är ett träningsprov byggt efter de aktuella kunskapsområdena. Antal frågor och fördelning kan skilja sig från det riktiga provet.”

### 35.2 Blueprint configuration

Never hard-code a universal format in `examBuilder.ts`.

```ts
type ExamBlueprint = {
  id: string;
  certificationId: string;
  syllabusVersionId: string;
  name: string;
  mode: 'full' | 'half' | 'objective_check' | 'diagnostic';
  durationMinutes: number | null;
  passRule: PassRule;
  itemCount: number | null;
  allowedItemKinds: ItemKind[];
  objectiveQuotas: ObjectiveQuota[];
  sectionDiagnostics: DiagnosticSection[];
  chartTaskQuota?: { min: number; max: number };
  recentExposureExclusion: number;
  sourceDocumentId?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  officialClaims: string[];
  disclaimerKey: string;
  status: 'draft' | 'active' | 'retired';
};

type PassRule =
  | { type: 'overall_percentage'; threshold: number }
  | { type: 'section_and_overall'; overall: number; sections: Record<string, number> }
  | { type: 'manual_review' };
```

For current Förar/Kust/SRC configurations, the public NFB threshold is represented as overall 75% unless a newer verified source changes it. Diagnostic section bars do not alter the pass result.

### 35.3 Assembly algorithm

Requirements:

- stratified by objective quotas/weights;
- sample without replacement;
- exclude exact items seen in a configurable number of recent full simulations;
- limit variants from the same template;
- enforce difficulty-band distribution after enough calibration data exists;
- include safety-critical coverage;
- include chart items where the active blueprint requires them;
- avoid answer-position imbalance;
- deterministic from a stored random seed;
- fail with a clear admin error when the item bank cannot satisfy constraints;
- never silently fill a missing quota with unrelated items.

Suggested algorithm:

1. Load eligible live item versions for syllabus and mode.
2. Exclude recent exposures and invalid/stale items.
3. Reserve mandatory safety/chart/objective minima.
4. Fill quotas by weighted sampling across templates, then items.
5. Check duplicate concepts and answer-position distribution.
6. Run blueprint validation.
7. Store the exact session-item rows and seed.

### 35.4 Session persistence

Use normalised rows:

```text
exam_sessions
exam_session_items
exam_responses
```

Do not store only an array of item IDs. Snapshot item version and grading policy so later content edits do not change historical results.

### 35.5 Timer

- Server records `started_at` and `expires_at`.
- Client displays remaining time from server timestamps.
- Refresh/reopen resumes accurately.
- Use server-side final acceptance cutoff with a small network grace policy documented and tested.
- Auto-submit at expiry.
- Backgrounding does not pause time.
- Accessibility accommodations must be a separate policy/configuration, not an undocumented client override.

### 35.6 Valid simulation

A simulation counts toward readiness only when:

- assembled from an active blueprint;
- completed within validity rules;
- not abandoned below minimum completion;
- no debug/admin mode;
- no answer reveal before submission;
- integrity checks pass;
- item bank had sufficient objective coverage.

### 35.7 Results

Results page shows:

- configured pass/fail;
- score and threshold;
- time used;
- diagnostic module bars;
- confidence calibration;
- chart precision summary;
- top misconception patterns;
- links to targeted repair sessions;
- comparison to the learner’s own earlier attempts;
- disclaimer that this is not an official result.

Do not show a competitive leaderboard.

### 35.8 Review mode

After submission:

- allow item-by-item review;
- reveal source and explanation;
- preserve original answer;
- allow “jag förstår inte” support flag;
- generate variants, not identical repeats, for remediation;
- do not allow browser-indexable sharing of paid questions.

## 36. Diagnostic system

### 36.1 Public diagnostic

Purpose:

- demonstrate teaching quality;
- estimate broad gaps;
- collect no more personal data than necessary;
- convert through usefulness, not result hostage-taking.

Design:

- 15–25 items;
- 8–12 minutes;
- broad module coverage;
- at least one interactive chart task;
- no questions that require prior access to paid lessons;
- immediate high-level result;
- detailed plan saved after account/email choice.

### 36.2 Paid onboarding diagnostic

- 30–45 minutes maximum, resumable;
- adaptive routing can shorten when evidence is strong;
- includes chart and scenario tasks;
- does not mark an objective fully mastered from one answer;
- uses prior-certificate claims as a routing signal, not evidence;
- lets experienced learners skip basic lessons but schedules verification.

## 37. Anki and Quizlet-compatible exports

### 37.1 Product decision

Provide downloadable decks, but keep the highest-value procedural learning in the web app. Decks are for facts, terminology, symbols, light characteristics, signal meanings, formulas, and short rule distinctions—not for replacing chart or radio practice.

### 37.2 Export formats

- **Anki:** `.apkg`, built in the offline content pipeline with a pinned exporter version.
- **Quizlet:** UTF-8 TSV/CSV in the currently supported import layout, plus a short import guide. Do not claim a native Quizlet deck format or official integration without one.
- **Generic:** CSV and printable PDF may be added later; PDF generation requires its own artifact workflow.

### 37.3 Deck structure

Offer:

```text
Förarintyg — Basbegrepp
Förarintyg — Sjökortssymboler
Förarintyg — Prickar och fyrar
Förarintyg — Väjningsregler
Förarintyg — Ljus, dagersignaler och ljud
Förarintyg — Säkerhet och sjömanskap
Förarintyg — Formler och kursomvandling
SRC — Bokstaveringsalfabet och siffror
SRC — Anropsordning
SRC — Utrustning och GMDSS
```

### 37.4 Card schema

```text
card_id
certification
syllabus_version
objective_id
front
back
extra_explanation
source_short
source_url_or_id
media_path
media_alt
card_type
content_version
last_reviewed_at
```

### 37.5 Card design

- one fact or discrimination per card;
- avoid long paragraph fronts;
- use cloze only when context is useful;
- include both recognition and production cards for key terms;
- original media only;
- include deck version and “not for navigation” where chart-like material appears;
- do not include exam-like questions whose sharing would undermine item security;
- do not expose reviewer-only notes.

### 37.6 Build pipeline

```text
/pipeline/decks/
  select_cards.ts
  validate_cards.ts
  export_quizlet.ts
  export_anki.py
  manifests/
  snapshots/
```

Deck generation must be deterministic. CI verifies:

- no missing source;
- no retired/stale card;
- no duplicate front within a deck;
- media exists and licence permits export;
- encoding and Swedish characters;
- expected card count;
- import smoke test for `.apkg` where practical.

### 37.7 Entitlement and piracy trade-off

- Paid users can download versioned core decks.
- A small free deck can be a lead magnet.
- Do not add invasive DRM.
- Place purchaser email/order watermark only in a manifest/readme if legally reviewed and disclosed; never expose it on every card by default.
- Accept that files can be shared and keep the differentiated procedural experience server-side.

## 38. Lesson content model

### 38.1 Lesson composition

Lessons are structured blocks, not arbitrary HTML blobs.

```text
heading
lead
paragraph
callout
term_definition
image
annotated_image
short_video
audio
worked_example
step_sequence
comparison
formula
interactive_embed
knowledge_check
source_note
safety_note
official_process_note
summary
next_step
```

### 38.2 Lesson size

- one main objective or tightly connected objective group;
- typical reading/watch time 4–8 minutes;
- segment videos into 2–6 minute units;
- put a retrieval prompt before re-explaining where appropriate;
- provide transcript and text equivalent;
- avoid requiring video to access essential facts.

### 38.3 Glossary

Maintain a versioned Swedish nautical glossary with:

- preferred term;
- accepted synonym;
- disallowed/ambiguous wording;
- definition;
- pronunciation/audio where useful;
- related terms;
- certification scope;
- source;
- editorial notes.

Use glossary linting in content CI.

### 38.4 Source display

Learner-facing source display should be concise:

> “Källa: NFB:s kunskapsfordringar för Förarintyg, version 2025-02-01.”

Admin view stores full page/section and retrieval details. Do not overwhelm beginner screens with legal citations, but make them accessible.

## 39. Content production workflow

### 39.1 Roles

```text
researcher
instructional_designer
item_writer
domain_reviewer
language_editor
media_reviewer
publisher
admin
```

One person may hold several roles in a small team, but a writer cannot be the sole approver of their own safety-critical item.

### 39.2 Workflow states

```text
idea
draft
automated_checks_failed
ready_for_domain_review
domain_changes_requested
domain_approved
ready_for_editorial_review
editorial_changes_requested
approved
scheduled
live
review_required
retired
```

### 39.3 AI policy

AI may:

- extract a proposed taxonomy from supplied primary sources;
- draft explanations and item variants;
- propose misconception-based distractors;
- flag inconsistent terminology;
- generate test fixtures and synthetic fictional scenario parameters.

AI may not:

- browse arbitrary competitor content into the pipeline;
- publish directly;
- invent a rule/source;
- decide that copyrighted material is safe to reuse;
- generate final safety/medical/legal instruction without human review;
- grade open-ended learner safety answers at runtime as the only authority.

### 39.4 Pipeline layout

```text
/pipeline/
  README.md
  package.json
  sources/
    manifests/
    originals/          # not deployed; licence-controlled
    extracted/
  taxonomy/
    01_extract.ts
    02_normalise.ts
    03_validate.ts
  content/
    10_generate_lessons.ts
    11_generate_items.ts
    12_generate_variants.ts
    13_generate_chart_tasks.ts
  review/
    20_export_review.ts
    21_import_review.ts
  media/
    30_validate_assets.ts
  decks/
  import/
    40_import_to_staging.ts
    41_publish.ts
  reports/
  prompts/
  schemas/
```

Pipeline is local/CI tooling and is never exposed as an application API. `ANTHROPIC_API_KEY` or other model keys must not be available to the production web runtime.

### 39.5 Taxonomy extraction

Output columns:

```text
objective_id
certification_id
syllabus_version_id
parent_objective_id
title_sv
learner_outcome_sv
objective_type
criticality
source_document_id
source_locator
prerequisite_ids
recommended_item_kinds
notes
human_status
```

Human editors must approve the taxonomy before lesson/item generation.

### 39.6 Generation requirements

Each AI draft request includes only:

- approved source excerpts;
- approved glossary;
- approved objective definition;
- item-writing rules;
- explicit copyright and non-invention instruction;
- output JSON schema;
- prompt/version metadata.

Store generation provenance. Do not store hidden model reasoning.

### 39.7 Review export

Use a structured web review UI as the long-term path. CSV export remains useful for domain experts.

Columns include:

```text
item_version_id
objective
stem
options
answer
explanation
distractor_rationales
source_excerpt
source_locator
criticality
difficulty
accessibility_alt
media_preview
review_decision
review_comment
suggested_fix
reviewer
reviewed_at
```

### 39.8 Publishing

Publishing is a transaction:

1. validate source active;
2. validate reviewer approvals;
3. validate media licence;
4. validate item/lesson schema;
5. create immutable live version;
6. update search/cache indexes;
7. record audit event;
8. run smoke test;
9. allow rollback to prior version.

### 39.9 Corrections

For a content correction:

- never mutate historical item text used in completed simulations;
- create a new version;
- mark severity: typo, clarity, factual, safety, legal;
- invalidate learner evidence only when the correction materially changes the capability/answer;
- notify affected learners for significant safety/legal corrections;
- preserve audit history.

## 40. Content-review rubric

Score every item/lesson on:

1. factual correctness;
2. source fidelity;
3. objective alignment;
4. clarity in Swedish;
5. cognitive demand;
6. distractor quality;
7. fairness/no trick wording;
8. practical relevance;
9. safety framing;
10. accessibility;
11. copyright/media clearance;
12. explanation quality;
13. version/date sensitivity.

A safety-critical item requires all categories to pass; no averaging away a critical defect.

## 41. Admin content studio

### 41.1 Core functions

- certification/syllabus management;
- objective graph editor;
- source register and change alerts;
- lesson block editor with preview;
- item editor per interaction type;
- chart scenario editor with visual preview;
- generic radio scenario editor;
- review queues and comments;
- bulk import/export;
- publish/retire/version operations;
- psychometric dashboards;
- user-reported issue triage;
- audit log.

### 41.2 Item preview matrix

Preview every item in:

- mobile 375×667;
- mobile landscape;
- tablet;
- desktop;
- keyboard-only mode;
- high zoom 200%;
- light/dark only if dark mode exists;
- reduced-motion mode;
- Swedish screen-reader reading order check for representative items.

### 41.3 Content issue reporting

Learners can report:

```text
frågan är otydlig
jag tror att svaret är fel
bilden fungerar inte
källan verkar gammal
tillgänglighetsproblem
annat
```

Create an issue tied to item version and attempt context. Never change the learner’s score automatically from an unreviewed report.

### 41.4 Admin security

- admin role in server-verified app metadata;
- MFA required;
- no service-role key in browser;
- sensitive actions re-authenticated;
- publish/refund/user-impersonation actions logged;
- no unrestricted production SQL console exposed through app;
- support impersonation, if added, is read-only by default and visibly bannered.

---

# Part VII — Data model and backend contracts

## 42. Data-model principles

1. Study data belongs to a **learner**, not directly to the purchasing auth user.
2. Live content is immutable by version; edits create new versions.
3. Official requirements are versioned and date-stamped.
4. Attempts snapshot the item version and grading configuration.
5. Polymorphic interaction payloads may use validated JSONB; relationships and reportable facts should be normalised.
6. Money is integer öre. Store currency and tax facts with every order.
7. Times are `timestamptz`; user-facing dates use `Europe/Stockholm` unless the user chooses another timezone.
8. Every user-data table has RLS in the same migration that creates it.
9. Every table has appropriate indexes and explicit delete behaviour.
10. Use soft retirement/versioning for educational content; use hard/cascade deletion for learner data where legally permitted.

## 43. Identity, guardians, and learners

### 43.1 `profiles`

One row per Supabase auth user/account owner.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  locale text not null default 'sv-SE',
  timezone text not null default 'Europe/Stockholm',
  display_name text,
  account_type text not null default 'individual'
    check (account_type in ('individual','guardian','organisation_member')),
  marketing_email_allowed boolean not null default false,
  product_analytics_allowed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Email in `profiles` is a convenience snapshot; auth remains the identity source.

### 43.2 `learners`

```sql
create table learners (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  age_band text not null
    check (age_band in ('under_13','13_15','16_17','18_plus','unknown')),
  birth_year smallint,
  locale text not null default 'sv-SE',
  timezone text not null default 'Europe/Stockholm',
  is_self_profile boolean not null default false,
  accessibility_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

Do not collect full date of birth by default. `birth_year` is optional and should be avoided for free leads.

### 43.3 `learner_guardians`

```sql
create table learner_guardians (
  learner_id uuid not null references learners(id) on delete cascade,
  guardian_user_id uuid not null references profiles(id) on delete cascade,
  relationship text not null default 'self'
    check (relationship in ('self','guardian','purchaser','instructor','other')),
  permissions jsonb not null default '{"study":true,"progress":true,"billing":true}'::jsonb,
  status text not null default 'active'
    check (status in ('invited','active','revoked')),
  created_at timestamptz not null default now(),
  primary key (learner_id, guardian_user_id)
);
```

For v1, exactly one active billing guardian is enough. The schema allows later sharing.

### 43.4 `guardian_consents`

```sql
create table guardian_consents (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  guardian_user_id uuid not null references profiles(id) on delete cascade,
  consent_type text not null,
  policy_version text not null,
  granted boolean not null,
  evidence jsonb not null,
  created_at timestamptz not null default now(),
  withdrawn_at timestamptz
);
```

Consent types are purpose-specific. Do not bundle marketing, audio storage, and essential account processing into one flag.

### 43.5 Learner access

A minor learner may access the product through:

- guardian-authenticated shared device;
- a short-lived learner link;
- a local learner PIN/token.

Do not implement a reusable plaintext PIN. Store a slow hash, rate-limit attempts, rotate tokens, and allow immediate guardian revocation. Learner mode cannot access billing, marketing settings, raw guardian information, or other learner profiles.

## 44. Certification and source model

### 44.1 `certifications`

```sql
create table certifications (
  id text primary key,
  name_sv text not null,
  short_name_sv text not null,
  description_sv text not null,
  issuing_body text,
  active boolean not null default false,
  practical_component boolean not null default false,
  official_url text,
  created_at timestamptz not null default now()
);
```

### 44.2 `certification_prerequisites`

```sql
create table certification_prerequisites (
  certification_id text not null references certifications(id),
  prerequisite_certification_id text references certifications(id),
  prerequisite_type text not null
    check (prerequisite_type in ('certificate','age','practical','simulator','other')),
  rule jsonb not null,
  source_document_id uuid,
  valid_from date,
  valid_to date,
  primary key (certification_id, prerequisite_type, rule)
);
```

If JSONB in a primary key is awkward in migration tooling, use a generated UUID and a uniqueness constraint on a stable hash.

### 44.3 `source_documents`

```sql
create table source_documents (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  title text not null,
  issuer text not null,
  canonical_url text not null,
  document_version text,
  effective_from date,
  effective_to date,
  retrieved_at timestamptz not null,
  content_sha256 text,
  local_storage_path text,
  copyright_notes text,
  permitted_uses text,
  status text not null default 'active'
    check (status in ('active','superseded','unavailable','review_required')),
  last_checked_at timestamptz not null,
  next_review_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);
```

Do not serve stored source files publicly unless redistribution is permitted.

### 44.4 `syllabus_versions`

```sql
create table syllabus_versions (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  source_document_id uuid not null references source_documents(id),
  name text not null,
  effective_from date,
  effective_to date,
  status text not null
    check (status in ('draft','review','active','superseded')),
  verified_at timestamptz,
  verified_by uuid references profiles(id),
  change_summary text,
  created_at timestamptz not null default now()
);

create unique index one_active_syllabus_per_certification
on syllabus_versions(certification_id)
where status = 'active';
```

### 44.5 `official_facts`

Store changeable public facts such as duration, pass threshold, age, fees, required materials, and official links.

```sql
create table official_facts (
  id uuid primary key default gen_random_uuid(),
  certification_id text references certifications(id),
  fact_key text not null,
  value jsonb not null,
  public_copy_sv text,
  source_document_id uuid not null references source_documents(id),
  valid_from date,
  valid_to date,
  verified_at timestamptz not null,
  verified_by uuid references profiles(id),
  status text not null default 'active'
    check (status in ('draft','active','superseded','review_required')),
  unique (certification_id, fact_key, valid_from)
);
```

Public rendering must show the active fact and its last-checked date where the value is likely to change.

## 45. Objectives and lessons

### 45.1 `objectives`

```sql
create table objectives (
  id text primary key,
  syllabus_version_id uuid not null references syllabus_versions(id),
  parent_id text references objectives(id),
  section_key text not null,
  order_index int not null,
  title_sv text not null,
  outcome_sv text not null,
  objective_type text not null,
  criticality text not null,
  weight numeric(6,3) not null default 1,
  required boolean not null default true,
  status text not null default 'draft'
    check (status in ('draft','review','active','retired')),
  created_at timestamptz not null default now()
);
```

### 45.2 `objective_prerequisites`

```sql
create table objective_prerequisites (
  objective_id text not null references objectives(id) on delete cascade,
  prerequisite_objective_id text not null references objectives(id),
  strength text not null default 'required'
    check (strength in ('recommended','required')),
  primary key (objective_id, prerequisite_objective_id),
  check (objective_id <> prerequisite_objective_id)
);
```

Run a cycle check in pipeline/admin before publishing.

### 45.3 `objective_sources`

```sql
create table objective_sources (
  objective_id text not null references objectives(id) on delete cascade,
  source_document_id uuid not null references source_documents(id),
  locator text not null,
  source_excerpt_internal text,
  primary key (objective_id, source_document_id, locator)
);
```

The excerpt is internal review material and must respect source-use permissions.

### 45.4 Lessons

```sql
create table lessons (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  slug text not null,
  status text not null default 'draft',
  current_version_id uuid,
  created_at timestamptz not null default now(),
  unique (certification_id, slug)
);

create table lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  version int not null,
  title_sv text not null,
  lead_sv text,
  estimated_minutes int,
  content_blocks jsonb not null,
  accessibility_summary text,
  status text not null default 'draft',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (lesson_id, version)
);

alter table lessons
  add constraint lessons_current_version_fk
  foreign key (current_version_id) references lesson_versions(id);
```

### 45.5 Lesson relationships

```sql
create table lesson_objectives (
  lesson_version_id uuid not null references lesson_versions(id) on delete cascade,
  objective_id text not null references objectives(id),
  role text not null check (role in ('primary','secondary','prerequisite')),
  primary key (lesson_version_id, objective_id, role)
);

create table lesson_sources (
  lesson_version_id uuid not null references lesson_versions(id) on delete cascade,
  source_document_id uuid not null references source_documents(id),
  locator text not null,
  primary key (lesson_version_id, source_document_id, locator)
);
```

## 46. Assessment content

### 46.1 Templates and versions

```sql
create table item_templates (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  certification_id text not null references certifications(id),
  item_kind text not null,
  status text not null default 'draft',
  current_version_id uuid,
  created_at timestamptz not null default now()
);

create table item_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references item_templates(id) on delete cascade,
  version int not null,
  syllabus_version_id uuid not null references syllabus_versions(id),
  stem_sv text,
  interaction jsonb not null,
  answer_key jsonb not null,
  grading_policy jsonb not null,
  explanation_sv text not null,
  worked_solution jsonb,
  difficulty_estimate numeric(7,2) not null default 1500,
  criticality text not null,
  accessibility_alternative jsonb,
  generation_provenance jsonb,
  status text not null default 'draft'
    check (status in ('draft','review','approved','live','review_required','retired')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (template_id, version)
);

alter table item_templates
  add constraint item_templates_current_version_fk
  foreign key (current_version_id) references item_versions(id);
```

### 46.2 Objectives, sources, misconceptions, media

```sql
create table item_objectives (
  item_version_id uuid not null references item_versions(id) on delete cascade,
  objective_id text not null references objectives(id),
  role text not null check (role in ('primary','secondary')),
  primary key (item_version_id, objective_id)
);

create table item_sources (
  item_version_id uuid not null references item_versions(id) on delete cascade,
  source_document_id uuid not null references source_documents(id),
  locator text not null,
  primary key (item_version_id, source_document_id, locator)
);

create table misconceptions (
  id text primary key,
  certification_id text references certifications(id),
  title_sv text not null,
  explanation_sv text not null,
  remediation_lesson_id uuid references lessons(id),
  severity text not null default 'standard'
);

create table item_misconceptions (
  item_version_id uuid not null references item_versions(id) on delete cascade,
  answer_key text not null,
  misconception_id text not null references misconceptions(id),
  primary key (item_version_id, answer_key, misconception_id)
);
```

### 46.3 Media

```sql
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type text not null,
  title text,
  alt_sv text,
  transcript_sv text,
  creator text,
  licence text not null,
  licence_proof_path text,
  export_allowed boolean not null default false,
  public_allowed boolean not null default false,
  sha256 text not null,
  status text not null default 'review',
  created_at timestamptz not null default now()
);

create table item_media (
  item_version_id uuid not null references item_versions(id) on delete cascade,
  media_asset_id uuid not null references media_assets(id),
  role text not null,
  primary key (item_version_id, media_asset_id, role)
);
```

### 46.4 Free pool

Use a join table, not a generic boolean on all item versions:

```sql
create table public_item_pools (
  id uuid primary key default gen_random_uuid(),
  pool_key text not null unique,
  status text not null default 'draft'
);

create table public_item_pool_entries (
  pool_id uuid not null references public_item_pools(id) on delete cascade,
  item_version_id uuid not null references item_versions(id),
  order_index int,
  primary key (pool_id, item_version_id)
);
```

## 47. Review, audit, and content issues

```sql
create table review_decisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_version_id uuid not null,
  review_type text not null
    check (review_type in ('domain','editorial','accessibility','media','legal')),
  reviewer_user_id uuid not null references profiles(id),
  decision text not null check (decision in ('approve','changes_requested','reject')),
  comments text,
  rubric jsonb,
  created_at timestamptz not null default now()
);

create table content_issues (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references profiles(id),
  learner_id uuid references learners(id) on delete set null,
  entity_type text not null,
  entity_version_id uuid not null,
  attempt_id uuid,
  category text not null,
  description text,
  severity text not null default 'untriaged',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references profiles(id),
  actor_type text not null,
  action text not null,
  entity_type text,
  entity_id text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  request_id text,
  ip_hash text,
  created_at timestamptz not null default now()
);
```

Keep audit records access-restricted and retention-reviewed.

## 48. Learning activity and attempts

### 48.1 Study sessions

```sql
create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  certification_id text not null references certifications(id),
  mode text not null,
  plan_snapshot jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  device_class text,
  interruption_ms int not null default 0
);

create table session_activities (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references study_sessions(id) on delete cascade,
  order_index int not null,
  activity_type text not null,
  entity_id uuid,
  objective_id text references objectives(id),
  status text not null default 'planned',
  started_at timestamptz,
  finished_at timestamptz,
  unique (session_id, order_index)
);
```

### 48.2 Attempts

```sql
create table attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  session_id uuid references study_sessions(id) on delete set null,
  item_version_id uuid not null references item_versions(id),
  context text not null
    check (context in ('lesson','guided','practice','mastery','diagnostic','simulation','free')),
  variant_seed text,
  item_snapshot jsonb not null,
  response jsonb not null,
  grade_result jsonb not null,
  correct boolean not null,
  score01 numeric(5,4) not null,
  independent boolean not null,
  hint_level int not null default 0,
  confidence text,
  active_latency_ms int,
  device_class text,
  created_at timestamptz not null default now()
);

create index attempts_learner_created_idx on attempts(learner_id, created_at desc);
create index attempts_item_version_idx on attempts(item_version_id);
```

`item_snapshot` contains only the fields necessary to reproduce the historical result, not large media blobs.

### 48.3 Step evidence

```sql
create table attempt_steps (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  step_index int not null,
  step_key text not null,
  response jsonb,
  correct boolean,
  hint_level int not null default 0,
  created_at timestamptz not null default now(),
  unique (attempt_id, step_index)
);
```

### 48.4 SRS state

```sql
create table srs_state (
  learner_id uuid not null references learners(id) on delete cascade,
  item_template_id uuid not null references item_templates(id),
  fsrs_card jsonb not null,
  due_at timestamptz not null,
  last_attempt_id uuid references attempts(id),
  updated_at timestamptz not null default now(),
  primary key (learner_id, item_template_id)
);

create index srs_due_idx on srs_state(learner_id, due_at);
```

Schedule at template/concept level so variants can be served without binding memory to an exact wording. Ensure variant difficulty remains comparable.

### 48.5 Skill state

```sql
create table learner_skill_state (
  learner_id uuid not null references learners(id) on delete cascade,
  objective_id text not null references objectives(id),
  stage text not null,
  evidence jsonb not null,
  last_independent_success_at timestamptz,
  due_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, objective_id)
);
```

### 48.6 Objective/readiness state

```sql
create table learner_objective_state (
  learner_id uuid not null references learners(id) on delete cascade,
  objective_id text not null references objectives(id),
  readiness_status text not null,
  score01 numeric(5,4) not null,
  evidence_summary jsonb not null,
  current_misconceptions text[] not null default '{}',
  last_evaluated_at timestamptz not null,
  primary key (learner_id, objective_id)
);

create table readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  certification_id text not null references certifications(id),
  syllabus_version_id uuid not null references syllabus_versions(id),
  score int not null check (score between 0 and 100),
  label text not null,
  components jsonb not null,
  caps jsonb not null,
  algorithm_version text not null,
  created_at timestamptz not null default now()
);
```

## 49. Chart, rule, and radio scenario data

```sql
create table chart_assets (
  id text primary key,
  title_sv text not null,
  version int not null,
  manifest jsonb not null,
  svg_media_id uuid not null references media_assets(id),
  status text not null,
  domain_reviewed_at timestamptz,
  legal_reviewed_at timestamptz
);

create table chart_scenarios (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  syllabus_version_id uuid not null references syllabus_versions(id),
  chart_asset_id text not null references chart_assets(id),
  scenario_type text not null,
  schema_version int not null,
  scenario jsonb not null,
  grading_policy jsonb not null,
  status text not null default 'draft',
  current_version int not null default 1,
  created_at timestamptz not null default now()
);

create table simulator_scenarios (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  simulator_type text not null
    check (simulator_type in ('colreg','lights','sound','vhf','weather','electronic_chart','sailing')),
  schema_version int not null,
  scenario jsonb not null,
  grading_policy jsonb not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);
```

For production, scenario versioning should mirror item versioning rather than mutating rows. The simplified table above may be split into template/version tables in the first migration.

## 50. Exam simulations

```sql
create table exam_blueprints (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  syllabus_version_id uuid not null references syllabus_versions(id),
  name text not null,
  mode text not null,
  configuration jsonb not null,
  source_document_id uuid references source_documents(id),
  verified_at timestamptz,
  status text not null default 'draft'
);

create table exam_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  blueprint_id uuid not null references exam_blueprints(id),
  blueprint_snapshot jsonb not null,
  seed text not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  submitted_at timestamptz,
  status text not null default 'in_progress',
  score jsonb,
  passed boolean,
  valid_for_readiness boolean not null default false
);

create table exam_session_items (
  id uuid primary key default gen_random_uuid(),
  exam_session_id uuid not null references exam_sessions(id) on delete cascade,
  order_index int not null,
  item_version_id uuid not null references item_versions(id),
  item_snapshot jsonb not null,
  objective_snapshot jsonb not null,
  unique (exam_session_id, order_index)
);

create table exam_responses (
  exam_session_item_id uuid primary key references exam_session_items(id) on delete cascade,
  response jsonb,
  flagged boolean not null default false,
  saved_at timestamptz,
  grade_result jsonb,
  correct boolean
);
```

## 51. Practical preparation and outcomes

```sql
create table practical_checklists (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  certification_id text not null references certifications(id),
  checklist_version text not null,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table practical_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  certification_id text not null references certifications(id),
  provider_name text,
  occurred_on date,
  learner_notes text,
  instructor_confirmation jsonb,
  created_at timestamptz not null default now()
);

create table exam_outcomes (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  certification_id text not null references certifications(id),
  outcome text not null check (outcome in ('passed','failed','cancelled','not_taken')),
  attempt_number int,
  exam_date date,
  evidence_type text not null default 'self_reported',
  evidence jsonb,
  survey_token_id uuid,
  reported_at timestamptz not null default now()
);
```

Outcome emails must not expose the result in the URL. Use a signed, single-purpose token that opens a confirmation page; record only after confirmation.

## 52. Products, orders, entitlements, and guarantees

### 52.1 Products and prices

```sql
create table products (
  id text primary key,
  name_sv text not null,
  description_sv text not null,
  access_months int not null,
  seat_count int not null default 1,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb
);

create table product_certifications (
  product_id text not null references products(id),
  certification_id text not null references certifications(id),
  primary key (product_id, certification_id)
);

create table product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id),
  currency char(3) not null default 'SEK',
  amount_ore_inc_vat int not null,
  vat_rate_basis_points int not null,
  stripe_price_id text unique,
  active_from timestamptz not null,
  active_to timestamptz,
  status text not null default 'active'
);
```

Store both inclusive price and VAT facts on the order. Internal accounting may derive ex-VAT with an approved rounding policy.

### 52.2 Orders

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid not null references profiles(id),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  status text not null,
  currency char(3) not null,
  subtotal_ore int not null,
  vat_ore int not null,
  total_ore int not null,
  customer_country char(2),
  terms_version text not null,
  withdrawal_consent_snapshot jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  product_name_snapshot text not null,
  quantity int not null,
  unit_amount_ore_inc_vat int not null,
  vat_rate_basis_points int not null,
  stripe_price_id text
);
```

### 52.3 Entitlements and learner assignment

```sql
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid not null references profiles(id),
  order_item_id uuid references order_items(id),
  product_id text not null references products(id),
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  seat_count int not null default 1,
  status text not null default 'active',
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create table entitlement_learners (
  entitlement_id uuid not null references entitlements(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (entitlement_id, learner_id)
);
```

A partial unique index or transaction must enforce active assignments ≤ seat count.

### 52.4 Guarantee claims

```sql
create table guarantee_claims (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references learners(id) on delete cascade,
  entitlement_id uuid not null references entitlements(id),
  guarantee_version text not null,
  eligibility_snapshot jsonb not null,
  requested_benefit text not null,
  status text not null default 'submitted',
  reviewer_user_id uuid references profiles(id),
  decision_reason text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
```

No automatic financial benefit in v1. Eligibility code is pure, versioned, and fully tested; a human makes the final decision.

## 53. Leads, consent, and communications

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  email text,
  age_band text,
  source text not null,
  diagnostic_result jsonb,
  account_created boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  lead_id uuid references leads(id),
  purpose text not null,
  action text not null check (action in ('grant','withdraw')),
  policy_version text not null,
  evidence jsonb not null,
  created_at timestamptz not null default now()
);

create table communication_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  learner_id uuid references learners(id),
  message_type text not null,
  provider_message_id text,
  status text not null,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);
```

Do not send marketing to a minor learner address. Transactional guardian messages and learner reminders must be separated by purpose.

## 54. Deck exports

```sql
create table deck_exports (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references certifications(id),
  syllabus_version_id uuid not null references syllabus_versions(id),
  deck_key text not null,
  format text not null check (format in ('apkg','quizlet_tsv','csv')),
  version text not null,
  storage_path text not null,
  sha256 text not null,
  card_count int not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (deck_key, format, version)
);

create table deck_downloads (
  id uuid primary key default gen_random_uuid(),
  deck_export_id uuid not null references deck_exports(id),
  learner_id uuid not null references learners(id) on delete cascade,
  entitlement_id uuid references entitlements(id),
  downloaded_at timestamptz not null default now()
);
```

Use short-lived signed URLs after entitlement check.

## 55. RLS design

### 55.1 Helper functions

Create audited `security definer` helpers with fixed `search_path`, for example:

```sql
can_access_learner(target_learner_id uuid) returns boolean
has_active_entitlement(target_learner_id uuid, target_certification_id text) returns boolean
is_admin() returns boolean
```

Functions must not accept a user ID from the client as proof. They derive `auth.uid()` internally.

### 55.2 Policy rules

- A user can read/update their own `profiles` row.
- A guardian can access only learners linked through an active `learner_guardians` row and according to permissions.
- Attempts, SRS, skill state, objectives, readiness, simulations, practical logs, outcomes, and deck downloads are accessible only through learner access.
- Live public lessons/items are readable anonymously only through explicit public pools/endpoints.
- Paid content requires active learner entitlement for the certification.
- Draft/review content is admin/reviewer only.
- Orders and billing are purchaser only; learner mode cannot access them.
- Service-role operations are limited to trusted server routes/jobs.
- Admin access requires both server role check and RLS/admin policy; middleware alone is insufficient.

### 55.3 RLS tests

Automated tests must prove:

- user A cannot read user B’s learner, attempts, orders, or outcomes;
- guardian A can read linked learner but not billing owned by another guardian without permission;
- revoked guardian loses access immediately;
- expired entitlement blocks paid item fetch but leaves account/progress visible;
- anonymous user sees only public-pool content;
- non-admin cannot publish or read draft answer keys;
- learner mode cannot access purchaser email/payment data;
- webhook service can grant entitlement idempotently.

---

# Part VIII — Technical architecture

## 56. Technology choices

Use current patched stable releases at implementation time and pin exact versions in `pnpm-lock.yaml`. At the research date, Next.js 16.2 is the current stable release line while 16.3 is preview; start on a patched stable 16.x release rather than the older Next.js 15 choice in the first draft.

| Layer | Choice | Requirements |
|---|---|---|
| Web framework | Next.js 16.x, App Router, React, strict TypeScript | Server Components by default. Pin latest patched stable release in the chosen line. |
| Runtime | Active LTS Node.js supported by deployment | Pin via `.nvmrc`/`packageManager`; keep local, CI, and Vercel aligned. |
| Package manager | `pnpm` | Lockfile committed; frozen installs in CI. |
| UI | Tailwind CSS + shadcn/ui primitives | Own the final design system; audit generated components for accessibility. |
| Validation | Zod | Shared schemas for server inputs, content, chart manifests, and pipeline. |
| Database/Auth/Storage | Supabase EU region | Postgres migrations, generated types, RLS, private buckets. |
| Payments | Stripe Checkout + webhooks | Dynamic eligible payment methods; enable Klarna in Stripe settings where available. |
| Email | Resend | Transactional mail; separate marketing consent and provider configuration. |
| Product analytics | PostHog EU or approved first-party alternative | Consent-aware, no minor profiling. |
| Error/observability | OpenTelemetry-compatible instrumentation + approved error service | Scrub PII, answers, tokens, and audio. |
| Memory scheduling | `ts-fsrs` | Wrapped in `/lib/domain/srs`; package-specific types do not leak through app. |
| Unit/property tests | Vitest + fast-check where useful | Pure domain functions and geometry. |
| E2E | Playwright | Mobile/desktop, auth, purchase, RLS-facing flows, chart interactions. |
| Accessibility tests | axe-core integration + manual testing | Automated checks are necessary but not sufficient. |
| Hosting | Vercel | EU data and logging implications reviewed; scheduled jobs protected. |

### 56.1 Dependency policy

A new dependency requires:

- reason and alternatives;
- maintenance/activity check;
- licence check;
- bundle/runtime impact;
- security review;
- whether it processes user data;
- an ADR for major infrastructure dependencies.

Do not add an animation, charting, state-machine, or form library solely to reduce a few lines of code.

## 57. Repository layout

```text
/app
  /(marketing)
    page.tsx
    forarintyg/
    kustskepparintyg/
    src/
    batpraktik/
    seglarintyg-1/
    priser/
    gratis-kunskapstest/
    gratis-sjokortsovning/
    kunskapsbank/[slug]/
    ordlista/[term]/
    (legal)/
  /(auth)
    logga-in/
    callback/
  /(learner)
    app/
      layout.tsx
      start/
      plan/
      kurser/
      lektion/
      ova/
      sjokort/
      regler/
      radio/
      simuleringar/
      felbok/
      framsteg/
      material/
      decks/
      praktik/
      profil/
      konto/
  /admin/
  /api/
    stripe/webhook/route.ts
    cron/source-check/route.ts
    cron/outcomes/route.ts
    health/route.ts
/components
  /design-system
  /marketing
  /learning
  /chart
  /simulators
  /admin
/lib
  /domain
    readiness.ts
    mastery.ts
    srs.ts
    sessionPlanner.ts
    examBuilder.ts
    entitlements.ts
    guarantee.ts
    money.ts
  /chart
  /grading
  /content
  /auth
  /supabase
  /stripe
  /email
  /analytics
  /security
  /legal
  /i18n
  /observability
/public
  /charts
  /media/public
/pipeline
/supabase
  /migrations
  /tests
  seed.sql
/tests
  /unit
  /integration
  /e2e
  /fixtures
/docs
  /adr
  /runbooks
  /research
  /content
SPEC.md
CLAUDE.md
.env.example
```

## 58. Architectural boundaries

### 58.1 Domain functions

All core decisions live in pure or side-effect-isolated modules:

- grading;
- chart geometry;
- SRS rating/due planning;
- procedural stage transitions;
- readiness calculation;
- session activity prioritisation;
- simulation assembly and scoring;
- entitlement status;
- guarantee eligibility;
- price/VAT display calculation;
- source-staleness rules.

React components render state and dispatch actions. They do not contain hidden grading formulas or entitlement rules.

### 58.2 Server authority

The server is authoritative for:

- entitlement;
- paid content access;
- item answer/grading result;
- attempt persistence;
- SRS and skill-state updates;
- simulation timer and score;
- order status;
- guarantee eligibility;
- role/permission checks.

The client may calculate provisional geometry for responsive visual feedback, but the server regrades on submission using the same versioned pure package.

### 58.3 Answer-key handling

- Do not include paid answer keys in page source, RSC payloads, or static JavaScript bundles.
- Fetch a challenge payload without the canonical answer.
- Submit response to a server action/RPC.
- Return grade result and only the explanation fields allowed after submission.
- In learning mode, cache only the returned feedback for the current attempt.
- In simulation mode, do not return correctness until final submission.

Perfect prevention of determined content extraction is impossible, but avoid making bulk scraping trivial.

### 58.4 Shared schemas

Every external boundary validates with Zod:

- route/server-action inputs;
- Stripe metadata;
- cron payload/secret;
- content imports;
- chart manifests/scenarios;
- learner responses;
- analytics event properties;
- environment variables.

Never cast untrusted JSON with `as SomeType`.

## 59. Rendering and caching

### 59.1 Marketing pages

- statically generated or cached server-rendered;
- revalidate on content publish;
- no user-specific data in shared cache;
- metadata, canonical URLs, structured data, OG images;
- Lighthouse targets defined below.

### 59.2 Authenticated pages

- dynamic where learner-specific;
- Server Components fetch protected data with server Supabase client;
- client components only for interaction;
- avoid waterfall fetches;
- never cache one learner’s data for another;
- tag content cache by syllabus/lesson version.

### 59.3 Chart assets

- immutable versioned URLs;
- long public cache for public/free assets;
- signed/private delivery for paid-only commissioned assets if required;
- manifest and SVG version must match;
- checksum validated in CI.

## 60. API and server-action contracts

Prefer Server Actions for authenticated same-origin mutations where they improve simplicity. Use Route Handlers for webhooks, crons, health checks, and explicitly versioned public APIs.

### 60.1 Representative commands

```ts
startStudySession(input): Promise<StudySessionDTO>
getNextActivity(sessionId): Promise<ActivityChallengeDTO>
submitAttempt(input): Promise<AttemptFeedbackDTO>
requestHint(input): Promise<HintDTO>
completeLesson(input): Promise<LessonCompletionDTO>
startExamSimulation(input): Promise<ExamSessionDTO>
saveExamResponse(input): Promise<SaveAck>
submitExamSimulation(input): Promise<ExamResultDTO>
assignEntitlementSeat(input): Promise<AssignmentDTO>
createDeckDownload(input): Promise<SignedDownloadDTO>
reportContentIssue(input): Promise<IssueReceiptDTO>
```

### 60.2 Idempotency

Require an idempotency key for:

- attempt submission;
- session creation;
- simulation submission;
- checkout session creation;
- webhook event processing;
- entitlement creation;
- refund/credit action;
- outcome report submission.

Store processed external events:

```sql
create table external_events (
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload_hash text not null,
  processed_at timestamptz,
  result jsonb,
  primary key (provider, event_id)
);
```

### 60.3 Concurrency

- Use database transactions when grading updates attempt + SRS + skill/objective state.
- Lock the relevant SRS/skill row or use version columns to avoid lost updates from multiple tabs.
- A simulation may have only one final submission.
- Entitlement seat assignment enforces seat count transactionally.
- Publishing changes current versions in one transaction.

## 61. Authentication

### 61.1 v1 methods

- email magic link;
- optional email one-time code if supported cleanly;
- passkeys later;
- no BankID in v1.

NFB’s use of BankID/Freja is part of the official process, not a requirement for this independent course account.

### 61.2 Session security

- secure, HTTP-only cookies through supported Supabase SSR pattern;
- SameSite and secure attributes appropriate to flow;
- rotate/refresh sessions;
- invalidate on passwordless email change/account deletion;
- rate-limit magic-link requests;
- do not reveal whether an email exists;
- prevent open redirects in auth callback;
- record important account-security events.

### 61.3 Admin authentication

- MFA mandatory;
- separate admin route group;
- short inactivity timeout for sensitive screens;
- reauthentication for publish/refund/role changes;
- no admin role editable by normal profile update.

## 62. Payments and Stripe

### 62.1 Checkout creation

Server creates a Checkout Session after validating:

- active product/price;
- purchaser identity;
- learner/seat intent;
- country/currency support;
- terms version;
- age/guardian flow;
- no duplicate active purchase warning where appropriate.

Use a hosted or embedded Checkout based on legal/UX testing. Do not trust product/price IDs supplied by the browser; resolve them server-side.

### 62.2 Payment methods

Use Stripe’s eligible/dynamic payment method configuration. Enable card and Klarna in the Stripe account where available for the customer/currency. Do not promise Klarna to every user before Checkout confirms availability.

### 62.3 Webhook flow

For `checkout.session.completed` and relevant asynchronous-payment events:

1. read raw body;
2. verify Stripe signature;
3. insert/check `external_events` idempotency row;
4. validate metadata against server records;
5. create/update order;
6. grant entitlement only when payment state permits;
7. assign learner seat if known;
8. send receipt/onboarding email;
9. record audit and analytics events;
10. return quickly; retry-safe.

Handle refunds, disputes, expirations, and asynchronous failures. Never grant access from the browser success redirect alone.

### 62.4 Official fees

Our order record must never describe NFB licence/booking fees as included unless there is a formal integration/contract. Product pages and receipts state:

> “Avgift för provlicens, provtillfälle och eventuellt fysiskt material betalas separat.”

## 63. Email and notifications

### 63.1 Transactional messages

- sign-in link/code;
- purchase receipt/access granted;
- guardian learner invitation;
- exam-date reminder;
- outcome survey;
- guarantee decision;
- important content/safety correction;
- account deletion/export completion.

### 63.2 Study reminders

Opt-in separately. Allow:

- days of week;
- local time window;
- pause;
- frequency cap;
- immediate unsubscribe from reminders;
- guardian versus learner destination.

No guilt copy. No reminders to a child address without a reviewed guardian-safe flow.

### 63.3 Outcome survey

- Send only after the learner/guardian supplied an exam date and opted into service reminders.
- One initial message and at most one reminder.
- Link opens a confirmation page.
- Show why the data is collected.
- Allow “tog inte provet”.
- Do not enrol respondent in marketing automatically.

## 64. PWA and offline behaviour

### 64.1 v1 PWA

- installable manifest;
- app icons and theme metadata;
- offline shell for previously loaded non-sensitive UI;
- cache original chart assets required by an active session where permitted;
- queue unsent practice responses only with encrypted/appropriate local handling and clear sync state;
- no offline purchase or entitlement changes;
- no full paid answer-key cache;
- no offline training simulation counted for readiness in v1.

### 64.2 Cache privacy

- Never cache guardian/billing pages in shared caches.
- On logout, clear learner-specific IndexedDB/cache entries.
- On shared-device learner switching, isolate local state by learner ID and encryption strategy where needed.
- Display “sparat på enheten” and sync status accurately.

### 64.3 Future offline packs

A later offline learning pack may use encrypted, time-limited content bundles and deferred server grading. This is out of v1 because it increases answer-key exposure, entitlement complexity, and conflict resolution.

## 65. Observability and operations

### 65.1 Structured logs

Log:

- request/correlation ID;
- route/action;
- status/duration;
- anonymous user/learner surrogate ID where needed;
- content/algorithm version;
- error code;
- external provider request ID.

Do not log:

- magic links/tokens;
- full email unless required and protected;
- raw card/payment data;
- full item answer keys;
- learner audio;
- private source documents;
- sensitive free-text support content by default.

### 65.2 Alerts

Alert on:

- Stripe webhook failure/retry backlog;
- entitlement grant failure;
- elevated auth errors;
- source-change detection;
- content grading exception;
- simulation assembly failure;
- cron failure;
- storage permission error;
- unusual admin publishing/refund activity;
- RLS regression test failure;
- public error-rate/performance threshold breach.

### 65.3 Runbooks

Create `/docs/runbooks` for:

- payment succeeded but no access;
- wrong content answer/safety correction;
- source requirement changed;
- data export/deletion;
- account takeover;
- Stripe dispute/refund;
- email provider outage;
- Supabase outage;
- chart asset broken;
- privacy incident;
- admin credential compromise.

## 66. Performance budgets

### 66.1 Marketing

On representative mid-range mobile/4G:

- Lighthouse performance ≥ 90 for key landing pages;
- LCP ≤ 2.5 s at p75 target;
- CLS ≤ 0.1;
- INP ≤ 200 ms;
- initial JavaScript budget agreed and monitored;
- images sized and lazy-loaded;
- no autoplay video above the fold.

### 66.2 Learning app

- dashboard usable ≤ 3 s on representative device/network;
- MCQ answer feedback ≤ 500 ms p75 server round trip where network permits;
- chart pan/zoom target 60 fps, minimum acceptable 30 fps on mid-range device;
- chart task first interactive ≤ 3 s after route load when asset cached or reasonable network;
- response auto-save visible acknowledgement ≤ 1 s p75;
- no main-thread task > 200 ms during chart drag in representative tests.

### 66.3 Asset budgets

- optimise SVG paths;
- avoid giant embedded base64 assets;
- split videos by lesson;
- use responsive formats;
- preload only critical fonts/assets;
- self-host fonts where licence permits; never expose font files as downloadable product assets.

---

# Part IX — Legal, privacy, accessibility, and security

## 67. Legal review boundary

This specification identifies product requirements and risks; it is not a substitute for Swedish legal advice. Before public paid launch, obtain review of:

- terms of purchase and service;
- withdrawal-right flow and immediate-delivery consent;
- guarantee wording;
- privacy notice, cookies, analytics, and minor/guardian flow;
- accessibility obligations for the e-commerce/service;
- VAT treatment and invoicing;
- trademarks/brand/name;
- chart, symbol, media, and source licences;
- provider/referral terms;
- marketing claims and outcome statistics.

Store approved legal documents with version IDs and effective dates. Every order records the accepted versions.

## 68. Required disclaimers

### 68.1 Site-wide independence disclaimer

Recommended Swedish copy:

> “Sjöklart är en fristående utbildningstjänst. Vi utfärdar inte intyg och är inte Nämnden för båtlivsutbildning (NFB). Provlicens och provtillfälle bokas och betalas separat enligt NFB:s aktuella process.”

Use the final brand name and legally approved wording.

### 68.2 Navigation disclaimer

> “Övningskort, rutter och scenarier är fiktiva och får inte användas för verklig navigation.”

Display on:

- chart laboratory;
- printable fictional chart;
- downloads;
- relevant terms;
- chart screenshots shared from the product.

### 68.3 Practical preparation disclaimer

> “Den digitala modulen förbereder dig inför praktiska moment. Den ersätter inte handledd praktik, praktiskt prov eller instruktörens intygande.”

### 68.4 SRC disclaimer

> “Radiolabbet är extra träning och ersätter inte NFB:s obligatoriska simulator eller den officiella provprocessen.”

### 68.5 Result/readiness disclaimer

> “Beredskap är en uppskattning utifrån dina övningsresultat, inte en garanti eller ett officiellt provresultat.”

## 69. Consumer rights and checkout

### 69.1 Checkout information

Before payment, show clearly:

- seller identity and contact details;
- product and included certifications;
- access period;
- total price including VAT;
- payment method;
- when access starts;
- technical/system requirements;
- what official exam/material costs are excluded;
- cancellation/withdrawal information;
- complaint/support process;
- guarantee terms if offered;
- automatic renewal status (none in v1);
- separate practical/official steps.

### 69.2 Immediate access and withdrawal consent

If legal review concludes the withdrawal right can be lost for the chosen digital-content/service arrangement, require a deliberate, unchecked action with approved copy covering:

1. request for performance/delivery to begin immediately;
2. acknowledgement of the consequence for withdrawal rights;
3. durable confirmation after purchase.

Do not hide the control inside general terms and do not pre-check it. Provide a lawful path when the customer does not consent, or delay access according to the approved business/legal design.

### 69.3 Digital-service conformity

Implement:

- accurate product description;
- reasonable uptime/support expectations;
- content updates necessary during access;
- defect reporting;
- remedy/extension/refund workflow;
- notice for material changes to the service;
- export/deletion after termination as applicable.

### 69.4 Pricing and VAT

The working assumption is 25% VAT for a commercial online preparation service, but the company’s accountant must confirm the exact classification and invoicing. Store tax facts on the order rather than relying on a mutable product table.

## 70. Minors and guardians

### 70.1 Default product rule

- Purchaser/account owner must be 18+ in v1.
- A minor uses a linked learner profile.
- For a learner under 13, obtain and retain appropriate guardian evidence for consent-based optional processing.
- Essential processing should rely on the legally appropriate basis reviewed for the actual relationship; do not assume consent is the only basis.
- Avoid direct behavioural marketing to minors.
- Present privacy information in age-appropriate Swedish.

### 70.2 Data minimisation

For a minor learner, collect only:

- display name or nickname;
- age band;
- target certificate;
- optional exam date;
- learning progress;
- accessibility settings chosen by guardian/learner;
- optional practical notes.

Do not collect:

- personal identity number;
- precise home location;
- school;
- contacts/social graph;
- biometric data;
- raw voice recordings by default;
- health diagnosis to grant an accessibility option.

### 70.3 Marketing and analytics

- No advertising pixels in learner mode for minors.
- No lookalike audiences built from learner data.
- No personalised upsell based on a child’s anxiety/failure pattern.
- Guardian sees commercial messages; learner sees study recommendations.
- Product analytics for minors should be necessary, pseudonymised, aggregate-oriented, and reviewed.

### 70.4 Account transition

Define a reviewed process when a learner reaches adulthood:

- invite transfer to their own account;
- explain which data transfers;
- require identity/email confirmation;
- preserve guardian billing records separately;
- allow the learner to exercise their own data rights.

## 71. Privacy programme

### 71.1 Data inventory

Maintain a record of processing activities covering:

- accounts/authentication;
- guardian relationships;
- learning attempts and progress;
- payments/orders;
- support;
- emails/reminders;
- product analytics;
- outcome surveys;
- optional audio;
- practical-session notes;
- content issue reports;
- admin/audit logs.

For each, document purpose, legal basis, data fields, processors, location, retention, access, and deletion behaviour.

### 71.2 Retention

Create an approved retention matrix. Suggested product defaults, subject to legal/accounting review:

- learning data: while account/entitlement remains active plus a transparent dormancy period, then delete/anonymise;
- free diagnostic lead without account/consent: short retention;
- marketing consent history: retain evidence as needed to prove status;
- support tickets: limited operational period;
- raw audio: not retained by default; short explicit retention when opted in;
- orders/accounting: retain as legally required, isolated from deleted learning profile;
- security/audit logs: risk-based limited retention;
- aggregate analytics: de-identified where possible.

Do not state that account deletion erases legally retained financial records. Explain the separation.

### 71.3 Data export

Self-service export should include:

- profile and learner data;
- progress/objective state;
- attempts and results in a readable format;
- practical checklists;
- consent history;
- purchases/entitlements where appropriate;
- outcome reports.

Exclude protected answer keys, other users’ data, internal security logs, and copyrighted source files.

### 71.4 Account deletion

- confirm identity;
- explain retained finance/legal records;
- revoke sessions and learner links;
- delete/cascade learner study data;
- remove optional audio/media;
- cancel reminders/marketing;
- schedule backup expiry according to policy;
- issue confirmation;
- preserve only lawful minimal records.

### 71.5 Processors and transfers

Maintain processor agreements and configuration evidence for Supabase, Vercel, Stripe, Resend, PostHog/analytics, error monitoring, customer support, and any AI provider used in the offline pipeline. Keep production learner data out of AI drafting prompts unless separately approved and minimised.

### 71.6 DPIA and child-risk review

Before launch, assess whether a data-protection impact assessment is required. At minimum complete a documented child-rights/privacy risk assessment covering profiling, reminders, analytics, guardian visibility, audio, support, and deletion.

## 72. Cookies and analytics consent

### 72.1 Categories

```text
necessary
preferences
analytics
marketing
```

- Necessary cookies load without consent only when genuinely necessary.
- Analytics/marketing follow the approved consent standard.
- Rejecting optional cookies must not block paid learning.
- Consent choices are equally prominent and easy to change.
- Keep a cookie inventory with provider, purpose, lifetime, and category.

### 72.2 Server-side events

Server-side product events do not automatically escape privacy/ePrivacy requirements. Apply minimisation, purpose limitation, consent/legal-basis analysis, and retention regardless of transport.

## 73. Accessibility

Sweden’s accessibility law applies to specified consumer services including e-commerce from 2025. Confirm exact scope/exemptions with counsel, but build the entire service to a high accessibility standard regardless.

### 73.1 Target standard

- WCAG 2.2 AA as the internal product target;
- relevant EN 301 549 requirements reviewed;
- checkout and account flows included, not only public pages;
- an accessibility statement/help page and issue-report path;
- manual testing with disabled users or specialist testers before launch.

### 73.2 General requirements

- full keyboard access;
- logical focus order;
- visible focus;
- skip links and landmarks;
- correct headings and form labels;
- errors associated with fields and summarised;
- no colour-only meaning;
- 200% zoom/reflow;
- text spacing resilience;
- reduced-motion support;
- captions/transcripts;
- audio controls;
- no flashing content;
- target sizes at least 44 CSS px where practical;
- timeout warning/extension where permitted outside fixed exam simulation;
- plain Swedish for important actions.

### 73.3 Chart accessibility

A visual chart objective may inherently test visual-spatial interpretation, but the interface must still remove unnecessary barriers:

- keyboard tool operation;
- numeric coordinate/course/distance entry alternative;
- semantic feature list/search where it does not reveal the answer;
- screen-reader task instructions and state announcements;
- focusable user marks/lines with text labels;
- non-colour feedback patterns;
- high-contrast mode;
- precision controls and zoom;
- undo;
- no drag-only operation;
- text summary of submitted and correct geometry;
- documented limitations and accommodation path.

### 73.4 Cognitive accessibility

- consistent language and layouts;
- short steps;
- glossary tooltips without focus traps;
- optional reading mode;
- no forced animation;
- allow more practice time;
- distinguish learning timer from official simulation timer;
- avoid punitive latency scoring for users using assistive technology;
- do not require a diagnosis to use accommodations.

### 73.5 Audio/speaking accessibility

- transcript/caption for every audio clip;
- visual representation for sound sequences;
- typed sequence alternative for radio practice;
- no accent scoring;
- user controls playback speed and repetition;
- recording remains optional.

## 74. Copyright, licensing, and trademarks

### 74.1 Charts

Treat Sjöfartsverket chart information as protected. Written permission may be required not only for direct excerpts but also for a new map using chart information as a basis or model. The fictional chart must be demonstrably original.

Keep:

- design sketches/source files;
- creator agreements assigning sufficient commercial rights;
- feature-generation provenance;
- legal review note;
- asset checksum/version;
- “not for navigation” notice.

### 74.2 Official documents

A public official document being available online does not automatically grant unrestricted redistribution. Store internal copies for review only when permitted; link to canonical pages; quote minimally; generate original explanations.

### 74.3 Competitors

Do not copy:

- wording;
- lesson sequence;
- questions or explanations;
- illustrations/videos;
- UI screens;
- simulators;
- testimonials;
- pricing presentation/trade dress.

Document that competitor review was feature-level benchmarking only.

### 74.4 Trademarks and affiliation

- Do not use NFB or authority logos without permission.
- Use authority names factually and respectfully.
- Include no affiliation claim.
- Run Swedish/EU trademark and domain checks for the final brand.
- Avoid a brand name that could be confused with an official body or certificate issuer.

### 74.5 User uploads

Avoid uploads in v1 except narrow support/instructor evidence use cases. If enabled:

- accept only necessary formats;
- virus scan;
- private bucket;
- size limits;
- metadata stripping where appropriate;
- retention/deletion;
- user warranty/rights notice;
- no public sharing by default.

## 75. Security programme

### 75.1 Threat model

Protect against:

- account takeover and magic-link abuse;
- guardian/learner cross-access;
- entitlement bypass;
- answer-key scraping;
- client-side grade tampering;
- simulation timer tampering;
- Stripe webhook spoofing/replay;
- RLS misconfiguration;
- admin privilege escalation;
- malicious content imports/CSV injection;
- stored XSS in lessons/explanations;
- SVG/script injection;
- insecure file uploads;
- brute force of learner PINs;
- token leakage in logs/URLs;
- bot abuse of free diagnostics/email;
- dependency/supply-chain compromise;
- privacy leakage from analytics/error tools;
- denial of service/cost abuse.

### 75.2 Web controls

- strict Content Security Policy, tested in report-only then enforced;
- HSTS, frame protections, MIME sniffing protection, referrer policy, permissions policy;
- sanitise/validate rich content; prefer structured blocks over arbitrary HTML/MDX;
- strip scripts/event handlers from SVG and process commissioned assets at build time;
- origin/CSRF protections for mutations;
- rate limits by route, account, and privacy-preserving network signal;
- generic auth responses;
- secure random tokens;
- short-lived signed URLs;
- no secrets in `NEXT_PUBLIC_*` except genuinely publishable values;
- service role server-only;
- protect source maps and logs appropriately.

### 75.3 Database controls

- RLS on every exposed table;
- least-privilege database roles;
- revoke broad default grants;
- `security definer` functions with fixed search path and narrow grants;
- no user-controlled dynamic SQL;
- parameterised queries;
- migration review;
- encrypted backups and tested restore;
- production access logging;
- separate environments/projects.

### 75.4 Content pipeline controls

- formula/CSV injection prevention on export/import;
- Zod validation;
- source allowlist;
- checksum files;
- secrets via environment/CI vault;
- generated content cannot publish;
- dependency lock and licence scan;
- no production database dump used as prompt/input;
- reviewer identity and audit trail.

### 75.5 Stripe/financial controls

- signature verification;
- idempotency;
- amount/currency/product resolution server-side;
- no card details handled by app;
- refund permissions restricted;
- refund threshold and dual approval where appropriate;
- dispute alerts;
- reconciliation job between Stripe and orders/entitlements.

### 75.6 CI/CD controls

- protected main branch;
- required lint/type/unit/integration/e2e checks;
- dependency vulnerability scanning;
- secret scanning;
- migration dry run;
- preview environment with test data only;
- production deployment approval;
- reproducible builds where practical;
- rollback procedure;
- no unreviewed AI agent direct production deployment.

### 75.7 Security tests

At minimum:

- RLS cross-user suite;
- IDOR tests for all learner/order/download resources;
- webhook spoof/replay tests;
- client-tampered grade rejected;
- expired/signed URL tests;
- admin route/policy tests;
- SVG/content XSS fixtures;
- CSV injection fixtures;
- rate-limit behaviour;
- learner PIN lockout/rotation;
- logout/local-cache clearing;
- answer key absent from initial network payload.

### 75.8 Incident response

Maintain contacts, severity levels, decision log, processor notification path, user/authority notification assessment, credential rotation, evidence preservation, and post-incident review. Run one tabletop exercise before public launch.

---

# Part X — Go-to-market, SEO, analytics, and measurement

## 76. Competitive benchmark

The table below is a feature benchmark observed during research, not a content source. Recheck prices/features before making any public comparison.

| Provider/resource | Observed strengths | Strategic implication |
|---|---|---|
| Nautiska Skolan | Complete online course framing, videos, exercises/tests, physical materials in some offers, strong “until you pass” reassurance. | A credible paid product needs more than quizzes; clearly explain materials, access, and support. |
| Sjösportskolan | Large free “extramaterial” library: lights, day shapes, sound signals, knots, sample tests, chart symbols, lighthouse/VHF examples. | Free utilities are already expected and can build strong organic acquisition. Differentiate through integrated progress and procedural practice. |
| Navigationsskolan | Structured lesson count, sizeable question bank, multiple tests, extended access, material upsells, guarantee language. | Buyers compare visible scope, access period, and risk reversal. Publish transparent counts only when quality is real. |
| Båtutbildning and other schools | Text, illustration, animation/video, chapter tests, practice exams, email support, physical materials and practical upsells. | Human help and a bridge to offline material/practice are commercial trust levers. |
| Stockholmradio | Free SRC course/resources. | SRC cannot win through text alone; the radio lab, audio fluency, adaptive practice, and process clarity must justify payment. |
| Free practice sites | Free sample questions and exam-style practice. | Do not charge merely for access to generic MCQs. Charge for diagnosis, explanations, chart/radio interaction, quality assurance, and planning. |

### 76.1 Positioning statement

For Swedish leisure-boat learners who want to know that they can apply the material—not only recognise answers—Sjöklart is an independent, source-traceable preparation platform with interactive chart and scenario laboratories, adaptive study planning, and transparent readiness. Unlike passive online courses or isolated free quizzes, it connects every mistake to a specific skill and next action.

### 76.2 Proof hierarchy

Use proof in this order:

1. product demonstration;
2. transparent syllabus/source coverage;
3. qualified reviewer credentials;
4. anonymised learning outcomes with methodology;
5. verified customer reviews;
6. guarantees/terms.

Avoid invented learner counts, fabricated testimonials, unqualified “market leader” claims, or cherry-picked pass rates.

## 77. Landing page specification

### 77.1 Homepage structure

1. **Hero** — clear value and one product visual.
2. **Interactive demo** — a short chart/rules task without signup.
3. **How it works** — Learn, practise, simulate, book the real exam separately.
4. **Why this is different** — procedural interaction, adaptive feedback, source traceability.
5. **Certificate cards** — available, upcoming, prerequisites.
6. **Readiness explanation** — transparent, not a guarantee.
7. **Course contents** — exact modules and included features.
8. **Official-process notice** — separate exam/material fees.
9. **Expert/source trust** — reviewers and update policy.
10. **Pricing** — inclusive VAT, access period, no hidden renewal.
11. **FAQ** — official process, materials, age/guardian, access, refunds, practical components.
12. **Final CTA** — free diagnostic or purchase.

### 77.2 Förarintyg page hero copy

Suggested draft:

> **Förbered dig för Förarintyget genom att faktiskt öva.**  
> Lär dig reglerna, träna sjökortsarbete på ett interaktivt övningskort och få en personlig plan fram till provdagen.

CTA:

- Primary: `Gör gratis kunskapstest`
- Secondary: `Prova sjökortsövningen`

Support line:

> “Fristående utbildning. Prov och intyg hanteras separat genom den officiella processen.”

### 77.3 Feature presentation

Show learner outcomes, not implementation jargon.

Preferred:

- “Rita kurslinjer och se exakt hur många grader du avviker.”
- “Få nya övningsvarianter när du missförstår ett moment.”
- “Se vilka kunskapsområden som fortfarande hindrar din provberedskap.”
- “Ladda ned faktakort för Anki och Quizlet-import.”

Avoid leading with “FSRS”, “Elo”, “AI-generated”, or framework names.

## 78. SEO and public learning content

### 78.1 SEO principles

- Write genuinely useful pages reviewed against primary sources.
- Do not mass-produce near-duplicate AI pages.
- Include version/last-checked notes for changeable official information.
- Use original diagrams/media.
- Link from topic pages into a relevant free practice activity.
- Distinguish informational pages from product claims.
- Use canonical URLs and prevent app/index leakage.
- Remove or update stale pages rather than letting them rank with old requirements.

### 78.2 Cornerstone pages

Recommended initial pages:

```text
Förarintyg: krav, prov och hur du förbereder dig
Så fungerar sjökortsarbete inför Förarintyg
Väjningsregler till sjöss — steg för steg
Prickar och sjömärken — lär dig systemen
Fyrkaraktärer, sektorer och lanternor
Distans, fart och tid på sjön
Rättvisande, magnetisk och kompasskurs
Säkerhetsutrustning för fritidsbåt — utbildningsguide
Så går Båtpraktik dag till och hur du förbereder dig
SRC/VHF: intyg, simulator, prov och radiotillstånd
MAYDAY, PAN-PAN och SÉCURITÉ — skillnaden
Kustskepparintyg: krav, förkunskaper och studier
Seglarintyg 1, 2 och 3 — skillnader och förkunskaper
```

Every page should be rechecked against the current applicable source before publication.

### 78.3 Glossary strategy

Create only high-quality term pages with:

- plain definition;
- diagram/audio where useful;
- common confusion;
- one mini-check;
- related terms;
- source and last review;
- relevant course CTA.

Avoid thin one-sentence pages.

### 78.4 Free tools

High-value free tools:

- speed–time–distance calculator with worked explanation;
- course-conversion practice generator;
- mark/light identification trainer;
- sound-signal player;
- phonetic alphabet trainer;
- one fictional chart exercise;
- official-process checklist generator;
- study-time planner;
- glossary and formula sheet.

A calculator result must teach the operation and assumptions; it must not be positioned as a live navigation tool.

### 78.5 Structured data

Where accurate:

- `Course`/product information;
- `FAQPage` only for visible genuine FAQs;
- `BreadcrumbList`;
- `Article` for editorial pages;
- organisation identity.

Do not use review/rating schema without eligible genuine reviews and compliant markup.

## 79. Conversion funnel

### 79.1 Primary funnel

```text
Organic/referral/ad
  -> certificate or topic page
  -> free interactive task/diagnostic
  -> immediate result
  -> optional saved plan/account
  -> product comparison
  -> purchase
  -> diagnostic/onboarding
  -> first successful chart/scenario task
  -> first study session
  -> first valid simulation
  -> readiness
  -> official exam outcome
```

### 79.2 Activation definition

A paid learner is activated when, within seven days of entitlement:

- onboarding is complete;
- target pace/date is set;
- at least one study session is completed;
- at least one procedural task is attempted;
- at least one mistake receives/remediation action.

Do not define activation as login or purchase alone.

### 79.3 Email sequence

For adult/guardian contacts with appropriate permission:

- purchase/onboarding instructions;
- day 1 “start with diagnostic”;
- progress-triggered help, not a fixed spam sequence;
- stalled learner assistance after a reasonable period;
- first simulation preparation;
- exam-process checklist near declared date;
- outcome survey;
- no marketing after withdrawal from marketing consent.

### 79.4 Cart recovery

Use only after legal/privacy review and explicit context. Do not email a free diagnostic participant as an abandoned buyer unless they actually initiated checkout and the communication basis is approved.

## 80. Partnerships

### 80.1 Practical providers

Offer:

- learner-ready briefing sheet;
- provider referral directory;
- co-branded but clearly independent landing page;
- instructor feedback form;
- group licence later.

Do not let a provider mark official completion through our system unless an approved official integration and authority exists.

### 80.2 Physical materials

Potential models:

- affiliate link;
- voucher code;
- drop-shipped kit;
- bundled fulfilment by authorised seller.

The partner is responsible for licensed physical materials. Product copy names what is included/excluded and who fulfils it.

### 80.3 Schools/clubs

Post-v1 B2B:

- cohort dashboard;
- assignment of modules;
- instructor review of chart work;
- seat licences;
- no exposure of unrelated learner data;
- guardian flow for youth clubs;
- data-processing agreements.

## 81. Analytics event model

### 81.1 Event rules

Every event has:

```text
event_name
event_version
occurred_at
anonymous_or_user_id
learner_surrogate_id where approved
certification_id
syllabus_version_id
app_version
platform/device_class
session_id where relevant
consent_context
```

Do not send item stems, exact responses, emails, audio, or answer keys to product analytics.

### 81.2 Core events

```text
marketing_page_viewed
free_diagnostic_started
free_diagnostic_completed
free_chart_task_started
free_chart_task_completed
account_created
learner_created
guardian_consent_recorded
checkout_started
purchase_completed
entitlement_assigned
onboarding_completed
study_plan_created
study_session_started
study_session_completed
lesson_completed
attempt_submitted
hint_requested
misconception_detected
chart_task_completed
scenario_task_completed
objective_became_ready
readiness_band_changed
exam_simulation_started
exam_simulation_completed
deck_downloaded
practical_brief_generated
official_process_link_clicked
outcome_reported
guarantee_claim_submitted
content_issue_reported
account_export_requested
account_deletion_requested
```

### 81.3 Event properties

Use constrained enums/numbers. Example:

```json
{
  "event_name": "chart_task_completed",
  "event_version": 1,
  "certification_id": "forarintyg",
  "task_type": "measure_bearing",
  "correct": false,
  "score_band": "0.5_0.75",
  "hint_level": 0,
  "independent": true,
  "latency_band": "60_120s",
  "device_class": "mobile"
}
```

Do not emit exact coordinates or learner-drawn route in analytics.

## 82. Product metrics

### 82.1 North-star metric

**Qualified readiness rate:** percentage of paid learners who reach “God beredskap” with required procedural evidence within their access period.

This is more actionable than raw minutes, question count, or revenue alone.

### 82.2 Commercial metrics

- free diagnostic completion rate;
- diagnostic → account;
- account → checkout;
- checkout conversion;
- paid activation;
- revenue per visitor/learner;
- refund/chargeback rate;
- support cost per learner;
- partner conversion;
- price-test results.

### 82.3 Learning metrics

- objective coverage;
- time to first procedural success;
- chart independent success rate;
- misconception repair rate;
- review backlog;
- valid simulation completion;
- readiness progression;
- calibration error;
- course completion is secondary, not sufficient.

### 82.4 Content metrics

- item issue rate;
- reviewer turnaround;
- stale-source count;
- items with poor discrimination;
- overexposure;
- lesson drop-off and retry behaviour;
- chart task precision distribution;
- support questions by objective.

### 82.5 Outcome metrics

Track:

- self-reported pass/fail/not taken;
- response rate;
- first versus later attempt;
- readiness at exam date;
- days from purchase to exam;
- official process completion where reported.

Do not calculate a public pass rate from only respondents without explaining selection bias.

### 82.6 Public outcome-stat rule

Before showing a public outcome statistic:

- minimum 100 eligible first-attempt respondents;
- display `n` and survey response rate;
- calculate a confidence interval such as Wilson interval;
- label “självrapporterat”;
- define cohort/date range;
- exclude staff/test accounts;
- do not imply causation;
- legal/marketing review the copy.

Example:

> “Av 143 användare som svarade och uppgav sitt första provresultat under perioden … angav 87% att de klarade provet. Svarsfrekvens … Resultatet är självrapporterat.”

## 83. Experimentation

### 83.1 Permitted early experiments

- price and packaging;
- hero message;
- free diagnostic length;
- immediate result versus result plus optional plan;
- onboarding session length;
- chart demo placement;
- plan format;
- support offer.

### 83.2 Learning experiments

Require an instructional hypothesis and guardrails. Examples:

- worked example before first task versus concise example;
- blocked then interleaved versus earlier interleaving;
- confidence prompt frequency;
- remediation variant timing.

Do not experiment by withholding safety-critical content or making one cohort materially less prepared.

### 83.3 Minor safeguards

Do not run manipulative commercial A/B tests on minor learner screens. Price/upsell experiments occur on adult/guardian-facing pages.

## 84. Support model

### 84.1 Channels

- searchable help centre;
- in-app content issue reporting;
- email/ticket support;
- optional scheduled group Q&A for Plus tier;
- no unmoderated public forum in v1.

### 84.2 Service targets

Set realistic targets and publish only those the company can meet. Suggested internal goals:

- payment/access issue: same business day during launch period;
- suspected factual/safety error: immediate triage, hide if credible and severe;
- normal learning question: within two business days;
- privacy/data-rights request: statutory workflow and tracked deadline.

### 84.3 Support tooling

Support view shows:

- account/entitlement status;
- learner progress summary;
- recent error codes;
- consent-safe communication history;
- no raw answer keys unless staff role requires;
- no guardian access to another adult learner without permission;
- audit trail for access.

---

# Part XI — Quality assurance, delivery plan, and launch operations

## 85. Testing strategy

### 85.1 Test pyramid

1. **Pure unit/property tests** for domain logic and geometry.
2. **Database integration tests** for migrations, RLS, transactions, and functions.
3. **Component interaction tests** for reducers, forms, and accessible states.
4. **End-to-end tests** for critical user/business journeys.
5. **Manual domain/content review** for educational correctness.
6. **Manual accessibility/usability testing** for interactions automation cannot judge.
7. **Performance/security testing** before launch and after material changes.

A passing unit suite does not make content correct. A domain reviewer does not replace RLS or payment tests.

## 86. Unit and property tests

### 86.1 Domain logic

Cover:

- FSRS rating mapping;
- due-date planning around exam date;
- session priority calculation and diversity;
- mastery/stage transitions;
- readiness component weighting/caps;
- confidence calibration;
- leech detection;
- simulation pass calculation;
- guarantee eligibility;
- entitlement active/expired/refunded states;
- VAT/money rounding;
- official-fact validity selection;
- source-staleness rules.

### 86.2 Chart mathematics

Use example and property tests:

- normalisation always returns `[0,360)`;
- angular distance is symmetric and ≤180;
- course followed by point generation reconstructs the expected endpoint within epsilon;
- distance is symmetric and non-negative;
- conversions round-trip within tolerance;
- deviation interpolation is continuous at wrap;
- route length equals sum of segments;
- valid generated tasks have solvable answers;
- invalid input returns typed errors rather than NaN/Infinity.

### 86.3 Grading

Each item kind has fixtures for:

- exact correct;
- just inside tolerance;
- exactly on boundary;
- just outside tolerance;
- missing/extra selections;
- unit mismatch;
- malformed response;
- angular wrap;
- multi-step partial evidence;
- hint/reveal effect on independence;
- version mismatch.

### 86.4 Simulation assembly

Test:

- all quotas satisfied;
- no duplicates;
- no overuse of template variants;
- recent exposure exclusion;
- safety/chart minima;
- deterministic seed;
- insufficient bank produces explicit failure;
- answer-position distribution;
- retired/stale items excluded;
- objective weights behave statistically across many seeded runs.

## 87. Database and RLS tests

Run against a disposable Supabase/Postgres environment in CI.

### 87.1 Migration checks

- clean database can migrate from zero;
- seed loads;
- migrations are ordered and reversible where feasible;
- generated types update;
- no table accidentally lacks RLS;
- no exposed view bypasses RLS;
- no service key appears in build output;
- destructive migrations require backup/ADR.

### 87.2 Transaction tests

- duplicate Stripe event grants one entitlement;
- simultaneous seat assignment cannot exceed seats;
- duplicate attempt idempotency key creates one attempt/state update;
- two-tab SRS update resolves deterministically;
- simulation submits once;
- content publish switches current version atomically;
- refund revokes/adjusts entitlement according to policy.

### 87.3 RLS matrix

Maintain a table-driven matrix of role × resource × action:

```text
anonymous
adult_self
active_guardian
revoked_guardian
learner_mode
expired_customer
reviewer
admin
service_webhook
cron_service
```

Every new user-data table must add cases before merge.

## 88. Component and interaction tests

### 88.1 Learning UI

- keyboard answer/select/submit;
- correct focus after feedback;
- hint levels;
- confidence prompt;
- screen-reader live announcement;
- retry with new variant;
- no double submission;
- loss/recovery of connection;
- learner switch clears prior local state.

### 88.2 Chart UI

- reducer state transitions;
- mouse, touch, keyboard input;
- pointer transform under zoom/pan;
- precision loupe;
- undo/redo;
- task reset;
- viewport resize/orientation;
- numeric alternative;
- feedback overlay;
- no accidental page scroll during gesture;
- reduced motion/high contrast.

### 88.3 Radio/scenario UI

- control state;
- PTT sequence;
- scripted incoming event timing;
- transcript alternative;
- no microphone permission until explicit action;
- recording deletion;
- interrupted audio;
- wrong-order feedback.

## 89. End-to-end critical paths

### 89.1 Public and purchase

1. Visit Förar page.
2. Complete free diagnostic without email.
3. Save plan/create account.
4. Start Checkout in Stripe test mode.
5. Complete card payment and an asynchronous-method fixture where supported.
6. Webhook grants access.
7. Assign learner seat.
8. Begin onboarding.

### 89.2 Guardian/minor

1. Adult account creates under-13 learner.
2. Required guardian policy evidence recorded.
3. Learner access token/PIN created.
4. Learner enters study mode and cannot reach billing.
5. Guardian views progress.
6. Token revoked; access stops.
7. Deletion removes learner study data according to policy.

### 89.3 Learning

1. Complete diagnostic.
2. Plan generated.
3. Fail an item confidently.
4. Misconception appears in error notebook.
5. Complete remediation variant.
6. Review reappears later.
7. Objective stage/readiness updates.

### 89.4 Chart

1. Open chart on 375 px viewport.
2. Pan/zoom.
3. Complete distance and bearing task.
4. Fail outside tolerance.
5. Feedback overlay shows actual/expected/delta/tolerance.
6. Retry new variant.
7. Server-stored result matches client display.

### 89.5 Simulation

1. Start configured simulation.
2. Answer, flag, navigate, refresh.
3. Server timer persists.
4. No answer feedback leaks.
5. Auto-submit fixture at expiry.
6. Result uses overall configured rule.
7. Diagnostic sections do not alter pass calculation.
8. Remediation plan generated.

### 89.6 Deck download

1. Active entitled learner requests deck.
2. Signed URL issued.
3. Download logged.
4. Expired URL fails.
5. Expired entitlement cannot request a new paid export.

### 89.7 Admin publish

1. Writer creates draft.
2. Automated checks run.
3. Writer cannot self-complete required independent review.
4. Domain/editorial approvals recorded.
5. Publisher publishes.
6. live content appears; draft answer key stays protected.
7. rollback restores previous version.

## 90. Accessibility QA

### 90.1 Automated

Run axe on:

- homepage/product/pricing;
- signup/login;
- checkout handoff page;
- dashboard;
- lesson;
- question feedback;
- chart task panel;
- simulation navigation/results;
- guardian pages;
- admin representative screens.

Treat serious/critical violations as build blockers.

### 90.2 Manual

Test with:

- keyboard only;
- VoiceOver/Safari;
- NVDA/Firefox or approved Windows combination;
- 200% and 400% zoom where applicable;
- mobile screen reader;
- reduced motion;
- high contrast/forced colours;
- colour-vision simulation plus real contrast checks;
- voice/audio disabled;
- slow network;
- cognitive walkthrough in plain Swedish.

### 90.3 User testing

Before launch, recruit at least:

- two beginners;
- two experienced boaters;
- two users who rely on keyboard/screen reader or other assistive technology;
- one guardian/minor pair where ethically and legally arranged;
- one qualified navigation instructor;
- one SRC-capable reviewer for the SRC phase.

Use consented research sessions and avoid collecting unnecessary sensitive data.

## 91. Content QA

### 91.1 Pre-launch domain runs

- Reviewer completes every lesson.
- Reviewer answers every item and variant family.
- Reviewer runs at least five full seeded simulations.
- Reviewer completes every chart scenario on desktop and mobile.
- A second reviewer samples every objective and all safety-critical content.
- Language editor checks all public/checkout/legal-adjacent copy.

### 91.2 Golden set

Maintain a small immutable “golden set” per certification:

- representative items;
- chart tasks with hand-verified answers;
- radio sequences;
- pass-rule fixtures;
- official fact fixtures.

Run against every grading/algorithm change.

### 91.3 Production monitoring

Create automatic alerts for:

- sudden answer-rate shifts after publish;
- >configured rate of “answer may be wrong” reports;
- impossible chart deltas;
- one distractor never selected;
- mobile-only failure spikes;
- an objective with anomalously low success after a lesson;
- source becoming stale.

## 92. Performance and reliability QA

- Lighthouse CI on marketing templates.
- Web Vitals monitoring segmented by page/device.
- chart interaction benchmark with representative SVG size.
- load test free diagnostic and grading endpoint.
- webhook retry/load fixture.
- database query plan checks for due-card/session queries.
- synthetic purchase-to-entitlement monitor in test/sandbox.
- daily health check for official link availability, without excessive crawling.
- backup restore exercise before launch and at least annually.

## 93. Milestone plan

No milestone begins until the previous milestone’s Definition of Done is met, except for the explicitly parallel content track. Each milestone can contain several small PRs; do not make a single unreviewable giant change.

### M-1 — Product truth, legal framing, and source setup

**Deliverables**

- approved certificate/release scope;
- source register with current NFB documents;
- corrected official fact configuration;
- copyright decision for fictional charts;
- guardian/minor product decision;
- legal-review issue list;
- final v1 price-test range;
- domain reviewer identified.

**Definition of Done**

- no hard-coded unsupported 50-question/section rule remains in tickets/spec;
- official facts have URLs, versions, and verification dates;
- reviewer signs the initial Förar taxonomy approach;
- written decision confirms original fictional chart only;
- legal counsel/accountant engagements are scheduled or risks explicitly accepted by founder.

### M0 — Repository and infrastructure scaffold

**Deliverables**

- Next.js 16.x stable scaffold;
- strict TypeScript, lint, formatting, environment validation;
- Supabase local setup and initial migrations;
- auth/profile/learner/guardian skeleton;
- RLS test harness;
- design-system primitives;
- CI pipeline;
- observability skeleton.

**Definition of Done**

- `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and database reset pass;
- user A cannot read user B learner in an automated test;
- no service secret in client bundle;
- mobile/desktop shell renders accessibly;
- one ADR documents stack/version choices.

### M1 — Source, syllabus, content, and admin foundation

**Deliverables**

- source documents, syllabus versions, objective graph;
- item/lesson version model;
- review/audit workflow;
- content import pipeline skeleton;
- admin source/objective/item/lesson CRUD;
- 10 reviewed sample objectives, 5 lessons, 40 items.

**Definition of Done**

- content cannot become live without required approvals;
- source and locator required;
- historical live version remains immutable;
- non-admin/reviewer blocked by server and RLS;
- CSV round-trip handles Swedish text and blocks formula injection;
- source change can mark affected objectives `review_required`.

### M2 — Core learning engine

**Deliverables**

- study sessions;
- lesson renderer;
- MCQ/multi-select/numeric/ordering/matching;
- attempt persistence and server grading;
- FSRS wrapper;
- skill/objective state;
- error notebook;
- first readiness model;
- diagnostic/onboarding plan.

**Definition of Done**

- unit tests cover rating mapping, due planning, stages, readiness caps;
- answer key absent from initial paid challenge payload;
- guided versus independent evidence handled correctly;
- mobile study loop works with keyboard and screen reader baseline;
- idempotent attempt submission tested;
- error notebook closes only after required later evidence.

### M3 — Chart laboratory foundation

**Deliverables**

- original tutorial and main chart generator/assets;
- manifest schema;
- pan/zoom and tool reducer;
- distance, bearing, coordinate read/plot, and course plot tasks;
- server/client grading package;
- feedback overlays;
- accessibility alternatives;
- printable fictional worksheet.

**Definition of Done**

- chart copyright/domain review recorded for placeholder/original asset;
- watermark always present;
- geometry/property tests pass including wrap/interpolation;
- tasks playable at 375 px and keyboard-only;
- panning/zooming meets performance budget;
- no answer embedded in initial challenge payload;
- correct line/point and tolerance displayed after submission.

### M4 — Förar learning breadth and specialised trainers

**Deliverables**

- rules encounter trainer;
- lights/day-shapes/sound trainer;
- knot/weather/basic electronic-chart learning components;
- expanded chart task families;
- progress/readiness dashboard;
- error-remediation sessions;
- deck export pipeline.

**Definition of Done**

- all v1 objective types have a working learning interaction;
- original media licence recorded;
- Anki and Quizlet-compatible exports build deterministically;
- accessibility alternatives exist for audio/drag interactions;
- at least 55 objectives and paid-beta content minimums pass review gates.

### M5 — Training simulations

**Deliverables**

- blueprint model/admin;
- deterministic stratified assembly;
- server-authoritative timer;
- response save/flag/navigation;
- scoring/results/remediation;
- readiness integration.

**Definition of Done**

- current verified overall threshold/time configuration represented correctly;
- UI disclaimer prevents unsupported exact-format claim;
- recent exposure and template limits tested;
- timeout/refresh/multiple-tab behaviour tested;
- diagnostic sections do not affect official-style overall rule;
- five reviewer runs reveal no critical assembly/content defect.

### M6 — Commerce, guardian flow, and entitlements

**Deliverables**

- products/prices/orders;
- Stripe Checkout;
- webhooks/idempotency;
- entitlement seats;
- guardian/minor learner mode;
- terms/consent evidence;
- receipts/support flows;
- study guarantee claim skeleton.

**Definition of Done**

- Stripe test purchase → webhook → access works;
- browser success redirect alone grants nothing;
- asynchronous/failure/refund fixtures pass;
- guardian and learner permission matrix passes;
- withdrawal/legal copy approved before production use;
- exact VAT/price facts appear on order and receipt;
- no automatic financial guarantee payout.

### M7 — Marketing, free funnel, SEO, and communications

**Deliverables**

- product/pricing pages;
- free diagnostic and chart demo;
- immediate result plus optional save;
- help/legal/accessibility pages;
- SEO cornerstone pages;
- email onboarding/reminders;
- consent-aware analytics;
- sitemap/robots/metadata.

**Definition of Done**

- free test works without email hostage;
- optional marketing consent is separate;
- app/draft/admin routes `noindex`;
- marketing Lighthouse ≥ 90 target on representative pages;
- analytics contains no item answer/raw PII;
- core pages have reviewed source dates and disclaimers;
- checkout/accessibility journey manually reviewed.

### M8 — Private paid beta

**Deliverables**

- 30–75 paid/comped beta learners;
- support and content issue process;
- performance/learning dashboards;
- two content update cycles;
- price and onboarding validation;
- reviewer and accessibility sessions.

**Definition of Done**

- no unresolved critical content/security/privacy issue;
- payment/access incident rate acceptable;
- at least 70% paid activation target or a documented remediation plan;
- chart task mobile completion is viable;
- top 20 content issues resolved;
- readiness model explanations understood in user tests;
- launch decision review completed.

### M9 — Public Förar launch

**Deliverables**

- public content target met;
- final terms/privacy/accessibility statement;
- incident/runbook readiness;
- partner materials link where available;
- support staffing and monitoring;
- launch measurement plan.

**Definition of Done**

- all v1 content gates pass;
- restore and incident tabletop complete;
- legal/copyright/accounting sign-offs recorded;
- official facts rechecked within 14 days of launch;
- production purchase and entitlement smoke test passes;
- no blocker in accessibility/security/content checklist.

### M10 — Båtpraktik preparation

**Deliverables**

- 15-area official mapping;
- pre-brief/checklist/log/debrief;
- original manoeuvre/knots/electronic-chart preparation;
- provider directory pilot;
- explicit non-certification boundary.

**Definition of Done**

- qualified practical reviewer approves;
- no self-completion resembles official sign-off;
- provider referrals disclosed;
- learner/instructor handoff is usable on mobile/print;
- data collection remains minimal.

### M11 — SRC preparation

**Deliverables**

- current SRC taxonomy;
- generic radio lab;
- audio/sequence scenarios;
- marine English/phonetic trainer;
- official NFB simulator handoff;
- PTS permit checklist;
- SRC simulations/decks.

**Definition of Done**

- SRC-qualified reviewer approves all safety-critical scenarios;
- original radio UI is not a clone;
- audio privacy/accessibility tests pass;
- NFB simulator step is unavoidable and clear;
- official facts rechecked;
- no claim that our lab fulfils official simulator completion.

### M12 — Kustskepparintyg

**Deliverables**

- advanced syllabus and prerequisite bridge;
- advanced chart world/task families;
- passage-planning cases;
- night/restricted-visibility/electronics/publications modules;
- Kust simulations/decks;
- physical material/practical handoff.

**Definition of Done**

- qualified Kust/navigation reviewer approves;
- at least four integrated passage cases reviewed;
- no protected chart material without licence;
- prerequisite and practical requirements clearly handled;
- advanced geometry and long-session save/resume tested.

### M13 — Seglarintyg 1, then 2/3

**Deliverables**

- separate curricula/products;
- practical-readiness checklists;
- original manoeuvre/trim visualisations;
- provider/instructor handoff;
- prerequisite enforcement for levels 2/3.

**Definition of Done**

- sailing instructor reviewer approves each level separately;
- practical and theoretical evidence are visually distinct;
- no digital quiz marks official practical competence;
- prerequisites are current and date-stamped.

## 94. Parallel content track

Engineering and content proceed in parallel after M1.

### Content C0 — Sources and taxonomy

- collect current primary sources;
- map objectives;
- review criticality/prerequisites;
- build glossary.

### Content C1 — Worked examples and lesson prototypes

- create one excellent lesson for each interaction family;
- user test before mass production;
- establish style guide.

### Content C2 — Förar bank production

- generate/draft in batches of 25–50;
- automated checks;
- domain review;
- editorial review;
- publish only approved batches.

### Content C3 — Media and chart scenarios

- commission original illustrations/audio/video;
- record licences;
- domain review;
- accessibility alternatives.

### Content C4 — Calibration and revision

- analyse beta telemetry;
- rewrite poor items;
- add variants where exposure/gaps demand;
- do not tune solely to maximise scores.

## 95. Launch acceptance checklist

### Product

- [ ] Product boundaries and disclaimers visible.
- [ ] Official next steps accurate and date-stamped.
- [ ] Free experience demonstrates differentiator.
- [ ] Paid onboarding reaches first value quickly.
- [ ] Readiness is transparent and not a pass guarantee.

### Content

- [ ] Active current syllabus mapped.
- [ ] All objectives meet coverage gate.
- [ ] All live content has source and review.
- [ ] Safety-critical content has enhanced review.
- [ ] Original media licences recorded.
- [ ] No competitor/real-chart material ingested.

### Engineering

- [ ] CI green.
- [ ] RLS matrix green.
- [ ] Stripe idempotency and reconciliation green.
- [ ] chart performance and grading green.
- [ ] simulation timer/score green.
- [ ] backup restore tested.
- [ ] monitoring/alerts live.

### Legal/privacy

- [ ] Terms/privacy/cookies approved.
- [ ] Withdrawal flow approved.
- [ ] VAT/invoice handling approved.
- [ ] Guardian/minor flow approved.
- [ ] Accessibility scope assessed.
- [ ] Processor agreements/configuration reviewed.
- [ ] Data export/deletion works.

### Accessibility

- [ ] Keyboard and screen-reader critical paths pass.
- [ ] 200% zoom/reflow pass.
- [ ] chart numeric/keyboard alternative pass.
- [ ] audio captions/transcripts pass.
- [ ] checkout and errors pass.
- [ ] issue-report path visible.

### Operations

- [ ] Support mailbox/ticket ownership assigned.
- [ ] Payment/no-access runbook tested.
- [ ] Content correction runbook tested.
- [ ] Incident tabletop complete.
- [ ] Official facts checked within 14 days.
- [ ] Reviewer availability for urgent issues confirmed.

---

# Part XII — Risks, extensions, and product roadmap

## 96. Principal risks and mitigations

| Risk | Consequence | Mitigation |
|---|---|---|
| Incorrect official exam assumptions | Misleading product and poor preparation. | Data-driven official facts; primary-source verification; conservative simulation labels. |
| Low-quality AI-generated content | Factual/safety errors and damaged trust. | Human review, source citations, batch publishing, telemetry, immutable versions. |
| Chart copyright infringement | Legal cost, takedown, launch delay. | Fully original fictional chart; provenance; written licences only for real data. |
| Underpricing | Cannot fund experts/support; weak quality perception. | Price tests around market anchors; differentiated Plus tier; margin model. |
| Overbuilding all certificates | Delayed launch and thin content. | Förar-first sequence; shared platform; hard content gates. |
| “Question bank” commoditisation | Free competitors undermine willingness to pay. | Procedural labs, misconception repair, planning, expert provenance, partnerships. |
| Guarantee abuse | Refund losses and disputes. | Study guarantee, manual review, clear evidence/terms, no automatic self-report refund. |
| Minor-data mishandling | Privacy/legal/reputational harm. | Adult purchaser, learner profile, minimisation, no child targeting, guardian controls. |
| Readiness score overclaim | Learners interpret it as guaranteed pass probability. | Explain components/caps; label estimate; calibrate later; no probability claim. |
| Item memorisation | Inflated scores without competence. | Variants, template exposure limits, transfer tasks, procedural evidence. |
| Weak mobile chart UX | Main differentiator fails for many users. | Build early, mobile acceptance tests, precision controls, landscape suggestion, alternatives. |
| RLS/entitlement defect | Data leak or unpaid access. | RLS matrix, service-role isolation, integration tests, reconciliation. |
| Source requirements change | Stale or wrong teaching. | Source hashes, monthly checks, review-required workflow, date-stamped public facts. |
| Practical-certification confusion | Misleading sales and dissatisfied users. | Explicit prep boundary, provider handoff, no digital sign-off. |
| Free SRC alternatives | Low paid conversion. | Audio/radio scenario quality, adaptive feedback, process clarity, bundle pricing. |
| Too much gamification | Serious learners distrust product. | Calm design, readiness and competence focus, optional light motivation only. |
| Content production bottleneck | Engineering ready but product unsellable. | Parallel content track, reviewer capacity plan, smaller quality-first beta. |

## 97. Product extensions

Prioritise only after Förar v1 has healthy activation, chart usage, and support economics.

### 97.1 High-value near-term extensions

#### A. Instructor review add-on

Learner submits a structured chart solution or passage-plan worksheet. A qualified reviewer gives asynchronous feedback within a published SLA.

Requirements:

- original/licensed exercise only;
- reviewer credentials;
- workload/capacity controls;
- privacy and retention;
- no claim of official examiner decision.

#### B. Live group clinic

Weekly chart/rules/SRC Q&A. Record only with consent and do not use learner questions containing personal data in marketing without permission.

#### C. Physical materials bundle

Partner fulfilment for authorised chart/tools. Strong commercial fit because exam preparation crosses from digital to paper/tools.

#### D. Family profiles

Multiple learner seats, guardian dashboard, sibling discount, independent progress, privacy boundaries.

#### E. Practical-provider marketplace

Search by location/date/certificate, transparent qualifications and commercial relationships. Start as curated directory before building transactions.

### 97.2 Learning extensions

#### A. Grounded AI tutor

Only after content corpus and review system are mature.

Tutor rules:

- retrieval only from approved live sources/lessons;
- cite every substantive answer;
- refuse unsupported current/legal/safety claims;
- never impersonate NFB/examiner;
- no production learner data used to train external models by default;
- conversation retention controls;
- child-safe mode;
- escalate “is this answer wrong?” to content support;
- no live navigation advice.

Use deterministic tools for calculations and grading; the language model explains results but does not invent them.

#### B. Voice coach for SRC

- local or approved speech recognition;
- score required sequence/keywords, not accent;
- privacy controls;
- text alternative;
- reviewer-validated feedback.

#### C. Adaptive worked examples

Choose example granularity based on prior errors, gradually fade steps, and ask learners to self-explain.

#### D. Personal printable workbook

Generate from original assets:

- weakest objectives;
- blank chart tasks;
- formula sheet;
- error notebook;
- answer section separately.

Ensure generated document workflow and accessibility.

### 97.3 B2B extensions

- sailing clubs and adult education providers;
- instructor cohort analytics;
- assignments and deadlines;
- branded landing pages with independence disclosure;
- seat invoicing;
- content licensing;
- school-specific live sessions;
- enterprise SSO later.

Do not offer white-label until content attribution, responsibility, and support boundaries are contractually clear.

### 97.4 Geographic/language expansion

Potential later:

- English explanations for Swedish exam learners;
- Norwegian/Danish markets only after separate authorities, curricula, terminology, chart rights, and legal review;
- international certificate preparation where source and market justify it.

Do not translate Swedish rules blindly into another jurisdiction.

### 97.5 Mobile apps

A PWA is sufficient for v1. Consider native wrappers/apps only when data shows demand for:

- reliable offline packs;
- microphone/audio workflows;
- push reminders;
- richer touch/pen chart input.

Native release adds store billing/policy/privacy/accessibility obligations and should have a separate specification.

### 97.6 Current-information education feed

A “Vad har ändrats?” feed may explain source updates, chart-correction concepts, or regulatory changes. It must not become a substitute for current official notices/charts or provide live voyage advice.

## 98. Explicitly out of scope

Unless a later signed specification changes this:

- issuing any NFB certificate;
- official examiner functionality;
- live real-world navigation or routing;
- real Sjöfartsverket chart data without licence;
- boat tracking/AIS live feed;
- weather-based go/no-go advice for a real voyage;
- emergency dispatch;
- professional maritime certificates;
- leaked official questions;
- automatic AI publication;
- open community/forum;
- direct BankID integration;
- Swish direct integration;
- native iOS/Android v1;
- automatic pass-guarantee refund;
- unreviewed user-generated public content;
- storing personal identity numbers;
- mandatory voice recording.

## 99. Founder decisions required

Record each as an ADR/product decision before the relevant milestone:

1. Final brand and trademark/domain clearance.
2. Exact v1 price and whether Plus includes physical material or live support.
3. Refund versus study-guarantee terms.
4. Domain reviewer(s), qualifications, compensation, and availability.
5. Whether paid beta is invitation-only and target size.
6. Physical material partner/licence path.
7. Guardian account age and purchase policy.
8. Analytics vendor and minor-mode configuration.
9. Error-monitoring vendor/data region.
10. Whether optional audio recording launches with SRC or later.
11. Public outcome-stat minimum methodology.
12. Båtpraktik provider directory commercial model.
13. Which Seglarintyg level launches first; recommendation is level 1.

## 100. First 30 implementation tickets

These are intentionally ordered and small enough for review.

1. Scaffold Next.js stable 16.x app with `pnpm`, strict TS, lint/typecheck/test scripts.
2. Add environment schema and `.env.example`.
3. Configure Supabase local development and generated types.
4. Create profiles/learners/guardian tables and RLS helpers.
5. Add RLS matrix test harness with two users and one learner each.
6. Create certifications, sources, syllabi, official facts, objectives migrations.
7. Seed certification catalogue and placeholder official facts with verification metadata.
8. Create lesson/item template/version schema.
9. Create review/audit schema and admin role guard.
10. Build source register admin list/detail/edit.
11. Build objective tree/graph admin view.
12. Build item schema validators and one single-choice editor.
13. Build lesson block schema and renderer.
14. Add attempt/session/SRS/skill/readiness schema.
15. Implement server-authoritative challenge/submit flow for single-choice.
16. Implement FSRS wrapper and tests.
17. Implement skill stage/readiness v1 and tests.
18. Build learner dashboard and a minimal session planner.
19. Build error notebook from misconception evidence.
20. Define chart manifest Zod schema and original placeholder generator.
21. Implement chart coordinate transforms and geometry/property tests.
22. Implement chart viewport reducer with pan/zoom and keyboard support.
23. Implement distance task end to end.
24. Implement bearing and course-plot tasks end to end.
25. Add chart feedback overlays and mobile bottom sheet.
26. Create exam blueprint/session schema and deterministic builder tests.
27. Build simulation runner with server timer and autosave.
28. Add products/orders/entitlements schema and Stripe test checkout/webhook.
29. Build public free diagnostic with immediate result.
30. Build content import/review pipeline and load first reviewed Förar batch.

Do not create hundreds of content rows before the first complete learning loop and chart task have been user tested.

---

# Part XIII — Configuration, sources, and Claude instructions

## 101. Environment variables

```dotenv
# App
APP_URL=
APP_ENV=development
APP_TIMEZONE=Europe/Stockholm
NEXT_PUBLIC_APP_NAME=

# Supabase — publishable values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Supabase — server only
SUPABASE_SECRET_KEY=
SUPABASE_DB_URL=

# Stripe — server only unless explicitly publishable
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_EMAIL=

# Analytics — optional/consent-aware
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
POSTHOG_SERVER_KEY=

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=
OTEL_EXPORTER_OTLP_HEADERS=
ERROR_MONITOR_DSN=

# Cron/security
CRON_SECRET=
LEARNER_TOKEN_PEPPER=
SIGNED_LINK_SECRET=

# Content pipeline only — never production client/runtime
ANTHROPIC_API_KEY=
CONTENT_MODEL_NAME=
PIPELINE_SOURCE_DIR=
```

Names should match current provider conventions. Validate all values at startup/build. Do not create `NEXT_PUBLIC_` aliases for secret values.

## 102. Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:integration
pnpm test:e2e
pnpm test:a11y
pnpm test:rls
pnpm content:validate
pnpm content:export-review
pnpm content:import-review
pnpm decks:build
pnpm chart:generate
pnpm db:reset
pnpm db:types
```

Every command must be documented in `README.md` and work from a clean clone with documented prerequisites.

## 103. Primary research/source register

These URLs were reviewed for this version. Recheck before launch. Store canonical source records in the database/research folder with dates and checksums where permitted.

### 103.1 NFB official process and certificates

- Digital exams and current general timing/pass information:  
  `https://batlivsutbildning.se/digitala-prov/`
- Förarintyg product/process page:  
  `https://batlivsutbildning.se/product/forarintyg/`
- Kustskepparintyg product/process page:  
  `https://batlivsutbildning.se/product/kustskepparintyg/`
- SRC product/process page:  
  `https://batlivsutbildning.se/product/src-intyg/`
- Seglarintyg 1:  
  `https://batlivsutbildning.se/product/seglarintyg-1/`
- Seglarintyg 2:  
  `https://batlivsutbildning.se/product/seglarintyg-2/`
- Seglarintyg 3:  
  `https://batlivsutbildning.se/product/seglarintyg-3/`

### 103.2 NFB current knowledge-requirement documents reviewed

- Förarintyg, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/03/Kunskapsfordringar-gallande-Forarintyg-for-fritidsbat-redigerad-2025-02-01.pdf`
- Kustskepparintyg, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/08/Kunskapsfordringar-gallande-Kustskepparintyg-redigerad-2025-02-01.pdf`
- SRC, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/02/Kunskapsfordringar-gallande-SRC-intyg-redigerad-2025-02-01.pdf`
- Båtpraktik dag, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/02/Kunskapsfordringar-gallande-Batpraktik-Dag-redigerad-2025-02-01.pdf`
- Seglarintyg 1, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/02/Kunskapsfordringar-gallande-Seglarintyg-1-redigerad-2025-02-01.pdf`
- Seglarintyg 2, edited 2025-02-01:  
  `https://batlivsutbildning.se/wp-content/uploads/2025/02/Kunskapsfordringar-gallande-Seglarintyg-2-redigerad-2025-02-01.pdf`
- Seglarintyg 3 document currently linked/reviewed (older edited date; verify current status before build):  
  `https://batlivsutbildning.se/wp-content/uploads/2025/04/Kunskapsfordringar-gallande-Seglarintyg-3-redigerad-2020-09-14-1.pdf`

### 103.3 Other Swedish authorities

- Sjöfartsverket chart-information publishing/use rights:  
  `https://www.sjofartsverket.se/sv/tjanster/sjokortsprodukter/digital-data/nyttjanderatter/`
- PTS marine VHF permit:  
  `https://pts.se/tillstand-och-anmalan/radio/batradio-vhf/`
- PTS distress communication, DSC and MMSI:  
  `https://pts.se/tillstand-och-anmalan/radio/batradio-vhf/nodkommunikation-till-sjoss/`
- IMY children’s personal data:  
  `https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/introduktion-till-gdpr/personuppgifter/personuppgifter-om-barn/`
- Konsumentverket digital services/content:  
  `https://www.konsumentverket.se/varor-och-tjanster/digitala-tjanster-och-digitalt-innehall/`
- Konsumentverket withdrawal rights overview:  
  `https://www.konsumentverket.se/konsumentratt-process/angerratt/`
- PTS accessibility law:  
  `https://pts.se/digital-inkludering/lagen-om-vissa-produkters-och-tjansters-tillganglighet/`
- PTS accessibility-law questions:  
  `https://pts.se/digital-inkludering/lagen-om-vissa-produkters-och-tjansters-tillganglighet/vanliga-fragor-och-svar-om-tillganglighetslagen/`
- Skatteverket VAT rates and exemptions:  
  `https://www.skatteverket.se/foretag/moms/saljavarorochtjanster/momssatserochundantagfranmoms.4.58d555751259e4d66168000409.html`

### 103.4 Competitor and free-resource benchmark only

Do not ingest as course content.

- User-provided Nautiska Skolan guide:  
  `https://nautiskaskolan.se/forarbevis-bat/`
- Nautiska Skolan course page:  
  `https://nautiskaskolan.se/forarintyg-bat/`
- User-provided Sjösportskolan extra material:  
  `https://www.sjosportskolan.se/fritid/extramaterial/`
- Sjösportskolan Kust online:  
  `https://www.sjosportskolan.se/fritid/kustskepparintyg-online/`
- Navigationsskolan Förarintyg:  
  `https://navigationsskolan.se/forarintyg/`
- Navigationsskolan SRC/VHF:  
  `https://navigationsskolan.se/vhf-certifikat/`
- Stockholmradio SRC:  
  `https://stockholmradio.se/src-kurs/`
- Sjökapten free practice:  
  `https://sjokapten.com/`

### 103.5 Learning-design references

- Roediger & Karpicke, retrieval/testing effect:  
  `https://learninglab.psych.purdue.edu/downloads/2006/2006_Roediger_Karpicke_PsychSci.pdf`
- Cepeda et al., distributed practice meta-analysis:  
  `https://augmentingcognition.com/assets/Cepeda2006.pdf`
- Rohrer et al., interleaved practice RCT:  
  `https://gwern.net/doc/psychology/spaced-repetition/2019-rohrer.pdf`
- van Gog, Paas & Sweller, worked examples/cognitive load review:  
  `https://link.springer.com/article/10.1007/s10648-010-9145-4`

### 103.6 Technical primary references

- Next.js current App Router documentation:  
  `https://nextjs.org/docs/app`
- Next.js 16 release:  
  `https://nextjs.org/blog/next-16`
- Supabase RLS:  
  `https://supabase.com/docs/guides/database/postgres/row-level-security`
- Supabase data security:  
  `https://supabase.com/docs/guides/database/secure-data`
- Stripe Checkout:  
  `https://docs.stripe.com/payments/checkout/how-checkout-works`

## 104. Research items still requiring human verification

Before Förar public launch:

1. Confirm current official exam item count/structure, if NFB publicly or contractually provides it. Until then, retain conservative simulation wording.
2. Confirm current official pass rule and duration immediately before launch.
3. Confirm exact physical chart/tool requirements and how they may be described commercially.
4. Ask NFB whether it has guidance or restrictions on third-party commercial preparation products and use of names/links.
5. Obtain qualified review of full Förar taxonomy, lessons, items, chart symbology, and tolerances.
6. Confirm final chart artwork is sufficiently original and licensed.
7. Confirm VAT classification and invoice requirements.
8. Approve consumer/withdrawal/guarantee terms.
9. Approve minor/guardian/privacy and analytics design.
10. Determine accessibility-law obligations/exemptions and approve conformance evidence.
11. Verify the current Seglarintyg 3 requirements because the linked document carries an older edited date.
12. Confirm current SRC simulator sequence and wording only to describe the handoff accurately—not to copy it.

Before each later certificate launch, repeat the source and expert review rather than assuming the Förar process applies.

## 105. `CLAUDE.md` template

Create this file at repository root:

```markdown
# CLAUDE.md

Read `SPEC.md` before planning or editing. It is the product and engineering source of truth. If code, a ticket, or an older note conflicts with `SPEC.md`, stop and follow `SPEC.md` unless a newer accepted ADR explicitly supersedes it.

## Product identity

This is an independent Swedish exam-preparation service for leisure-boating certificates. It does not administer official exams or issue certificates. Never use copy that implies official status, NFB approval, guaranteed passing, or that digital preparation replaces supervised practical requirements.

## Required commands

Before reporting a task complete, run the relevant subset and state exactly what passed:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:integration`
- `pnpm test:rls`
- `pnpm test:e2e`
- `pnpm test:a11y`
- `pnpm content:validate`
- `pnpm build`

Do not claim tests passed if they were not run.

## Engineering conventions

- Use the pinned stable Next.js App Router version and strict TypeScript.
- Server Components by default. Add `"use client"` only for real interaction/state needs.
- Core decisions are pure functions in `/lib/domain`, `/lib/chart`, or `/lib/grading`, with unit tests.
- The server is authoritative for entitlements, grading, attempts, state transitions, simulation timing/scoring, and purchases.
- Validate every untrusted boundary with Zod. Do not cast untrusted JSON.
- Use integer öre and `Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' })`.
- Use degrees normalised to `[0, 360)`. East variation/deviation is positive and west is negative unless the approved curriculum explicitly changes notation.
- Use `Europe/Stockholm` for default date presentation; store timestamps in UTC.
- All user-facing copy is Swedish (`sv-SE`). No emojis in product UI copy.
- Keep components focused on rendering and event dispatch. Do not hide business logic in JSX or Server Actions.
- Do not add a dependency without documenting reason, licence, security, maintenance, and bundle/runtime impact.
- Do not modify live content in place. Create a new immutable version.
- Every migration enabling a table also defines RLS and tests in the same change.
- Never expose Supabase service/secret keys, Stripe secrets, cron secrets, signed-link secrets, or model keys to the client.

## Content and domain guardrails

- Primary sources first. Every live lesson/item has source document and locator.
- AI may draft but may never publish.
- Do not ingest competitor course text, questions, images, videos, explanations, or simulator flows.
- Do not use real Sjöfartsverket chart data or a chart derived from it without a written licence.
- All chart assets display `ÖVNINGSKORT — EJ FÖR NAVIGATION`.
- Båtpraktik and Seglar practical components remain supervised/offline; the app provides preparation only.
- Our SRC radio lab never replaces or imitates NFB’s mandatory simulator.
- Unknown official details remain configurable and are labelled; never invent them.
- Safety-critical content requires the specified human review.

## Privacy, minors, and accessibility

- Study data belongs to a learner profile; billing belongs to the adult account owner.
- Learner mode cannot access billing, marketing, or unrelated learner data.
- Minimise child data and do not add behavioural marketing to minor screens.
- Recording is optional and off by default.
- Build to WCAG 2.2 AA target. Core actions must be keyboard operable; colour is never the only signal.
- Every drag interaction needs an accessible alternative where feasible.
- Do not penalise assistive-technology users with naive latency scoring.

## Security

- RLS is a security boundary, not an optional convenience.
- Never rely on middleware alone for authorisation.
- Verify Stripe signatures and process events idempotently.
- Do not send paid answer keys in initial client payloads.
- Sanitize structured content and SVG assets; do not render arbitrary untrusted HTML/MDX.
- Do not log tokens, raw audio, full answer keys, or sensitive personal data.

## Work style

- Work milestone by milestone. Do not begin the next milestone before the current Definition of Done passes, except for the documented parallel content track.
- Prefer small reviewable changes.
- When an assumption is required, choose the safest reversible configuration, record it in an ADR/TODO, and do not present it as verified fact.
- Update tests and documentation with the implementation.
- End each task with: files changed, decisions made, tests run, remaining risks, and the next unblocked ticket.
```

## 106. Definition of product success

The product is successful when learners can demonstrate durable, transferable competence and understand the official next step—not merely when they consume content or answer familiar questions.

The founder should expect the main investment to be:

1. domain review and source maintenance;
2. original interactive chart/scenario design;
3. high-quality explanations and misconception mapping;
4. mobile/accessibility quality;
5. trustworthy acquisition and support.

The technical build is feasible. The commercial opportunity depends on executing those quality systems better than a generic online course or free quiz site.

---

**End of specification.**
