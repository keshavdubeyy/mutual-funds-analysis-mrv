# Key Research Indicators — Measure Reference

Reference document only — no code changes here. This lists every measure in the register (`src/lib/research-plan-data.ts`), grouped the same way as the tabs on the Research Objectives and Key Measures page (`/research-plan`), so the same tab structure and calculations can later be reproduced inside the Findings → Analysis tab.

**Research question:** What motivations, barriers and encouragement factors do salaried Gen Z respondents report when they consider mutual funds but do not currently hold them?

**How to read every measure below:** each result shows how many people answered and out of how many — never the full 553 unless everyone answered that specific question. A similar answer rate across two groups is a necessary check before comparing them, but it does not by itself rule out selection bias.

**Tabs / groups, in order:**

1. [Motivation percentages](#1-motivation-percentages)
2. [Barrier percentages](#2-barrier-percentages)
3. [Encouragement percentages](#3-encouragement-percentages)
4. [Previous investment and stopping reasons](#4-previous-investment-and-stopping-reasons)
5. [Risk-preference distributions](#5-risk-preference-distributions)
6. ["Not Aware" percentages](#6-not-aware-percentages)
7. [Differences between groups](#7-differences-between-groups)
8. [Learning preferences](#8-learning-preferences)
9. [Context measures](#9-context-measures)

Every measure has a status: **Calculated** (verified, ready to show) or **Needs clarification** (a field that already exists, but whose meaning or routing isn't clear enough yet to report as a finding — currently just one: `A15_D15`).

---

## 1. Motivation percentages

*Why respondents consider investing.*

### Reasons for considering investing — Calculated

- **Question:** What reasons do respondents give for considering mutual funds?
- **Definition:** The share of respondents who selected each reason for considering investing in MF/ETF, out of everyone who answered this question.
- **What it tells us:** Shows which reasons this group reports most often for considering MF/ETF.
- **Why it matters:** Shows which reasons are already top-of-mind, so messaging can reinforce them rather than guess.
- **Result:** See chart — 19 reasons, ranked by how often selected (240 of 553 answered).
- **How it's calculated:**
  1. Start with the 553 people in the focused group.
  2. Keep only the 240 who gave a substantive answer to this question.
  3. For each reason, count how many of those 240 selected it (respondents could pick up to 3).
  4. Divide that count by 240 and multiply by 100 for a percentage.
- **Worked example:** The top reason, "Long-term growth (building wealth over time)," was selected by 62 of the 240 answerers: 62 ÷ 240 × 100 = 25.8%.
- **Who's included:** Focused group, substantive answerers only. Multi-select, up to 3 per respondent; percentages sum to roughly 300%.
- **Missing/special handling:** 313 blank = missing/unknown, never "no reason."
- **Interpretation limits:** Who exactly was meant to answer this is a reasonable inference, not confirmed against a published table.
- **Where it's shown:** Findings → Analysis tab → Motivations, barriers & encouragement → "Reasons for considering investing."
- **Source fields:**
  - `AA1_DD1` — "Top 3 Primary reasons for considering investing in MF/ETFs"

---

## 2. Barrier percentages

*Which concerns they report.*

### Reasons for not investing — Calculated

- **Question:** What reasons do respondents give for not investing today?
- **Definition:** The share of respondents who selected each reason for not currently investing in MF/ETF, out of everyone who answered this question.
- **What it tells us:** Shows which barriers this group reports most often.
- **Why it matters:** Identifies which concerns are most common, so risk communication or onboarding content can address the right ones first.
- **Result:** Fear of losing money due to market risks: 81 of 266 (30.5%), the single most-cited reason.
- **How it's calculated:**
  1. Start with the 553 people in the focused group.
  2. Keep only the 266 who gave a substantive answer to this question.
  3. For each reason, count how many of those 266 selected it (respondents could pick up to 3).
  4. Divide that count by 266 and multiply by 100 for a percentage.
- **Worked example:** The top barrier, "Fear of losing money due to market risks," was selected by 81 of the 266 answerers: 81 ÷ 266 × 100 = 30.5%.
- **Who's included:** Focused group, substantive answerers only — the same population SEBI calls Non-Investors. Multi-select, exactly 3 per respondent when answered; percentages sum to roughly 300%.
- **Missing/special handling:** 287 blank = missing/unknown. A documented survey rule ("each respondent asked on 2 products") explains the overall response rate.
- **Interpretation limits:** Similar response rates across groups don't rule out selection bias — it only means the non-response rate is similar, not that who answered is representative.
- **Where it's shown:** Findings → Analysis tab → Motivations, barriers & encouragement → "Reasons for not investing."
- **Source fields:**
  - `AA2_DD2` — "Top 3 Reasons for not investing in MF/ETF"

---

## 3. Encouragement percentages

*What they say could help.*

### Encouragement factors — Calculated

- **Question:** What would encourage respondents to invest?
- **Definition:** The share of respondents who selected each encouragement factor, out of everyone who answered this question.
- **What it tells us:** Shows which encouragement themes this group reports most often.
- **Why it matters:** Points to what respondents themselves say would help, as a starting point for product or content ideas.
- **Result:** "Simple and easy process for investing": 117 of 266 (44.0%), the top-ranked factor.
- **How it's calculated:**
  1. Start with the 553 people in the focused group.
  2. Keep only the 266 who gave a substantive answer to this question — the identical answer base as the barriers question.
  3. For each factor, count how many of those 266 selected it (respondents could pick up to 3).
  4. Divide that count by 266 and multiply by 100 for a percentage.
- **Worked example:** The top factor, "Simple and easy process for investing," was selected by 117 of the 266 answerers: 117 ÷ 266 × 100 = 44.0%.
- **Who's included:** Focused group, substantive answerers only. Multi-select, up to 3 per respondent; percentages sum to roughly 300%.
- **Missing/special handling:** 287 blank = missing/unknown, same routing rule as the barriers question.
- **Interpretation limits:** Stated preference only — doesn't show whether building it would change completion.
- **Where it's shown:** Findings → Analysis tab → Motivations, barriers & encouragement → "Encouragement factors."
- **Source fields:**
  - `AA3_DD3` — "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"

---

## 4. Previous investment and stopping reasons

*How experience differs within the group.*

### Previous investment experience — Calculated

- **Question:** Who in the focused group has invested before?
- **Definition:** The share of the focused group falling into each of 3 previous-investment categories.
- **What it tells us:** The focused group mixes three different investment histories; not a single undifferentiated "non-holder" group.
- **Why it matters:** Shows the group is not a single homogeneous "never invested" audience — messaging may need to differ by experience.
- **Result:** 136 of 553 (24.6%) are past mutual-fund investors — this is not a "first-time SIP users" sample.
- **How it's calculated:**
  1. Start with the full 553-person focused group.
  2. Sort each respondent into one of 3 categories: previously invested in mutual funds, no prior investment in any of the 7 listed securities products, or invested in another product but not mutual funds.
  3. Divide each category's count by 553 and multiply by 100.
- **Worked example:** 136 of 553 report previous mutual-fund investment: 136 ÷ 553 × 100 = 24.6%.
- **Who's included:** Full focused group, all 553 answered.
- **Missing/special handling:** 0 blank.
- **Interpretation limits:** "None of the above" means none of these 7 securities-market products — not "no prior investment in anything" (FDs, insurance, EPF, gold aren't asked about here).
- **Where it's shown:** Findings → Analysis tab → Overview, and Conclusions & next steps.
- **Source fields:**
  - `Q24A` — "Could you please tell me if you have ever invested in these products in the past"

### Reasons for stopping investment — Calculated

- **Question:** Why did respondents stop investing in MF/ETF?
- **Definition:** The share of a small group of respondents who selected each reason for stopping investment, out of everyone who answered this question.
- **What it tells us:** The 64 counts themselves are verified; it's who exactly was asked this question that's uncertain, not the counts.
- **Why it matters:** Surfaces candidate reasons people lapse, while being upfront that the answer base is small and its population uncertain.
- **Result:** See chart — a small group of 64 respondents, 16 reasons (64 of 553 answered).
- **How it's calculated:**
  1. Start with the 553 people in the focused group.
  2. Keep only the 64 who gave a substantive answer to this question.
  3. For each reason, count how many of those 64 selected it (respondents could pick up to 3).
  4. Divide that count by 64 and multiply by 100 for a percentage.
- **Worked example:** The joint top reasons, "News of geopolitical uncertainty and fear of market fall" and "Lower than expected returns," were each selected by 22 of the 64 answerers: 22 ÷ 64 × 100 = 34.4%.
- **Who's included:** Focused group, substantive answerers only. Multi-select, up to 3 per respondent; percentages sum to roughly 300%.
- **Missing/special handling:** 489 blank = missing/unknown, cause unresolved.
- **Interpretation limits:** Read as its own small answer base of 64 — not confirmed to be a subset of the 136 past MF investors. A related, more strictly-defined question (`A15_D15`) has only 1 answer across all 553, so routing to this question doesn't track prior-investment status in any simple way.
- **Where it's shown:** Findings → Analysis tab → Motivations, barriers & encouragement → "Reasons for stopping investment."
- **Source fields:**
  - `AA4_DD4` — "What were the Top 3 reasons you stopped investing in MF/ETF"

### Further detail on why investors stopped — Needs clarification

- **Question:** Is there more specific detail on why investors lapsed?
- **Definition:** A more narrowly defined follow-up question on reasons for not investing, intended for respondents who lapsed in roughly the last year.
- **Why unavailable:** Only 1 of 553 respondents answered this related, already-available field, so who it was meant for — and whether it can be used at all — is unclear.
- **What it tells us:** Not usable as a measure until that's resolved.
- **Who's included:** Unclear.
- **Missing/special handling:** 552 of 553 blank.
- **Interpretation limits:** Excluded from substantive interpretation anywhere on this dashboard.
- **Source fields:**
  - `A15_D15` — "You have not invested in MF/ETF in the last 1 year. Top 3 Reasons are for not investing"

---

## 5. Risk-preference distributions

*How respondents describe their preferences and reactions.*

### Risk / return preference — Calculated

- **Question:** What risk/return preference does the focused group report?
- **Definition:** The share of the focused group selecting each risk/return preference option.
- **What it tells us:** Context on how this sample describes its own risk appetite.
- **Why it matters:** Gives context on how cautious or growth-oriented this group says it is, useful alongside the fear-of-loss barrier finding.
- **Result:** 38.2% say "preservation of capital is more important to me than returns."
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered this question.
  2. For each risk-preference option, count how many chose it.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** 211 of 553 chose "Preservation of capital is more important to me than returns": 211 ÷ 553 × 100 = 38.2%.
- **Who's included:** Full focused group.
- **Missing/special handling:** No blanks observed.
- **Interpretation limits:** Self-described preference, not observed investing behavior.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Investment preferences and reactions.
- **Source fields:**
  - `QRT` — "Which of the following best describes your preference when considering returns from investments?"

### Reaction to a market downturn — Calculated

- **Question:** How does the focused group say it would react to a downturn?
- **Definition:** The share of the focused group selecting each hypothetical downturn-reaction option.
- **What it tells us:** Context on self-reported downturn sensitivity, alongside the fear-of-loss barrier finding.
- **Why it matters:** Shows how this group says it would react under stress, as context for the fear-of-loss barrier finding.
- **Result:** 36.2% say they'd stay invested and wait for recovery; 22.8% say they'd be very worried and might stop investing.
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered this question.
  2. For each reaction option, count how many chose it.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** 200 of 553 chose "I understand these things happen. I'll keep my money invested and wait for the market to recover": 200 ÷ 553 × 100 = 36.2%.
- **Who's included:** Full focused group.
- **Missing/special handling:** No blanks observed.
- **Interpretation limits:** A stated hypothetical reaction, not observed behavior during an actual downturn.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Investment preferences and reactions.
- **Source fields:**
  - `Q10M` — "Reaction to Market Downturn"

---

## 6. "Not Aware" percentages

*Which knowledge statements attract more reported uncertainty.*

### Financial-knowledge battery — Calculated

- **Question:** Which financial topics carry the most reported uncertainty?
- **Definition:** The share of the focused group selecting "Not Aware" for each of 9 financial-knowledge statements.
- **What it tells us:** Ranks topics by reported uncertainty — never confidence, accuracy, or a literacy score.
- **Why it matters:** Flags which topics carry the most reported uncertainty — candidates for investor-education content.
- **Result:** See chart — 9 statements, ranked by share selecting "Not Aware" (553 per item).
- **How it's calculated:**
  1. Keep all 553 respondents for each of the 9 statements — everyone answered every item.
  2. For a given statement, count how many selected "Not Aware."
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** The statement with the most reported uncertainty, "Investments across different asset classes increase risk," had 261 of 553 select "Not Aware": 261 ÷ 553 × 100 = 47.2%.
- **Who's included:** Full focused group.
- **Missing/special handling:** "Not Aware" is an explicit selected response, kept as its own category. No documented answer key exists for this battery, so no item is scored correct/incorrect.
- **Interpretation limits:** Cannot establish overall financial literacy or why any respondent hasn't invested. Distinct from `Q12M` (see Context measures), which has one arithmetically correct answer.
- **Where it's shown:** Findings → Analysis tab → Knowledge and reported uncertainty.
- **Source fields:**
  - `GRIDxQ15AM[{_1}].Q15AM` — "Direct plans in mutual funds have a lower expense ratio than regular plans"
  - `GRIDxQ15AM[{_2}].Q15AM` — "A portion of investments in pension/provident funds is invested in the stock market"
  - `GRIDxQ15AM[{_3}].Q15AM` — "The concept of compounding is beneficial in the short term"
  - `GRIDxQ15AM[{_4}].Q15AM` — "KYC can be completed online"
  - `GRIDxQ15AM[{_5}].Q15AM` — "Need to open a Demat account to invest in securities in addition to trading account"
  - `GRIDxQ15AM[{_6}].Q15AM` — "Investment options that offer high returns are also associated with high-risk"
  - `GRIDxQ15AM[{_7}].Q15AM` — "Investments across different asset classes increase risk"
  - `GRIDxQ15AM[{_8}].Q15AM` — "CAS (Consolidated Account statement) provides overview of investments in Securities/stock market — Equity, Mutual Funds, Bonds, Government Securities, NPS, NIR, etc. held in demat and folio form"
  - `GRIDxQ15AM[{_9}].Q15AM` — "BSDA (Basic service demat account) allows you to have a demat account with nil or negligible charges when your investment holdings are below a certain amount"

---

## 7. Differences between groups

*How responses vary by income, experience and other supported characteristics.*

### Barriers by previous experience — Calculated

- **Question:** Do reported barriers differ by previous investing experience?
- **Definition:** A comparison of barrier-selection percentages across the three previous-investment groups.
- **What it tells us:** Suggests barrier messaging could be segmented by prior experience rather than treated as one group.
- **Why it matters:** Tests whether one barrier message fits everyone, or whether experience-based segments need different messaging.
- **Result:** "Lack of trust in fund managers" ranks top among past MF investors but mid-ranked among those with no prior investment (61 / 188 / 17 — counts only for the smallest group).
- **How it's calculated:**
  1. Split the focused group into 3 experience groups based on `Q24A`.
  2. Within each group, keep only those who substantively answered the barriers question.
  3. For a given barrier, divide its count within a group by that group's own answerer count and multiply by 100.
- **Worked example:** "Lack of trust in fund managers": 19 of 61 past MF investors (19 ÷ 61 × 100 = 31.1%) vs. 39 of 188 with no prior investment (39 ÷ 188 × 100 = 20.7%).
- **Who's included:** Focused group, split by previous-investment class.
- **Missing/special handling:** Response rates checked before comparing (44.9–49.2% for the two reportable groups).
- **Interpretation limits:** No significance test; similar response rates are a precondition, not proof either group is representative.
- **Where it's shown:** Findings → Analysis tab → Differences between groups → "Barriers by previous MF experience."
- **Source fields:**
  - `AA2_DD2` — "Top 3 Reasons for not investing in MF/ETF"
  - `Q24A` — "Could you please tell me if you have ever invested in these products in the past"

### Encouragement by previous experience — Calculated

- **Question:** Do encouragement factors differ by previous investing experience?
- **Definition:** A comparison of encouragement-selection percentages across the three previous-investment groups.
- **What it tells us:** Education content may matter more to respondents with no prior securities-market investment.
- **Why it matters:** Shows where encouragement content might need to differ by prior experience.
- **Result:** "Better education on how mutual funds work" shows the largest gap: 40.4% (no prior investment) vs. 24.6% (past MF investors).
- **How it's calculated:**
  1. Split the focused group into the same 3 experience groups used for the barriers comparison.
  2. Within each group, keep only those who substantively answered the encouragement question.
  3. For a given factor, divide its count within a group by that group's own answerer count and multiply by 100.
- **Worked example:** "Better education on how mutual funds work": 76 of 188 with no prior investment (76 ÷ 188 × 100 = 40.4%) vs. 15 of 61 past MF investors (15 ÷ 61 × 100 = 24.6%).
- **Who's included:** Focused group, split by previous-investment class.
- **Missing/special handling:** Same response-rate caveats as the barriers-by-experience comparison.
- **Interpretation limits:** No significance test; descriptive only.
- **Where it's shown:** Findings → Analysis tab → Differences between groups → "Encouragement by previous MF experience."
- **Source fields:**
  - `AA3_DD3` — "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"
  - `Q24A` — "Could you please tell me if you have ever invested in these products in the past"

### Barriers by income — Calculated

- **Question:** Do reported barriers differ by income?
- **Definition:** A comparison of barrier-selection percentages across three income bands.
- **What it tells us:** The only barrier with a clear, step-by-step gap across income bands in this sample.
- **Why it matters:** Checks whether a barrier's importance changes with income, which could inform who sees which messaging.
- **Result:** Fear of losing money rises with income tier: 25.8% → 32.4% → 42.5% across the three income bands (120 / 74 / 40).
- **How it's calculated:**
  1. Group the focused group into income bands, decided before any barrier result was examined.
  2. Within each band, keep only those who substantively answered the barriers question.
  3. For a given barrier, divide its count within a band by that band's own answerer count and multiply by 100.
- **Worked example:** "Fear of losing money due to market risks": 31 of 120 in the "Up to ₹20,000" band (31 ÷ 120 × 100 = 25.8%) vs. 17 of 40 in the "Above ₹40,000" band (17 ÷ 40 × 100 = 42.5%).
- **Who's included:** Focused group, grouped into income bands decided before any result was examined.
- **Missing/special handling:** Response rates are more uneven across income bands (39.2–55.0%) than across experience groups (44.9–49.2%) — stated plainly, not smoothed over.
- **Interpretation limits:** One reasonable income grouping among others; no significance test; uneven response rates across bands.
- **Where it's shown:** Findings → Analysis tab → Differences between groups → "Barriers by income tier."
- **Source fields:**
  - `AA2_DD2` — "Top 3 Reasons for not investing in MF/ETF"
  - `Q10A` — "And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall?"

### Percentage-point differences between groups — Calculated

- **Question:** How large are the gaps between groups in the comparisons above?
- **Definition:** The arithmetic gap, in percentage points, between two groups' percentages for the same option.
- **What it tells us:** Quantifies the size of a gap already shown in a comparison — descriptive only.
- **Why it matters:** Turns a comparison into one plain number that's easy to scan and compare across rows.
- **Result:** See each comparison — e.g. +15.8pp for the education-demand gap by experience.
- **How it's calculated:**
  1. Take two group percentages from a comparison above that both have at least 30 answerers.
  2. Subtract the smaller percentage from the larger one.
  3. The result is the gap in percentage points (pp) — not a percent change.
- **Worked example:** For "Better education on how mutual funds work": 40.4% − 24.6% = 15.8 percentage points.
- **Who's included:** Same as the underlying comparison.
- **Missing/special handling:** No difference shown for any pair where either side is counts-only.
- **Interpretation limits:** No significance test; does not imply either group's characteristic causes the difference.
- **Where it's shown:** Findings → Analysis tab → Differences between groups (attached to each comparison row).
- **Source fields:** `AA2_DD2`, `AA3_DD3`, `Q24A`, `Q10A` (derived arithmetic on the comparisons above — no separate field wording).

### Risk preference and fear of losing money — Calculated

- **Question:** Do respondents with different risk preferences select "fear of losing money" at different rates?
- **Definition:** A cross-tabulation of risk-preference groups against selection of "fear of losing money" as a barrier, among the same respondents.
- **What it tells us:** The share selecting fear of losing money ranges from 28.0% to 35.4% across the reportable risk-preference groups, with no consistent rise or fall from more to less risk-averse groups.
- **Why it matters:** Checks whether a respondent's own stated risk preference lines up with reporting this specific barrier.
- **Result:** Weak, inconsistent pattern — no clear gradient by stated risk preference (28.0%–35.4% across groups, n=266).
- **How it's calculated:**
  1. Keep the 266 respondents who substantively answered the barriers question.
  2. Split them by their own risk-preference answer.
  3. Within each risk-preference group, count how many also selected "fear of losing money," and divide by that group's size.
- **Worked example:** Among the 48 respondents who said they aim for higher returns but couldn't accept significant losses, 17 also selected "fear of losing money": 17 ÷ 48 × 100 = 35.4%.
- **Who's included:** The 266 substantive `AA2_DD2` answerers.
- **Missing/special handling:** Restricted to respondents who substantively answered the barriers question; no blanks in the risk-preference field itself.
- **Interpretation limits:** Describes an association observed in this sample, not a cause. The group expressing some risk tolerance selected this barrier slightly more (35.4%) than the two more risk-averse groups (28.0%, 28.1%) — the opposite of what a simple story would predict, so read as inconclusive rather than a trend.
- **Where it's shown:** Findings → Analysis tab → Relationships between reported answers.
- **Source fields:**
  - `QRT` — "Which of the following best describes your preference when considering returns from investments?"
  - `AA2_DD2` — "Top 3 Reasons for not investing in MF/ETF"

### Fund-fee knowledge and demand for education — Calculated

- **Question:** Do respondents less sure about mutual-fund expense ratios ask for more education?
- **Definition:** A cross-tabulation of one knowledge-item response against selection of "better education" as an encouragement factor, among the same respondents.
- **What it tells us:** No consistent knowledge-gap pattern for this specific fact.
- **Why it matters:** Tests one specific, pre-chosen knowledge gap against demand for education, rather than a general literacy claim.
- **Result:** Weak, mixed pattern: respondents who selected Not Aware ask for education slightly more (40.0%) than those who selected True (37.8%), but those who selected False ask for it least (25.6%) (n=266).
- **How it's calculated:**
  1. Keep the 266 respondents who substantively answered the encouragement question.
  2. Split them by their answer to one knowledge-battery item, chosen before looking at any result.
  3. Within each response group, count how many also selected "better education," and divide by that group's size.
- **Worked example:** Among the 172 respondents who selected True for direct plans having a lower expense ratio, 65 also selected "better education": 65 ÷ 172 × 100 = 37.8%.
- **Who's included:** The 266 substantive `AA3_DD3` answerers.
- **Missing/special handling:** No blanks in the knowledge item; restricted to substantive `AA3_DD3` answerers.
- **Selection rules:** This one item was chosen before looking at any result, as the single item most specifically about mutual-fund product mechanics, rather than testing all 9 items and reporting the largest gap.
- **Interpretation limits:** Describes an association in this sample, not a cause; only this one item was tested, not general financial knowledge.
- **Where it's shown:** Findings → Analysis tab → Relationships between reported answers.
- **Source fields:**
  - `GRIDxQ15AM[{_1}].Q15AM` — "Direct plans in mutual funds have a lower expense ratio than regular plans"
  - `AA3_DD3` — "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"

### Online-KYC knowledge and a simpler process — Calculated

- **Question:** Do respondents who know KYC can be done online ask for a simpler process at a different rate?
- **Definition:** A cross-tabulation of the online-KYC knowledge item against selection of "simple and easy process" as an encouragement factor, among the same respondents.
- **What it tells us:** In this sample, 45.2% of respondents who selected True asked for a simpler process, compared with 43.3% who selected False — a 1.9 percentage-point difference (True minus False), too small to call a meaningful pattern.
- **Why it matters:** Checks whether awareness that KYC can be completed online is associated with a different rate of asking for a simpler process.
- **Result:** 45.2% who selected True asked for a simpler process, vs. 43.3% who selected False — a 1.9pp gap (n=266).
- **How it's calculated:**
  1. Keep the 266 respondents who substantively answered the encouragement question.
  2. Split them by their answer on the online-KYC knowledge item.
  3. Within each response group, count how many also selected "simple and easy process," and divide by that group's size.
- **Worked example:** Among the 208 respondents who knew KYC can be done online, 94 also selected "simple and easy process": 94 ÷ 208 × 100 = 45.2%.
- **Who's included:** The 266 substantive `AA3_DD3` answerers.
- **Missing/special handling:** No blanks in the knowledge item; restricted to substantive `AA3_DD3` answerers.
- **Interpretation limits:** Describes an association in this sample, not a cause; the gap is small enough to be inconclusive.
- **Where it's shown:** Findings → Analysis tab → Relationships between reported answers.
- **Source fields:**
  - `GRIDxQ15AM[{_4}].Q15AM` — "KYC can be completed online"
  - `AA3_DD3` — "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"

---

## 8. Learning preferences

*Which education topics, formats and channels respondents prefer.*

### Learning preferences — Calculated

- **Question:** What format, medium, language and topics does the focused group prefer for investor education?
- **Definition:** The share of the focused group selecting each preferred medium, format, language and topic for investor education.
- **What it tells us:** Candidate format/channel/topic choices if INDmoney builds education content.
- **Why it matters:** Guides format/channel choices if INDmoney builds investor-education content.
- **Result:** Videos (72.5%) and social-media posts (59.9%) are the top-selected formats; Hindi (34.0%) and English (25.5%) the top languages.
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered these fields.
  2. For a given format, medium, language or topic, count how many selected it (medium/format/topic allow up to 3 selections).
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** The top format, "Videos," was selected by 401 of 553: 401 ÷ 553 × 100 = 72.5%.
- **Who's included:** Full focused group.
- **Missing/special handling:** No blanks observed.
- **Interpretation limits:** Stated preference only — not evidence of which format would be most effective.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Knowledge and learning preferences.
- **Source fields:**
  - `Q20CM` — "Please let me know what your preferred medium would be to receive the investor education program (top 3)"
  - `Q20DM` — "Could you please share your preferred format for receiving the investor education program (top 3)"
  - `Q20E` — "In which language would you prefer investor education programmes to be conducted?"
  - `Q20F` — "Which topics should be covered in these investor education programs to enhance financial awareness and decision-making?"

---

## 9. Context measures

*Calculated, but describing the sample rather than a primary research indicator. Income and the validated income-allocation measure are the clearest examples.*

### Personal income — Calculated

- **Question:** What is the focused group's personal income?
- **Definition:** The share of the focused group falling into each personal-income band.
- **What it tells us:** Sample context, and the grouping variable for the income-based barrier comparison.
- **Why it matters:** Provides the grouping variable used in the income-based barrier comparison, and general sample context.
- **Result:** See chart — income bands, ₹15,001–₹20,000/month is the largest single band (18.8%).
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered.
  2. For each income band, count how many respondents fall into it.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** The largest single band, "₹15,001–₹20,000," was reported by 104 of 553: 104 ÷ 553 × 100 = 18.8%.
- **Who's included:** Full focused group.
- **Missing/special handling:** "Do not wish to disclose" and "No current income" kept as their own categories, never folded into a numeric band.
- **Interpretation limits:** This is personal income (all sources, before tax), never household income or "salary," and not disposable income.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Education, work and household circumstances.
- **Source fields:**
  - `Q10A` — "And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall?"

### Income allocation — Calculated

- **Question:** How does the focused group say it allocates its income?
- **Definition:** The share of answerers reporting each percentage-of-income band, separately for 5 budget categories.
- **What it tells us:** Each category's distribution is now individually reliable — but the five are not validated as one consistent personal budget.
- **Why it matters:** Gives a validated, blank-aware picture of reported budgeting — useful context, not a combined budget total.
- **Result:** See chart — 5 separate distributions (expenses, savings, loans, investments, other), each with its own real blank rate (517–534 of 553 per category).
- **How it's calculated:**
  1. For one category (e.g. savings), start from the raw percentage-of-income answer, keeping blanks as blank rather than as "0%."
  2. Group the non-blank answers into 10-point bands (1–10%, 11–20%, and so on).
  3. For a given band, divide its count by the number who answered that category (not 553) and multiply by 100.
- **Worked example:** For "savings," 253 of the 532 who answered reported allocating 11–20% of income: 253 ÷ 532 × 100 = 47.6%.
- **Who's included:** Full focused group.
- **Missing/special handling:** Recomputed from the raw numeric field, not the derived `Q1M_DP` field, which silently converted "not administered" into a "0%" category (confirmed: e.g. the investments category shows 32 genuinely blank vs. 75 previously shown as "0%").
- **Interpretation limits:** Do not sum or subtract these five bands to estimate disposable income — no check exists that a respondent's five answers are jointly consistent as a single budget.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Income allocation.
- **Source fields:**
  - `Q1MXGrid[{_1}].Q1M` — "Monthly Expenses (e.g., rent, utilities, groceries, transportation, medical)"
  - `Q1MXGrid[{_2}].Q1M` — "Savings (e.g., savings accounts, emergency funds)"
  - `Q1MXGrid[{_3}].Q1M` — "Loan Repayments (e.g., home loan EMIs, personal loan repayments, car loan installments, credit card)"
  - `Q1MXGrid[{_4}].Q1M` — "Investments (e.g., stocks, mutual funds, real estate, gold, retirement products)"
  - `Q1MXGrid[{_5}].Q1M` — "Other Expenses (e.g., dining out, travel, hobbies, entertainment, luxury purchases)"

### Financial goals — Calculated

- **Question:** Which financial goals does the focused group prioritize?
- **Definition:** The share of the focused group ranking each financial goal anywhere in their top 3 priorities.
- **What it tells us:** Shows which financial goals this group ranks as priorities — useful context, not a motivation for MF specifically.
- **Why it matters:** Same as above.
- **Result:** Growing wealth (42.5%) and supporting family members (37.3%) are the two most commonly top-3-ranked goals (553 of 553 answered).
- **How it's calculated:**
  1. Keep all 553 respondents — everyone ranked at least one goal.
  2. For a given goal, count how many respondents placed it anywhere in their top 3.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** The top goal, "Growing wealth," was ranked in the top 3 by 235 of 553: 235 ÷ 553 × 100 = 42.5%.
- **Who's included:** Full focused group; all 553 have at least one non-blank slot. Each respondent ranks up to 3 goals (1st/2nd/3rd); reported here as "ranked in top 3," not by rank position.
- **Missing/special handling:** 0 respondents used the free-text "Others" 13th slot; shown as its own separate 0% row.
- **Interpretation limits:** Does not test whether a respondent's ranked goals connect to their reported MF motivations — that comparison wasn't run.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Financial goals.
- **Source fields:**
  - `Q6_RANK_GRID.Q6_RANK` — 13 ranked goal items, e.g. "Buying a house," "Growing wealth," "Supporting family members" (each respondent ranks up to 3)

### Awareness sources and media — Calculated

- **Question:** What sources and media does the focused group report for awareness of MF/ETF?
- **Definition:** The share of a subset of the focused group reporting each awareness source and medium.
- **What it tells us:** Shows which channels are already reaching this group — not whether that source caused them to invest.
- **Why it matters:** Shows which channels already reach this group — useful for placing future content, though it can't show what caused anyone to invest.
- **Result:** "Friends, Family, and Colleagues" (57.9%) and social media (57.5%) are the top-reported source and medium (n=266).
- **How it's calculated:**
  1. Keep only respondents who gave a valid (non-blank) answer to this specific awareness question — 266 of 553.
  2. For a given source or medium, count how many of those 266 selected it.
  3. Divide that count by 266 and multiply by 100.
- **Worked example:** The top source, "Friends, Family, and Colleagues," was selected by 154 of 266: 154 ÷ 266 × 100 = 57.9%.
- **Who's included:** Focused group, restricted to valid answerers of this awareness question — independently confirmed (by comparing exact respondent sets) to be the identical 266 who answer the barriers question, not assumed from it. Multi-select, open-ended count per respondent; percentages sum to more than 100%.
- **Missing/special handling:** 287 blank = not part of this answer base, same routing as the barriers question.
- **Interpretation limits:** Cannot show whether a reported source caused investment consideration, and cannot separate mutual funds from ETFs for this population — the survey has no mutual-fund-only version of this question for non-holders.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Reported awareness sources and media.
- **Source fields:**
  - `Q4_Q5_NONInv_Filt[{_1_2}].Q4M` — "MF+ETF — Sources of Awareness"
  - `Q4_Q5_NONInv_Filt[{_1_2}].Q5M` — "MF+ETF — Media of Awareness"

### Investor-education attendance — Calculated

- **Question:** Has the focused group attended an investor-education program?
- **Definition:** The share of the focused group reporting each level of investor-education program attendance.
- **What it tells us:** Baseline context for any future education-content proposal.
- **Why it matters:** Gives a baseline for any future investor-education proposal.
- **Result:** 527 of 553 (95.3%) report not having attended any investor-education program.
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered.
  2. Count how many selected each attendance option.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** 527 of 553 selected "Have not attended any investor education program": 527 ÷ 553 × 100 = 95.3%.
- **Who's included:** Full focused group.
- **Missing/special handling:** No blanks observed.
- **Interpretation limits:** Independently reconfirmed directly from the raw survey data.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Knowledge and learning preferences.
- **Source fields:**
  - `Q20AM` — "There are Investor Education Programmes run by prominent institutions/Industry Associations (SEBI, NISM, Stock Exchanges, Depositories, AMFI, etc.) Please let me know if you have attended any of these investor education programs"

### Self-reported stock-market familiarity — Calculated

- **Question:** How familiar does the focused group say it is with stock markets?
- **Definition:** The share of the focused group selecting each level of self-reported stock-market familiarity.
- **What it tells us:** Context alongside the knowledge-battery findings.
- **Why it matters:** Same as above.
- **Result:** 41.0% say they're "familiar… and update myself periodically"; 8.1% say "Don't Know."
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered.
  2. Count how many selected each familiarity option.
  3. Divide that count by 553 and multiply by 100.
- **Worked example:** 227 of 553 selected "I am familiar with the stock markets and update myself periodically on its movements": 227 ÷ 553 × 100 = 41.0%.
- **Who's included:** Full focused group.
- **Missing/special handling:** No blanks observed.
- **Interpretation limits:** A self-rating, not a tested measure of familiarity or competence.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Investment preferences and reactions.
- **Source fields:**
  - `Q11M` — "How familiar are you with investing in stock markets?"

### Inflation numeracy check — Calculated

- **Question:** Can respondents work out that a return below inflation is a real-terms loss?
- **Definition:** The share of the focused group correctly recognizing that a return below inflation is a real-terms loss.
- **What it tells us:** A distinct, simple numeracy check — separate from the 9-item knowledge battery, which has no correct-answer key at all.
- **Why it matters:** A simple, distinct numeracy check to compare against the undocumented 9-item battery.
- **Result:** 245 of 553 (44.3%) answer correctly ("Less than today").
- **How it's calculated:**
  1. Keep all 553 respondents — everyone answered.
  2. Mark "Less than today" as correct (the only arithmetically correct answer, since a 5% return is below 6% inflation) and every other answer as incorrect.
  3. Divide the correct count by 553 and multiply by 100.
- **Worked example:** 245 of 553 answered correctly: 245 ÷ 553 × 100 = 44.3%.
- **Who's included:** Full focused group.
- **Missing/special handling:** "Do not know" and "Refuse to answer" are scored incorrect, not treated as missing.
- **Interpretation limits:** One numeracy question, not a general literacy score; distinct from the undocumented 9-item battery, which is never scored.
- **Where it's shown:** Findings → "Who is in our sample?" tab → Knowledge and learning preferences.
- **Source fields:**
  - `Q12M` — "Suppose the rate of return on your savings is 5% per year and inflation is 6% per year — after a year, will you be able to buy more, less, or the same as today with this money?"

### Current MF holding (broader group) — Calculated

- **Question:** How many of the broader survey group of salaried Gen Z respondents already hold mutual funds?
- **Definition:** The share of the broader 4,346-person salaried-Gen-Z group who currently hold mutual funds, among those with a known holding status.
- **What it tells us:** Context only — describes the broader survey group, not the non-holders this page otherwise studies.
- **Why it matters:** Gives context on how common MF holding already is beyond the focused (non-holder) group this page otherwise studies.
- **Result:** Context: 32.9% of the 4,346-person broader group hold mutual funds — this is not the 553-person focused group.
- **How it's calculated:**
  1. Start with the 4,346-person broader group (salaried Gen Z, regardless of MF consideration).
  2. Exclude the 3 respondents with an unknown/unrecorded holding status, leaving 4,343 with a known status.
  3. Divide the number holding mutual funds by 4,343 and multiply by 100.
- **Worked example:** 1,427 of 4,343 with a known status hold mutual funds: 1,427 ÷ 4,343 × 100 = 32.9%.
- **Who's included:** Broader group (salaried Gen Z, n = 4,346) — not the focused group this page otherwise studies.
- **Missing/special handling:** Unknown/not-answered status excluded from the denominator, never counted as not-holding.
- **Interpretation limits:** Not a market-wide MF penetration estimate; unweighted.
- **Where it's shown:** Dataset and Method → How we narrowed the dataset (sample-selection funnel) — `/dataset-and-method#how-we-selected-the-sample`.
- **Source fields:**
  - `Q22A_All` — "Which of the following financial products do you currently hold investments in"

---

## Limitations (apply across all groups above)

- No INDmoney activity records of any kind — no app opens, no screens viewed, no clicks.
- No observed onboarding or SIP-setup journey — where people actually stop in INDmoney's own product is unknown from this data.
- No first-SIP conversion or payment data — whether anyone who considered mutual funds went on to invest through INDmoney is not observable here.
- No evidence that any proposed change would work — conclusions are ideas worth testing, not validated fixes.
- The survey only asks non-holders about awareness sources for mutual funds and ETFs combined — there is no mutual-fund-only version of that question.
- Income-allocation categories are individually reliable but not validated as one consistent personal budget — never summed into a disposable-income figure.
- Every result is unweighted and descriptive — no significance testing, no causal claims, and not a population estimate.

## Source of truth

All content above is restated from `src/lib/research-plan-data.ts` (`MEASURES`, `KEY_RESEARCH_INDICATORS`, `CONTEXT_MEASURE_IDS`, `LIMITATIONS`), which itself consolidates `docs/research_and_measurement_plan.md`, `docs/analysis_coverage_checklist.md`, `docs/segment_findings.md`, `docs/survey_schema_reference.md`, and `analysis/05_supplementary_measures.ipynb`. If a number changes there, update it here too.
