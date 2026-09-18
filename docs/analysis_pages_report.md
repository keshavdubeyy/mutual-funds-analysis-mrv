# Analysis Page — Full Findings Report

Covers every question, chart, and comparison currently shown on the Findings → Analysis page (`/findings/analysis`), across its five topics: **Overview, Motivations & barriers, What could help, Risk & knowledge, Group differences**. All figures below are read directly from the verified aggregate exports in `public/data/findings/*.json` and cross-checked against `src/lib/research-plan-data.ts` (the same register the dashboard's "Research Objectives and Key Measures" page uses) — nothing here is recalculated or estimated for this report, except the items explicitly marked "new respondent-level computation for this revision" in §2.4 and §6, which are run directly against the respondent-level cohort extract and shown as such.

**This is a revised version of the report** (second revision). §8 documents every correction made across both audit rounds — a real selection-count inconsistency, a swapped comparison direction, a sorting error, several imprecise option counts, a handful of overstated interpretations, and several further wording corrections and verification gaps caught on a second pass.

**Sample and scope, stated once:**
- **Focused group, n = 553** — salaried Gen Z respondents (SEBI Investor Survey 2025, ages **18–28**) who report considering mutual funds but do not currently hold them. This is **not** a "first-time SIP users" sample — see §2.3.
- **Unweighted, descriptive only.** No significance testing, no causal claims, no population-representative estimate.
- **MF+ETF combined scope** applies to every barrier/motivation/encouragement/stopping-reason field (AA1_DD1–AA4_DD4) and to the awareness-sources/media field — none of these can isolate mutual funds from ETF/Gold ETF; this is a property of the survey, not a scope choice made in this dashboard.
- **Denominators vary by question.** Being in the focused group does not mean a respondent answered every question — each chart states its own answer base, never assumed to be 553.
- **Multi-select limits vary by question — never assume "up to 3" applies everywhere.** AA1_DD1–AA4_DD4, `Q20CM` and `Q20DM` are each capped at exactly 3 selections per respondent (verified: each field's total selection count equals its answerer count × 3, exactly). `Q20F` (education topics): **multiple selections allowed; no selection limit documented in the checked sources.** Its own wording does not say "top 3," and its total selection count (1,836 across 553 answerers) exceeds what a 3-cap would allow (1,659) — this establishes that a three-selection limit **cannot** describe these records, not that no limit of any kind exists. See §3.3 for detail. `Q20E` (language) is single-select.
- Filters on the "Who is in our sample?" tab **do not** apply to the Analysis page — every figure below is a fixed, pre-computed aggregate for the full 553-person research group.

---

## 1. Overview

**Purpose:** a fast, visual entry point into the four questions the rest of the page answers in depth — not a duplicate of the detailed tabs, and not the full measure register (that lives on the separate Research Plan page). Four panels, 2×2 on desktop, stacked on mobile.

### 1.1 Panel — "What holds people back?"
- **Source:** `AA2_DD2` ("Top 3 Reasons for not investing in MF/ETF"), MF+ETF combined.
- **Base:** 266 of 553 answered.
- **Shown (top 3 by share, no ties at this cutoff):**

| Reason | n | % of 266 |
|---|---|---|
| Fear of losing money due to market risks | 81 | 30.5% |
| It's for long term investment | 68 | 25.6% |
| Lack of knowledge about how mutual funds work | 67 | 25.2% |

- **Observation shown:** "Fear of losing money due to market risks" is the most-selected reported barrier.
- **Link:** "Explore all barriers →" → Motivations & barriers, `barriers-selection-pct`.

### 1.2 Panel — "What could encourage investing?"
- **Source:** `AA3_DD3` ("Factors would encourage you to consider investing in MF/ETF..."), MF+ETF combined.
- **Base:** 266 of 553 answered (the identical respondent set that answers `AA2_DD2`, confirmed directly).
- **Shown (top 3 by share — with a genuine tie for 3rd place, so 4 items are shown, not silently reduced to 3):**

| Factor | n | % of 266 |
|---|---|---|
| Simple and easy process for investing (e.g. account opening, documentation, etc.) | 117 | 44.0% |
| Reducing the minimum investment requirement | 106 | 39.8% |
| Better education on how mutual funds work | 97 | 36.5% |
| Friendly and easy to use trading platforms and tools | 97 | 36.5% *(tied for 3rd)* |

- **Observation shown:** "Simple and easy process for investing" is the most-selected encouragement factor among those who answered. (Deliberately phrased as "most-selected," not "top-ranked" — the survey does not establish a specific onboarding problem.)
- **Link:** "Explore encouragement factors →" → What could help, `encouragement-selection-pct`.

### 1.3 Panel — "Previous investment experience"
- **Source:** `Q24A` (previous-investment classification), full focused group.
- **Base:** 553 of 553 (0 blank).
- **Shown (stacked bar + 3-row legend):**

| Group | n | % of 553 |
|---|---|---|
| Previously invested in MF | 136 | 24.6% |
| No previous investment in the 7 listed products | 382 | 69.1% |
| Previously invested in other listed products, but not MF | 35 | 6.3% |

- **Observation shown:** "About one quarter have invested in mutual funds before."
- **Wording note enforced:** the 382 group is never called "never invested" — `Q24A` only asks about 7 securities-market products (MF, ETF, F&O, stocks, REITs, corporate bonds, AIF); it says nothing about FDs, insurance, EPF, gold, etc.
- **Link:** "Explore previous experience →" → Motivations & barriers, `previous-investment-shares`. **(Corrected in this revision — the audit found this button previously read "Explore our sample," which named a different page than where it actually navigates; renamed to match its real destination rather than redirecting to a different page.)**

### 1.4 Panel — "Who asks for more education?"
- **Source:** `AA3_DD3` = "Better education on how mutual funds work," split by the same `Q24A`-based experience groups as §1.3.
- **Base:** each bar uses its own group's answer base among `AA3_DD3` answerers (not 553).

| Group | n | of | % |
|---|---|---|---|
| No previous investment in the 7 listed products | 76 | 188 | 40.4% |
| Previously invested in MF | 15 | 61 | 24.6% |

- **Observation shown:** "Education was selected more often by respondents with no previous investment in the seven listed products."
- **Percentage-point gap:** 40.4% − 24.6% = **15.8 pp**.
- **Link:** "Compare experience groups →" → Group differences, pre-selects the "Encouragement by previous MF experience" comparison.
- Same color is used for "Previously invested in MF" and "No previous investment..." across this panel and §1.3, and again in Group Differences (§5) — one fixed color per experience group, everywhere on the page.

**Footer (page-wide, not per-panel):** "Answer counts vary by question. Survey findings do not measure INDmoney app conversion." plus a "Methods and limitations →" link to the Research Plan page.

---

## 2. Motivations & barriers

**Purpose:** four independent multi-select questions, each with its own respondent group and answer base — shown separately, never pooled into one ranking, never all divided by 553.

### 2.1 Reasons for considering investing — `AA1_DD1`
- **Wording:** "Top 3 Primary reasons for considering investing in MF/ETFs."
- **Base:** 240 of 553 answered (313 blank = missing/unknown, never "no reason").
- **Full results (20 options including "Other," multi-select, percentages sum to ~300%):**

| Reason | n | % of 240 |
|---|---|---|
| Long-term growth (building wealth over time) | 62 | 25.8% |
| Good for short term investments | 60 | 25.0% |
| Potential for higher returns | 52 | 21.7% |
| Lower risk of losing money | 51 | 21.2% |
| Quick gains with small investments | 49 | 20.4% |
| Investment strategy based on financial goals and risk appetite | 48 | 20.0% |
| Protection against inflation | 45 | 18.8% |
| Convenience and ease of investment | 41 | 17.1% |
| Diversifying my portfolio | 39 | 16.2% |
| Tax benefits or savings | 38 | 15.8% |
| Professional fund management by experts | 37 | 15.4% |
| To build additional sources of income | 37 | 15.4% |
| Clear and immediate information about actual returns | 33 | 13.8% |
| Lower fees and expenses compared to other investments | 32 | 13.3% |
| Zero account opening charges/Ease of onboarding process | 27 | 11.2% |
| My friends/acquaintances are currently investing in ETFs | 24 | 10.0% |
| Interest in investing in ETFs | 18 | 7.5% |
| To learn how this investment product works | 14 | 5.8% |
| Had extra funds to invest | 12 | 5.0% |
| Other (please specify) | 1 | 0.4% |

- **Population:** inferred, not confirmed against a published table ("likely Intenders," SEBI Chapter 8 concept).

### 2.2 Reasons for not investing — `AA2_DD2`
- **Wording:** "Top 3 Reasons for not investing in MF/ETF."
- **Base:** 266 of 553 answered (287 blank). SEBI's own report documents a "each respondent was asked to respond on 2 products" routing rule at the full-survey level. This rule is a plausible, documented explanation for partial coverage — it is not independently re-verified for this specific 553-person cohort, so the exact eligibility reason for each of the other 287 blanks remains unresolved, not proven.
- **Population:** SUPPORTED by an exact base-count match to SEBI's own "Non-Investors" table.
- **Full results (18 options):**

| Reason | n | % of 266 |
|---|---|---|
| Fear of losing money due to market risks | 81 | 30.5% |
| It's for long term investment | 68 | 25.6% |
| Lack of knowledge about how mutual funds work | 67 | 25.2% |
| I don't know how to start investing in Mutual funds | 65 | 24.4% |
| Confusion cause by information overload from different sources | 60 | 22.6% |
| Uncertainty about returns and performance | 59 | 22.2% |
| Lack of trust in fund managers | 58 | 21.8% |
| Lack of trust in the mutual funds | 56 | 21.1% |
| There are too many options | 56 | 21.1% |
| Regulatory or policy concerns affecting mutual funds | 53 | 19.9% |
| Better returns from other investment options | 50 | 18.8% |
| Requires large amount to start investing | 35 | 13.2% |
| High fees, charges and Management expenses | 25 | 9.4% |
| Advised by family, friends, or financial advisors not to invest | 20 | 7.5% |
| I don't have enough money to invest | 18 | 6.8% |
| Requires too many documents | 12 | 4.5% |
| Takes time to receive invested money after selling | 11 | 4.1% |
| Lack of availability of investment platform in local language | 4 | 1.5% |

*(Encouragement factors — `AA3_DD3` — are **not** shown on the Motivations & barriers topic in the live dashboard; they live on the What could help topic. See §3.1 for the full results, corrected in this revision — the first version of this report incorrectly duplicated this question under both topics.)*

### 2.3 Previous investment experience — `Q24A`
See §1.3 for the full 3-way split (136 / 382 / 35 of 553). **This is not a "first-time SIP users" sample** — a quarter of the focused group has invested in mutual funds before.

### 2.4 Reasons for stopping investment — `AA4_DD4`
- **Wording:** "What were the Top 3 reasons you stopped investing in MF/ETF."
- **Base:** 64 of 553 answered — a small answer base, flagged explicitly on the page: **these 64 are not confirmed to be a subset of the 136 past MF investors.** A related, more strictly-defined question (`A15_D15`, the documented "Lapser" question) has only 1 answer across all 553 — including the 136 past investors — showing routing to this question doesn't track prior-investment status in any simple way.
- **Full results (16 options):**

| Reason | n | % of 64 |
|---|---|---|
| News of geopolitical uncertainty and fear of market fall | 22 | 34.4% |
| Lower than expected returns | 22 | 34.4% |
| I needed money for other purposes (urgent requirement of funds) | 20 | 31.2% |
| Changes in personal financial goals | 18 | 28.1% |
| High volatility and unpredictable performance | 17 | 26.6% |
| Better returns from other investment options | 17 | 26.6% |
| High fees, charges and Management expenses | 13 | 20.3% |
| Experienced significant financial losses | 12 | 18.8% |
| Negative experiences shared by friends or family | 11 | 17.2% |
| Lack of sufficient knowledge or market insights | 11 | 17.2% |
| Takes time to receive invested money after selling | 9 | 14.1% |
| Limited availability of unbiased expert advice or recommendations | 7 | 10.9% |
| Hidden or unexpected transaction costs | 7 | 10.9% |
| Complications in calculating tax liability/filing Income Tax returns | 3 | 4.7% |
| Difficult to access channel/platform from where I had done investments | 2 | 3.1% |
| Difficulty in managing or tracking investments | 1 | 1.6% |

**Overlap check — new respondent-level computation for this revision.** Using the respondent-level cohort extract (`data/processed/cohort_focused_considered_mf_not_holding.csv`), the 64 `AA4_DD4` answerers break down by their `Q24A` previous-investment class as follows:

| Previous experience | Number answering the stopping question |
|---|---:|
| Past MF investment | 62 |
| Other listed products, but no MF | 2 |
| None of the seven listed products | 0 |

This is an **observed breakdown, not a documented routing rule** — the survey does not state that `AA4_DD4` is gated on `Q24A`. It does, however, show that in this sample, no one who reported none of the 7 listed products answered the stopping question, and the 2 non-MF answerers are consistent with `AA4_DD4` covering **MF+ETF combined** (someone who previously held only ETF, not MF, is still eligible to report having stopped investing in "MF/ETF"). Read as a consistent pattern in this data, not proof of the underlying eligibility rule.

### 2.5 Financial goals — `Q6_RANK_GRID`
- **Wording:** 13 ranked goal items (e.g. "Buying a house," "Growing wealth," "Supporting family members"); each respondent ranks up to 3.
- **Base:** 553 of 553 answered at least one slot (0 used the free-text "Others" 13th slot).
- **Scope note:** general financial-priority context, not a motivation specific to MF/ETF — shown on this topic's card set for that reason.
- **Full results (share ranked anywhere in the respondent's top 3, not a rank-weighted score):**

| Goal | n | % of 553 |
|---|---|---|
| Growing wealth | 235 | 42.5% |
| Supporting family members | 206 | 37.3% |
| Building an emergency fund | 196 | 35.4% |
| Buying a house | 194 | 35.1% |
| Achieving financial independence | 159 | 28.8% |
| Saving for a major expense | 128 | 23.1% |
| Children's education | 127 | 23.0% |
| Planning for retirement | 108 | 19.5% |
| Earning money actively on a daily basis | 97 | 17.5% |
| Generating passive income | 86 | 15.6% |
| My child's marriage | 73 | 13.2% |
| Optimizing tax savings and benefits | 50 | 9.0% |
| Others (free text) | 0 | 0.0% |

---

## 3. What could help

**Purpose:** what respondents say would encourage investing, and what they say would help them learn — shown together as candidate directions, explicitly **not validated fixes**.

### 3.1 Encouragement factors — `AA3_DD3`
- **Wording:** "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in."
- **Base:** 266 of 553 answered — the identical respondent set that answers `AA2_DD2` (confirmed directly).
- **Full results (10 options, multi-select, percentages sum to ~300%):**

| Factor | n | % of 266 |
|---|---|---|
| Simple and easy process for investing (e.g. account opening, documentation, etc.) | 117 | 44.0% |
| Reducing the minimum investment requirement | 106 | 39.8% |
| Better education on how mutual funds work | 97 | 36.5% |
| Friendly and easy to use trading platforms and tools | 97 | 36.5% |
| Success stories or positive media coverage about funds' investments | 92 | 34.6% |
| Reducing the fees and charges (transaction, management) | 81 | 30.5% |
| Positive recommendations from family, friends, or financial advisors | 66 | 24.8% |
| Availability of trusted financial advice and guidance | 53 | 19.9% |
| Assurance of lower risk | 53 | 19.9% |
| Improved economic conditions and positive market outlook | 36 | 13.5% |

### 3.2 Investor-education attendance — `Q20AM`
- **Base:** 553 of 553 (0 blank).
- **Results:**

| Response | n | % |
|---|---|---|
| Have not attended any investor education program | 527 | 95.3% |
| Yes, attended it online (webinars / virtual training) | 20 | 3.6% |
| Yes, attended it in-person (seminars / workshops) | 6 | 1.1% |

- **Meaning:** baseline context for any future education-content proposal.

### 3.3–3.5 Learning preferences — `Q20DM`, `Q20F`, `Q20CM`, `Q20E`
All four fields: 553 of 553 answered. **Selection limits differ by field, verified from each field's own total selection count:**
- `Q20DM` (format) and `Q20CM` (medium): capped at exactly 3 per respondent — total selections = 553 × 3 = 1,659 exactly for both.
- `Q20F` (topics): **multiple selections allowed; no selection limit documented in the checked sources.** Its own wording never says "top 3," and its total selections (1,836) exceed the 1,659 a 3-cap would allow — this establishes that a three-selection limit cannot describe these records; it does not establish that no limit of any kind was applied. Read this field's percentages as a multi-select without an assumed top-3 ranking.
- `Q20E` (language): single-select.

**Preferred format (`Q20DM`):**

| Format | n | % |
|---|---|---|
| Videos | 401 | 72.5% |
| Social media post | 331 | 59.9% |
| Online courses | 280 | 50.6% |
| Article/blogs/newsletters/whitepapers | 236 | 42.7% |
| Audio books | 223 | 40.3% |
| Podcast | 187 | 33.8% |
| Others (please specify) | 1 | 0.2% |

**Preferred topics (`Q20F`):**

| Topic | n | % |
|---|---|---|
| How to identify financial frauds & scams | 332 | 60.0% |
| Investor rights & SEBI regulations | 311 | 56.2% |
| Risk management & portfolio diversification | 286 | 51.7% |
| Information on various investment options | 265 | 47.9% |
| Retirement & long-term financial planning | 262 | 47.4% |
| Using digital investment platforms safely | 238 | 43.0% |
| Understanding fact sheets of mutual funds and other financial reports | 139 | 25.1% |
| Others (please specify) | 3 | 0.5% |

**Preferred medium (`Q20CM`):**

| Medium | n | % |
|---|---|---|
| Information on social media (YouTube, Instagram, etc.) | 355 | 64.2% |
| Mobile apps | 332 | 60.0% |
| Advertisements on TV, digital or other mediums | 244 | 44.1% |
| In-person seminars or workshops | 175 | 31.6% |
| Online webinars and virtual training sessions | 169 | 30.6% |
| Websites/online portal | 161 | 29.1% |
| Email | 133 | 24.1% |
| Expert opinion/interview/panel discussion | 90 | 16.3% |
| Others (please specify) | 0 | 0.0% |

**Preferred language (`Q20E`, single-select, top rows):**

| Language | n | % |
|---|---|---|
| Hindi | 188 | 34.0% |
| English | 141 | 25.5% |
| Tamil | 76 | 13.7% |
| Telugu | 36 | 6.5% |
| Malayalam | 31 | 5.6% |
| Gujarati | 23 | 4.2% |
| Marathi | 20 | 3.6% |
| Kannada | 16 | 2.9% |
| *(remaining languages each ≤ 8 respondents)* | — | — |

### 3.6 Awareness sources and media — `Q4M`/`Q5M`
- **Base:** 266 of 553 — independently confirmed to be the identical 266 who answer `AA2_DD2`/`AA3_DD3`, not assumed from it.
- **Scope:** MF+ETF combined — the only slot the survey offers for this population; there is no MF-only breakout.
- **Sources (12 options, multi-select):**

| Source | n | % of 266 |
|---|---|---|
| Friends, Family, and Colleagues | 154 | 57.9% |
| Financial influencers on social media | 144 | 54.1% |
| Online investment communities (Telegram, WhatsApp, Reddit, Facebook groups) | 79 | 29.7% |
| Financial professionals (advisors/planners, bank reps) | 70 | 26.3% |
| Advertisements on investment products | 70 | 26.3% |
| Investor education programmes (institutions/industry associations) | 65 | 24.4% |
| Market or company analysis reports | 59 | 22.2% |
| Financial news & blogs | 50 | 18.8% |
| Educational resources (webinars, courses, books, podcasts) | 44 | 16.5% |
| Investor education programmes (investment companies) | 36 | 13.5% |
| None of the above | 9 | 3.4% |
| Others (please specify) | 2 | 0.8% |

- **Media (14 options including "Others," multi-select):**

| Medium | n | % of 266 |
|---|---|---|
| Social media (YouTube, Instagram reels, X posts) | 153 | 57.5% |
| Television | 112 | 42.1% |
| Messaging apps (WhatsApp, Telegram) | 68 | 25.6% |
| Online search engines | 58 | 21.8% |
| Online newspapers/magazines/publications | 57 | 21.4% |
| Physical newspapers/magazines/publications | 56 | 21.1% |
| Other online media | 50 | 18.8% |
| Websites/apps of regulators (AMFI, SEBI, etc.) | 39 | 14.7% |
| Phone calls/SMS | 36 | 13.5% |
| In-person consultations/meetings | 33 | 12.4% |
| Fin-tech apps & investment platforms | 32 | 12.0% |
| Seminars, webinars, and workshops | 24 | 9.0% |
| Radio | 13 | 4.9% |
| Others (please specify) | 3 | 1.1% |

- **Limitation stated on the page:** reports where respondents say they heard about these products, not whether that source caused them to invest; cannot separate mutual funds from ETFs for this population.

**§3.2 vs. §3.6, checked for consistency — new for this revision.** §3.2 shows 26 respondents (20 + 6) who report *attending* an investor-education program (`Q20AM`). §3.6 shows 65 respondents who cite "Investor Education Programmes run by prominent institutions/industry associations" as an *awareness source* for MF/ETF (one option within `Q4M`, base 266). **These are not contradictory** — the two questions ask different things: `Q20AM` asks about actually attending a program; the `Q4M` option asks whether such a program was a source of awareness, which does not require attendance (seeing an ad for one, hearing about one from a friend, or reading about one would all count). We did not compute the respondent-level overlap between these two answers — the cohort extract used for the other new checks in this revision (`data/processed/cohort_focused_considered_mf_not_holding.csv`) does not include the `Q20AM`/`Q4M` fields, so a genuine joint count would require a new respondent-level extract. Flagged here rather than presented as an established relationship.

---

## 4. Risk & knowledge

**Purpose:** self-reported risk preference and reactions, then reported knowledge and numeracy — shown as context, explicitly **not a literacy score**.

### 4.1 Risk/return preference — `QRT`
- **Base:** 553 of 553 (0 blank).

| Preference | n | % |
|---|---|---|
| Preservation of capital is more important to me than returns | 211 | 38.2% |
| I need good but stable and reliable returns with minimal losses | 192 | 34.7% |
| I aim for better, higher returns and accept some ups/downs, but couldn't accept significant losses | 103 | 18.6% |
| I would like high returns, not too concerned with risk, prepared for significant short-term losses | 47 | 8.5% |

### 4.2 Reaction to a market downturn — `Q10M`
- **Base:** 553 of 553 (0 blank).

| Reaction | n | % |
|---|---|---|
| Keep money invested and wait for recovery | 200 | 36.2% |
| A bit worried, may take out some money | 175 | 31.6% |
| Very worried, might stop investing and move to safer options (FDs) | 126 | 22.8% |
| Invest more now to earn better returns later | 52 | 9.4% |

### 4.3 Financial-knowledge battery — `GRIDxQ15AM` (9 items)
- **Base:** 553 of 553 for every item (0 blank on all 9). **No documented answer key exists for this battery — no item is ever scored correct/incorrect.** "Not Aware" is an explicit selected response, kept as its own category, never merged with missing.
- **Sorted numerically by highest share selecting "Not Aware" first** (this is a description of what respondents selected, not a confidence, accuracy, or literacy score):

| # | Topic | True | False | Not Aware |
|---|---|---|---|---|
| 1 | Investments across different asset classes increase risk | 110 (19.9%) | 182 (32.9%) | **261 (47.2%)** |
| 2 | CAS provides overview of investments in securities/stock market | 258 (46.7%) | 79 (14.3%) | **216 (39.1%)** |
| 3 | BSDA allows nil/negligible-charge demat account below a threshold | 255 (46.1%) | 99 (17.9%) | **199 (36.0%)** |
| 4 | The concept of compounding is beneficial in the short term | 129 (23.3%) | 250 (45.2%) | **174 (31.5%)** |
| 5 | A portion of pension/provident-fund investments is in the stock market | 374 (67.6%) | 80 (14.5%) | **99 (17.9%)** |
| 6 | Direct plans have a lower expense ratio than regular plans | 393 (71.1%) | 78 (14.1%) | **82 (14.8%)** |
| 7 | Need a demat account (in addition to trading account) to invest | 396 (71.6%) | 82 (14.8%) | **75 (13.6%)** |
| 8 | High-return investment options are also associated with high risk | 403 (72.9%) | 90 (16.3%) | **60 (10.8%)** |
| 9 | KYC can be completed online | 448 (81.0%) | 60 (10.8%) | **45 (8.1%)** |

- **Framing enforced on the page:** the measure is called "share selecting Not Aware," never confidence, accuracy, or a literacy score.

### 4.4 Inflation numeracy check — `Q12M`
- **Wording:** "Suppose the rate of return on your savings is 5% per year and inflation is 6% per year — after a year, will you be able to buy more, less, or the same as today?"
- **Base:** 553 of 553 (0 blank).
- **Only "Less than today" is arithmetically correct** (5% return < 6% inflation) — this is the one place on the page where an answer is scored, because the correct answer follows from arithmetic stated in the question itself, unlike the 9-item battery above.

| Response | n | % |
|---|---|---|
| Less than today *(correct)* | 245 | 44.3% |
| Exactly as today | 130 | 23.5% |
| More than today | 94 | 17.0% |
| Do not know | 69 | 12.5% |
| Refuse to answer | 15 | 2.7% |

### 4.5 Self-reported stock-market familiarity — `Q11M`
- **Base:** 553 of 553 (0 blank).

| Response | n | % |
|---|---|---|
| Familiar, update myself periodically | 227 | 41.0% |
| Very familiar, follow regularly | 172 | 31.1% |
| Know a little, follow broader trends | 109 | 19.7% |
| Don't Know | 45 | 8.1% |

---

## 5. Group differences

**Purpose:** one selector, one comparison shown at a time — three group comparisons plus three respondent-level relationship analyses, all descriptive, all with an explicit reporting-minimum rule: **a group needs at least 30 respondents who *answered that specific question* to get a percentage** — not 30 people in that group overall. A group's full size and its answer count are always shown separately for exactly this reason (e.g. §5.1's "Other product only" group has 35 people overall but only 17 answered the barriers question — the 17 is what the 30-minimum is checked against, and it fails, so that group is counts only).

### 5.1 Barriers by previous MF experience (`AA2_DD2` × `Q24A`)
- **Groups and coverage:** Past MF investor 61/136 answered (44.9%); No prior investment in the 7 products 188/382 (49.2%); Other product only 17/35 (48.6%, **below reporting minimum — counts only**).
- **Headline:** "Lack of trust in fund managers" ranks top among past MF investors (19/61 = 31.1%) but mid-ranked among no-prior-investment respondents (39/188 = 20.7%). "Fear of losing money" ranks near the top in both (18/61 = 29.5% vs. 59/188 = 31.4%).
- Full option table (18 rows) is available on the page via the chart/table toggle; percentage-point differences are shown per row.

### 5.2 Encouragement by previous MF experience (`AA3_DD3` × `Q24A`)
- **Headline / largest gap:** "Better education on how mutual funds work" — 76/188 (40.4%) no-prior-investment vs. 15/61 (24.6%) past MF investors → **+15.8 pp**.
- Other notable rows: "Friendly and easy to use trading platforms and tools" runs the **same direction** as the headline finding — higher among no-prior-investment respondents (74/188 = 39.4% vs. 20/61 = 32.8%, **+6.6 pp** no-prior-minus-past). "Simple and easy process for investing" is the one option in this comparison that runs the **opposite direction**: it is the most-selected factor for both groups, but more so among past MF investors (30/61 = 49.2% vs. 79/188 = 42.0%, **−7.2 pp** no-prior-minus-past).

### 5.3 Barriers by income tier (`AA2_DD2` × `Q10A`)
- **Tiers and coverage:** Up to ₹20,000 — 120/218 (55.0%); ₹20,001–₹40,000 — 74/182 (40.7%); Above ₹40,000 — 40/102 (39.2%). "Do not wish to disclose" (20/33) and "No current income" (12/18) fall below the reporting minimum — counts only.
- **Headline:** "Fear of losing money due to market risks" is the one option with a clear, step-by-step gap across all three income tiers: **25.8% → 32.4% → 42.5%** (Up-to-20k → 20–40k → Above-40k). Most other options show no such gradient (e.g. "Lack of knowledge about how mutual funds work" is highest in the top tier at 30.0% but lowest in the middle tier at 20.3%).

### 5.4 Percentage-point differences
Computed and shown for every comparison above, wherever both sides clear the 30-respondent reporting minimum — e.g. the 15.8 pp education gap (§5.2) and the 16.7 pp fear-of-loss income gradient (Above-₹40,000 minus Up-to-₹20,000, §5.3). Never computed against a counts-only group.

### 5.5 Relationship — Risk preference and fear of losing money
- **Method:** a genuine respondent-level join (not derived from marginal totals) among the 266 `AA2_DD2` answerers, split by their own `QRT` risk-preference answer.
- **Result:**

| Risk preference | n | selecting "fear of losing money" | % |
|---|---|---|---|
| Stable/reliable returns, minimal losses | 100 | 28 | 28.0% |
| Preservation of capital more important than returns | 96 | 27 | 28.1% |
| Higher returns, accepts some ups/downs, not significant losses | 48 | 17 | 35.4% |
| High returns, not risk-concerned | 22 | 9 | *below reporting minimum — counts only* |

- **Finding:** among the three reportable risk-preference groups, the share also selecting "fear of losing money" was 28.0%, 28.1%, and 35.4%. The two more risk-averse groups (preservation of capital; stable/reliable returns) reported almost the same share (28.0% and 28.1%); the one group expressing some risk tolerance reported a higher share (35.4%). The fourth, most risk-tolerant group is below the reporting minimum (22 respondents) and shown as a count only (9). No consistent rise or fall from more to less risk-averse groups is observed.

### 5.6 Relationship — Fund-fee knowledge and demand for education
- **Method:** among the 266 `AA3_DD3` answerers, split by their response to "Direct plans in mutual funds have a lower expense ratio than regular plans" (chosen before looking at any result, as the single item most specifically about MF mechanics).

| Response | n | selecting "better education" | % |
|---|---|---|---|
| True | 172 | 65 | 37.8% |
| Not Aware | 55 | 22 | 40.0% |
| False | 39 | 10 | 25.6% |

- **Finding:** "Better education on how mutual funds work" was selected by 40.0% of respondents who selected Not Aware for this item, 37.8% of respondents who selected True, and 25.6% of respondents who selected False. This does not establish a knowledge gap — the battery has no documented answer key, so "True," "False," and "Not Aware" are reported responses, not correctness levels.

### 5.7 Relationship — Online-KYC knowledge and a simpler process
- **Method:** among the same 266 `AA3_DD3` answerers, split by response to "KYC can be completed online."

| Response | n | selecting "simple and easy process" | % |
|---|---|---|---|
| True | 208 | 94 | 45.2% |
| False | 30 | 13 | 43.3% |
| Not Aware | 28 | 10 | *below reporting minimum — counts only* |

- **Finding:** the observed difference between respondents who selected True and respondents who selected False was 1.9 percentage points (45.2% vs. 43.3%). This does not establish that the two groups' preferences are equivalent — only that this sample did not show a larger gap on this specific pairing.

**Across all three relationships:** these are respondent-level joins, not intersections of marginal totals; every one describes an association observed in this sample, not a cause, and no significance test is applied.

---

## 6. New analysis — does reporting a specific barrier line up with selecting its matching fix?

**New respondent-level computation for this revision, not yet part of the live dashboard.** The three comparisons in §5 test *group* differences (by experience, by income). This section tests something more direct: among the 266 respondents who answered both `AA2_DD2` and `AA3_DD3`, does selecting a specific barrier line up with also selecting the encouragement factor that would most directly address it? **The three pairs were specified before inspecting their results**, based on the most direct conceptual match between a barrier and a factor already in the data — not chosen after seeing which pair showed the largest gap. This describes the order of operations followed; it is not a claim of formal, timestamped pre-registration.

**Method:** for each pair, the 266 respondents are split into "selected this barrier" vs. "did not," using the same validated tokenizer already used for `AA2_DD2`/`AA3_DD3` throughout this project (`resolve_reason`, from `analysis/03_descriptive_analysis.ipynb`), applied to the raw multi-select strings in `data/processed/cohort_focused_considered_mf_not_holding.csv`. All 266 rows tokenized cleanly (0 unresolved fragments against the verified 18-item/10-item vocabularies). Both splits clear the 30-respondent reporting minimum for all three pairs.

**Reproducibility:** computed by `scripts/compute_followup_checks.py`. Saved aggregate outputs (no respondent-level values): `data/processed/analysis/followup_barrier_encouragement_pairs.csv` (full detail, both sides) and `followup_barrier_encouragement_pairs_diffs.csv` (signed differences). Re-run with `python scripts/compute_followup_checks.py`.

**Full results — counts, answer bases, percentages, and signed differences for both sides of each comparison:**

| Barrier (`AA2_DD2`) | Matching factor (`AA3_DD3`) | Selected barrier: n selecting factor / base | Did not select barrier: n selecting factor / base | Signed difference (selected − did not) |
|---|---|---|---|---|
| "I don't know how to start investing in Mutual funds" | "Simple and easy process for investing" | 29/65 = 44.6% | 88/201 = 43.8% | **+0.8 pp** |
| "Lack of knowledge about how mutual funds work" | "Better education on how mutual funds work" | 24/67 = 35.8% | 73/199 = 36.7% | **−0.9 pp** |
| "Requires large amount to start investing" | "Reducing the minimum investment requirement" | 15/35 = 42.9% | 91/231 = 39.4% | **+3.5 pp** |

All six group sizes (65, 201, 67, 199, 35, 231) clear the 30-respondent reporting minimum; every percentage above is reportable, none is counts-only.

**Finding, stated without a conclusion the numbers don't support:** the three comparisons showed observed gaps of 3.5 percentage points or less. These descriptive results do not establish whether a relationship exists beyond this sample, and do not establish that no relationship exists — a small observed gap in this specific unweighted sample is not proof of absence. No significance test was applied. **This analysis is not yet wired into the live Group Differences tab or the measure register** — it exists in this report only. Per guidance received during review, **these are not being added to the Overview** (which stays focused on its four existing summaries); if added to the dashboard, they belong under Group Differences, alongside the three relationships already there, with the same neutral framing used above rather than a "no relationship" claim.

---

## 7. Cross-page consistency notes

- The three previous-investment-experience groups (Past MF investor / No prior investment in the 7 listed products / Other product only) use the **same fixed color** wherever they appear: Overview (§1.3, §1.4), Group Differences (§5.1, §5.2).
- "Not Aware" (knowledge battery) is never conflated with a "wrong answer" — it is the only battery with no answer key, in contrast to `Q12M` (§4.4), which has one arithmetically correct answer stated in the question itself.
- Multi-select percentages sum to well over 100% — but the exact selection limit is **not the same for every question**: AA1_DD1–AA4_DD4, `Q20CM`, and `Q20DM` are capped at exactly 3 per respondent (verified); `Q20F` is not capped at 3 (verified — see §3.3); `Q4M`/`Q5M` (awareness sources/media) are open-ended multi-select with no fixed cap stated in the source documentation. Never assume "up to 3" as a default.
- Full option-level detail, calculation steps, worked examples, and stated limitations for every measure referenced above also live on the separate **Research Plan** page (`/research-plan`), in a searchable, themed register — this report summarizes what's *displayed on the Analysis page specifically*, not a re-statement of that full register.

---

## 8. Corrections made in this revision

An independent audit of the first version of this report found the following issues, all corrected above:

| # | Issue | Fix applied |
|---|---|---|
| 1 | `Q20F` (education topics) was described as "top 3" like `Q20CM`/`Q20DM`, but its 8 option counts total 1,836 — more than the 1,659 a 553×3 cap allows. | Verified `Q20F`'s own wording has no "top 3" language; confirmed `Q20CM`/`Q20DM` total exactly 1,659 (capped) while `Q20F` does not. §3.3 and the scope section now state each field's actual limit. |
| 2 | "Friendly and easy to use trading platforms and tools" (§5.2) was described as running the opposite direction from the "Better education" headline finding; the arithmetic shows it runs the *same* direction, and "Simple and easy process" is the one that actually runs opposite. | Swapped the description to match the data; both percentage-point figures re-verified from raw counts. |
| 3 | The knowledge-battery table (§4.3) listed items out of order — compounding (31.5% Not Aware) appeared ahead of CAS (39.1%) and BSDA (36.0%). | Re-sorted all 9 rows strictly by descending "Not Aware" share; renamed the framing to "highest share selecting Not Aware first." |
| 4 | Motivations (§2.1) said "19 options" while listing 20 (including "Other"); awareness media (§3.6) said "13 options" while listing 14 (including "Others"). | Corrected both counts to match the actual option lists, and now note "including Other/Others" explicitly. |
| 5 | The barriers section (§2.2) stated a documented SEBI routing rule "explains the overall response rate" for this specific 553-person cohort — overstated, since that rule is verified at the full-survey level, not independently re-confirmed for this cohort's 287 blanks. | Reworded to state the rule is a plausible, documented explanation, with the specific eligibility reason for this cohort left unresolved. |
| 6 | Several relationship findings used evaluative language ("weak," "inconsistent," "no consistent story," "too small to call a pattern") that goes beyond what the numbers alone support. | Replaced every instance with the plain percentages and an explicit statement of what is and isn't established, per §2. |
| 7 | Remaining "top-ranked" wording for encouragement factors, and an imprecise "30 respondents" reporting-minimum description. | Confirmed all remaining instances already read "most-selected"; clarified the reporting minimum is 30 *answerers of that specific question*, not 30 people in the group overall. |
| 8 | Financial-goal ranking was mentioned only in a parenthetical aside, in tension with the report's "covers everything" framing. | Added as a full §2.5 with all 12 goals, matching where it's actually shown on the dashboard (Motivations & barriers). |
| 9 | Two checks were flagged as missing: stopping-reasons vs. previous-experience overlap, and education-attendance vs. awareness-sources overlap. | First check computed directly from respondent-level data (§2.4). Second check clarified by wording only — computing the actual overlap requires a respondent-level extract that includes `Q20AM`/`Q4M` together, which does not currently exist; stated explicitly rather than fabricated (§3.6). |
| 10 | The most useful next analysis (barriers × their matching encouragement factors) had not been run. | Computed for the three specific, pre-chosen pairs and added as new §6, explicitly marked as not yet part of the live dashboard. |
| 11 | The report's §2.3 duplicated the full encouragement-factors chart under "Motivations & barriers," but that question is not actually shown there in the live dashboard — only under "What could help." | Removed the duplicate from §2 with a cross-reference note; the full table now lives only in §3.1, matching the live app. |
| 12 | **Live-dashboard bug, confirmed by inspecting the source code:** the Overview panel's "Explore our sample" button actually navigates to the Motivations & barriers topic's previous-investment chart, not to the separate "Who is in our sample?" page its label implies. | Renamed the button to "Explore previous experience," matching its real destination (`src/components/analysis/overview-tab.tsx`). |
