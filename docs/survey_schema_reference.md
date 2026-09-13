# Survey Schema Reference — SEBI Investor Survey 2025 (Respondent Workbook)

Every column in `data/raw/Respondent Data.XLSX` (448 total, 109,430 respondent records), grouped by topic, with a few observed example values per field — generated for planning what else could be shown or analyzed, not itself a new analysis.

- **Wording** is the row-2 source description (verbatim, cleaned of source-file HTML/encoding artifacts).
- **Example values** are read-only, aggregate value counts from the raw workbook (top values only), shown only for fields with 25 or fewer distinct values workbook-wide — never respondent-level data, never free text. A handful of low-cardinality fields (e.g. `M10`) are themselves multi-select, so their "distinct values" are comma-joined combinations, not atomic options — shown as observed, not yet tokenized like the barrier fields (see `docs/data_inspection.md` for why that tokenizer is needed before treating these as separate options).
- **Used in Findings?** means the field is already surfaced *somewhere* on the site (as of this document's generation) — see `scripts/export_dataset_method_data.py`, `scripts/export_demographics_psychographics.py`, and `scripts/export_respondent_table.py`. This is not the same as "used as a finding": `A11_D11`–`A15_D15`, for example, show `Yes` because they appear in the Dataset & Method coverage table — explicitly marked *not used* there (wrong population / unresolved routing per `docs/barrier_coverage.md`), not because any chart is built from them.
- Fields already covered in `docs/data_inspection.md`, `docs/cohort_definition.md`, and `docs/barrier_coverage.md` are not re-explained here beyond their wording and examples — see those docs for the verified cohort-definition and barrier-routing analysis.

## Contents

- [Identifiers & weights](#identifiers-weights)
- [Survey stage & sampling](#survey-stage-sampling)
- [Demographics](#demographics)
- [Investment awareness & attitudes](#investment-awareness-attitudes)
- [Perceptions of securities-market regulators (Q1B battery)](#perceptions-of-securities-market-regulators-q1b-battery)
- [Product consideration & holdings (all products)](#product-consideration-holdings-all-products)
- [MF+ETF barriers & encouragement (used in this study)](#mfetf-barriers-encouragement-used-in-this-study)
- [Media & internet habits](#media-internet-habits)
- [Risk attitude & financial literacy](#risk-attitude-financial-literacy)
- [Regulator/grievance awareness](#regulatorgrievance-awareness)
- [Investor education](#investor-education)
- [Monthly income allocation (used in this study)](#monthly-income-allocation-used-in-this-study)
- [Product journey: Stocks/Shares (not MF)](#product-journey-stocksshares-not-mf)
- [Product journey: Futures & Options (not MF)](#product-journey-futures-options-not-mf)
- [Product journey: REITs/InvITs (not MF)](#product-journey-reitsinvits-not-mf)
- [Product journey: Corporate Bonds (not MF)](#product-journey-corporate-bonds-not-mf)
- [Product journey: Alternate Investment Funds (not MF)](#product-journey-alternate-investment-funds-not-mf)
- [Barriers/behavior: other products (not MF+ETF)](#barriersbehavior-other-products-not-mfetf)
- [Repeated-slot grids](#repeated-slot-grids-one-row-per-item-usually-a-financial-product-sometimes-a-goal-or-a-time-horizon-label)

## Identifiers & weights

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Resp_ID_DP` | Resp_ID_DP | numeric | 109,430 / 109,430 | 109,430 | _(high-cardinality / not enumerated)_ | Yes |
| `UniqueId_DP` | UniqueId_DP | numeric | 109,430 / 109,430 | 109,430 | _(high-cardinality / not enumerated)_ | Yes |
| `WeightMainM2` | Weight (Group 2)(Main) | numeric | 53,357 / 109,430 | 318 | _(high-cardinality / not enumerated)_ | Yes |
| `Weight_to_Sample` | Weight (Sample) | numeric | 109,430 / 109,430 | 478 | _(high-cardinality / not enumerated)_ | Yes |

## Survey stage & sampling

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `QFL` | QFL: Final Investor – Non-Investor Classification | text | 109,430 / 109,430 | 2 | `NON-INVESTOR`; `INVESTOR` | Yes |
| `INT_TYPE` | INT_TYPE:  Type of Interview | text | 109,430 / 109,430 | 2 | `Random`; `Booster` | Yes |
| `QLISTMAIN` | QLISTMAIN: QLISTMAIN. Please select the applicable option based on the respondent’s willingness and qualification | text | 109,430 / 109,430 | 2 | `Close the interview with the Listing section only`; `Continue with the Mains section right now with MEP` | Yes |
| `MAIN_COMP_STATUS` | MAIN COMPLETE | text | 53,357 / 109,430 | 1 | `Main Complete` | Yes |

## Demographics

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `SELECTED_STATE` | Selected_State: | text | 109,430 / 109,430 | 34 | _(high-cardinality / not enumerated)_ | Yes |
| `URBANRURAL` | UrbanRural: Urban-Rural Classification | text | 109,430 / 109,430 | 2 | `Urban`; `Rural` | Yes |
| `Q1` | Q1: Gender | text | 109,430 / 109,430 | 2 | `Male`; `Female` | Yes |
| `SECNEW` | SECNEW: NCCS | text | 109,430 / 109,430 | 11 | `A3`; `B1`; `A2`; `B2` | Yes |
| `Zone_DP` | Zone_DP: | text | 109,430 / 109,430 | 4 | `WEST`; `SOUTH`; `NORTH`; `EAST` | Yes |
| `SELECTED_CLASS` | Selected_Class: | text | 109,430 / 109,430 | 10 | `10-40 Lakhs`; `More than 2500`; `5-10 Lakhs`; `2-5L` | No |
| `AOL_VAR_CENTRE` | AOL_Var_Centre: Centre | text | 109,430 / 109,430 | 1,385 | _(high-cardinality / not enumerated)_ | No |
| `CWE` | CWE: CWE. And can you now tell me who is the chief wage earner in the family i.e., the one who contributes the most to the household expense? | text | 109,430 / 109,430 | 2 | `The Respondent`; `Not the respondent / Another Family Member` | Yes |
| `Q3D` | Q3d: Q3d. Can you please tell me your education level? | text | 109,430 / 109,430 | 10 | `Graduate: General – (e.g. – BA/BCom/BSc)`; `12th Grade / Higher Secondary Board (e.g., HSC/ISC)`; `10th Grade / Secondary Board (e.g., SSC/CBSE/ICSE)`; `School - 5 to 9 years` | Yes |
| `Q5A` | Q5a: Q5a. Can you please tell me about your Family Type? | text | 109,430 / 109,430 | 3 | `Nuclear Family (Living only with your spouse/partner and children or only parents and/or siblings)`; `Joint Family (Living with extended family members, such as grandparents, uncles, aunts, cousins, or with your spouse/partner and children and parents and/or siblings, etc.)`; `Single Person Household` | Yes |
| `Q8` | Q8:  INTERVIEWER TO CHOOSE THE RESPONSE BASED ON OBSERVATION AND THEN CODE. DO NOT ASK THE RESPONDENT  Q8. Can you now tell me, what is the type of house that you live in? | text | 109,430 / 109,430 | 6 | `Independent House - A standalone residential structure, typically found in urban and suburban areas`; `Pucca House - Built using high-quality materials like bricks, cement, steel, and concrete, typically found in rural or semi-urban areas`; `Apartment - A residential unit in a multi-storied building, usually found in urban areas`; `Semi-Pucca House - A combination of both Pucca and Kutcha materials. For example, walls made of bricks, but the roof made of thatch` | Yes |
| `Q9` | Q9: Q9. Which of the following best describes the living arrangement for the house in which you stay currently? | text | 109,430 / 109,430 | 2 | `The house that I am staying in is owned by me/us`; `The house that I am staying in is rented by me/us` | Yes |
| `Q10` | Q10:  SHOW SCREEN TO RESPONDENT  Q10. Among the following broad groups, where does your Monthly Household Income from all sources before tax fall? Please consider income of all the | text | 109,430 / 109,430 | 15 | `Rs.20,001 – Rs. 30,000`; `Rs.15,001 – Rs. 20,000`; `Rs.10,001 – Rs. 15,000`; `Rs.30,001 – Rs. 40,000` | Yes |
| `Q10A` | Q10a:  SHOW SCREEN TO RESPONDENT  Q10a. And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall? Please consider only your in | text | 109,430 / 109,430 | 16 | `No current income (DO NOT AID THIS OPTION)`; `Rs.15,001 – Rs. 20,000`; `Rs.10,001 – Rs. 15,000`; `Rs.20,001 – Rs. 30,000` | Yes |
| `Q11` | Q11: Q11. What is your mother tongue? | text | 109,430 / 109,430 | 16 | `Hindi`; `Marathi`; `Tamil`; `Telugu` | Yes |
| `Q12` | Q12: Q12. Which faith or spiritual practice do you personally follow or identify with?  ASK THIS QUESTION ONLY IF THE RELIGION REMAINS UNCLEAR EVEN AFTER CODING THE NAME OF THE RESPONDENT. OTHERWISE, INTERVIEWER CAN DIRECTLY PROCEE | text | 109,430 / 109,430 | 10 | `Hinduism`; `Islam`; `Christianity`; `Sikhism` | Yes |
| `Q13` | Q13: Q13. What is your marital status? | text | 109,430 / 109,430 | 6 | `Married with kids`; `Single`; `Married without kids`; `Divorced/Separated with kids` | Yes |
| `Q13A` | Q13a: Could you please indicate if any (or all) of your children are financially dependent on you? By financial dependence, we mean they rely on you for financial support to cover their monthly expenses | text | 64,826 / 109,430 | 3 | `Yes`; `No`; `Choose not to answer (DO NOT AID THIS OPTION)` | No |
| `Q14` | Q14: Q14. What is your current primary occupation? | text | 109,430 / 109,430 | 36 | _(high-cardinality / not enumerated)_ | Yes |
| `QC1` | QC1: What type of Internet / data plan does your household have? | text | 109,430 / 109,430 | 56 | _(high-cardinality / not enumerated)_ | No |
| `Life_Stage` | Life_Stage | text | 109,430 / 109,430 | 4 | `Gen Z`; `Millennials`; `Generation X`; `Baby Boomers` | Yes |
| `CON_ISEC` | CON_ISEC: ISEC | text | 109,430 / 109,430 | 5 | `Upper Middle`; `Middle`; `High / Upper`; `Lower Middle` | No |

## Investment awareness & attitudes

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `QRT` | QRT: Which of the following best describes your preference when considering returns from investments? | text | 109,430 / 109,430 | 4 | `Preservation of capital (amount invested) is more important to me than returns.`; `I need to have good but stable and reliable returns with minimal losses`; `I aim for better, higher returns and realize that there will be some ups and downs in my investment, but I wouldn't be able to accept significant losses`; `I would like high returns and am not too concerned with risk. I am prepared for significant short-term losses to achieve better long-term returns` | Yes |
| `Q21A` | Q21a: Which of the following financial product(s) are you aware of? | text | 109,430 / 109,430 | 22,393 | _(high-cardinality / not enumerated)_ | Yes |
| `Q29` | Q29: Do you have a Demat account / Share Market trading account? | text | 109,430 / 109,430 | 3 | `No`; `Yes`; `Can’t remember (DO NOT AID THIS OPTION)` | Yes |
| `Q1A` | Q1A: Are you aware of the entities that are directly involved in regulating or operating the securities market in India? | text | 53,357 / 109,430 | 129 | _(high-cardinality / not enumerated)_ | Yes |

## Perceptions of securities-market regulators (Q1B battery)

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `g_Q1B[{_1}].Q1B` | Are well regulated : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |
| `g_Q1B[{_2}].Q1B` | Are strong enough to handle ups and downs in the markets : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |
| `g_Q1B[{_3}].Q1B` | Offer new avenues and instrument to invest : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |
| `g_Q1B[{_4}].Q1B` | Are accessible to investors like me : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |
| `g_Q1B[{_5}].Q1B` | Offer good opportunities for wealth creation : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |
| `g_Q1B[{_6}].Q1B` | Are easy and convenient to invest in : Q1B | text | 53,357 / 109,430 | 6 | `Strongly Agree`; `Slightly Agree`; `Neither Agree Nor Disagree`; `Don’t Know / Can’t Say` | Yes |

## Product consideration & holdings (all products)

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Q24A` | Q24a: Could you please tell me if you have ever invested in these products in the past | text | 38,583 / 109,430 | 90 | _(high-cardinality / not enumerated)_ | Yes |
| `Q23A` | Q23a: Future Consideration for Selective Financial Products Not Invested in Currently | text | 38,607 / 109,430 | 103 | _(high-cardinality / not enumerated)_ | Yes |
| `Q25A` | Q25a: Which of the following financial products will you never consider investing in the future? | text | 34,727 / 109,430 | 129 | _(high-cardinality / not enumerated)_ | Yes |
| `Q22A_All` | Q22A_All: Which of the following financial products do you currently hold investments in | text | 109,430 / 109,430 | 2,840 | _(high-cardinality / not enumerated)_ | Yes |

## MF+ETF barriers & encouragement (used in this study)

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `A11_D11` | A11_D11:MF+ETF - Frequently you invest in MF/ETF. | text | 13,862 / 109,430 | 6 | `Once a month or more`; `Quarterly`; `Annually`; `Half Yearly` | Yes |
| `A12_D12` | A12_D12: MF+ETF - What you think are the expected returns for Mutual Funds | text | 13,862 / 109,430 | 8 | `10% - 15%`; `8% - 10%`; `5% - 8%`; `15% - 20%` | Yes |
| `A13_D13` | A13_D13:MF+ETF - What challenges do you face before/ while making fresh investment in MF/ETF | text | 13,862 / 109,430 | 543 | _(high-cardinality / not enumerated)_ | Yes |
| `A14_D14` | A14_D14:  What challenges do you face after making investment in Mutual Funds | text | 13,862 / 109,430 | 254 | _(high-cardinality / not enumerated)_ | Yes |
| `A15_D15` | A15_D15: You have not invested in MF/ETF in the last 1 year. Top 3 Reasons are for not investing | text | 5,710 / 109,430 | 500 | _(high-cardinality / not enumerated)_ | Yes |
| `AA1_DD1` | AA1_DD1:MF+ETF - Top 3 Primary reasons for considering investing in MF/ETFs. | text | 3,168 / 109,430 | 731 | _(high-cardinality / not enumerated)_ | Yes |
| `AA2_DD2` | AA2_DD2:MF+ETF - Top 3 Reasons for not investing in MF/ETF | text | 18,223 / 109,430 | 807 | _(high-cardinality / not enumerated)_ | Yes |
| `AA3_DD3` | AA3_DD3:MF+EF - Factors would encourage you to consider investing in MF/ETF that you currently do not invest in | text | 18,223 / 109,430 | 137 | _(high-cardinality / not enumerated)_ | Yes |
| `AA4_DD4` | AA4_DD4: What were the TOp 3 reasons you stopped investing in MF/ETF. | text | 1,381 / 109,430 | 354 | _(high-cardinality / not enumerated)_ | Yes |

## Media & internet habits

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `M1A` | M1a: M1a. How often do you watch Television? | text | 53,357 / 109,430 | 8 | `1 – 2 hours daily`; `Less than 1 hour a day`; `Don't watch / Listen / Read`; `More than 3 hours a day` | No |
| `M1B` | M1b: M1b. How often do you listen to radio / FM? | text | 53,357 / 109,430 | 8 | `Don't watch / Listen / Read`; `1 – 2 hours daily`; `Less than 1 hour a day`; `2-3 times a week` | No |
| `M1C` | M1c: M1c. How often do you read newspapers/magazines? | text | 53,357 / 109,430 | 8 | `Don't watch / Listen / Read`; `Less than 1 hour a day`; `1 – 2 hours daily`; `2-3 times a week` | No |
| `M1D` | M1d: M1d. How often do you use internet? | text | 53,357 / 109,430 | 8 | `More than 3 hours a day`; `1 – 2 hours daily`; `Less than 1 hour a day`; `Does not an internet` | No |
| `M2` | M2:  SHOW SCREEN  M2. From the list below please select all the genres/categories of TV channels that you watch  MULTI CODING | text | 44,032 / 109,430 | 1,597 | _(high-cardinality / not enumerated)_ | No |
| `M3` | M3:  SHOW SCREEN  M3. In which of these time bands do you listen to the Radio? | text | 9,176 / 109,430 | 258 | _(high-cardinality / not enumerated)_ | No |
| `M4` | M4:  READ OUT THE OPTIONS  M4. In which language do you typically read newspapers/magazine? | text | 31,016 / 109,430 | 3 | `Regional Language`; `Both`; `English` | No |
| `M5` | M5:  READ OUT THE OPTIONS  M5. Do you read newspaper/magazine online or offline? | text | 31,016 / 109,430 | 3 | `Offline`; `Both`; `Online` | No |
| `M7` | M7:  SHOW SCREEN  M7. Can you please let us know which of the following activities have you done using internet/data in the last one month?  MULTI CODING | text | 51,423 / 109,430 | 1,838 | _(high-cardinality / not enumerated)_ | No |
| `M8` | M8: M8. Which apps/website do you use to watch videos on demand/OTT?  MULTI CODING | text | 18,894 / 109,430 | 131 | _(high-cardinality / not enumerated)_ | No |
| `M9` | M9: M9. Which social media apps/website do you use?  MULTI CODING | text | 33,009 / 109,430 | 27 | _(high-cardinality / not enumerated)_ | No |
| `M10` | M10:  SHOW SCREEN  M10. Which of the below financial activities do you perform on the internet?  MULTI CODING | text | 20,754 / 109,430 | 10 | `I use payment apps like Paytm, Google Pay, BHIM, etc.`; `Visit Banking websites/app,I use payment apps like Paytm, Google Pay, BHIM, etc.`; `Visit Banking websites/app,I use payment apps like Paytm, Google Pay, BHIM, etc.,I keep track of financial market through financial websites like Moneycontrol, Value Research, Live Mint, Bloomberg Quint etc.`; `I use payment apps like Paytm, Google Pay, BHIM, etc.,I keep track of financial market through financial websites like Moneycontrol, Value Research, Live Mint, Bloomberg Quint etc.` | No |

## Risk attitude & financial literacy

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Q10M` | Q10M: Q10 Reaction to Market Downturn | text | 53,357 / 109,430 | 4 | `I would be a bit worried and may take out some money from the market.`; `I would be very worried. I might stop investing in the market and move my money to safer options like fixed deposits.`; `I understand these things happen. I’ll keep my money invested and wait for the market to recover.`; `I’ll invest more now so I can earn better returns when the market goes up again.` | Yes |
| `Q10M_POSTCODE` | Q10M_PostCode: | text | 53,357 / 109,430 | 3 | `High`; `Medium`; `Low` | No |
| `Q11M` | Q11M: Q11. How familiar are you with investing in stock markets? | text | 53,357 / 109,430 | 4 | `Don't Know`; `I am familiar with the stock markets and update myself periodically on its movements.`; `I know a little about the stock markets and their broader market trends.`; `I am very familiar with the stock markets. I follow them on a regular basis` | Yes |
| `Q12M` | Q12M: Q12. Suppose the rate of return on your savings is 5% per year guaranteed and inflation is 6% per year. After a year, with this savings, do you think you will be able to buy...? | text | 53,357 / 109,430 | 5 | `Less than today`; `Exactly as today`; `More than today`; `Do not know` | Yes |
| `Q13M` | Q13M: | text | 53,357 / 109,430 | 3 | `Low Knowledge`; `Medium Knowledge`; `High Knowledge` | No |

## Regulator/grievance awareness

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Q16M` | Q16M: Q16. In case of any grievances whom would you approach first? | text | 53,357 / 109,430 | 4 | `Police`; `My Broker`; `SEBI`; `Others (please specify)` | No |
| `Q17M` | Q17M: Q17. Are you aware of SEBI’s grievance redressal mechanism (SCORES Website (www.scores.gov. in) / Toll Free Helpline No. (1800 266 7575 or 1800 22 7575)/ SEBI Offices) | text | 53,357 / 109,430 | 2 | `No`; `Yes` | No |

## Investor education

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Q20AM` | Q20AM: Q20A. There are Investor Education Programmes run by prominent institutions/Industry Associations (SEBI, NISM, Stock Exchanges, Depositories, AMFI, etc.) Please let me know if you have attended any of these investor education programs | text | 53,357 / 109,430 | 3 | `Have not attended any investor education program`; `Yes, attended it online (webinars / virtual training sessions)`; `Yes, attended it in-person (seminars / workshops)` | Yes |
| `Q20BM` | Q20BM:  READ OUT OPTION  Q20B. According to you, what is the effectiveness of the awareness programmes in your investment decision making? | text | 1,102 / 109,430 | 3 | `Somewhat useful`; `Highly useful`; `Not useful` | No |
| `Q20CM` | Q20CM:  READ OUT OPTION  Q20C. Please let me know what your preferred medium would be to receive the investor education program? Select top 3 | text | 53,357 / 109,430 | 81 | _(high-cardinality / not enumerated)_ | Yes |
| `Q20DM` | Q20DM:  READ OUT OPTION  Q20D. Could you please share your preferred format for receiving the investor education program? Select top 3 | text | 53,357 / 109,430 | 34 | _(high-cardinality / not enumerated)_ | Yes |
| `Q20E` | Q20E: Q20E. In which language would you prefer these investor education programmes to be conducted? | text | 53,357 / 109,430 | 17 | `Hindi`; `English`; `Tamil`; `Marathi` | Yes |
| `Q20F` | Q20F: Q20F. Which topics should be covered in these investor education programs to enhance financial awareness and decision-making? | text | 53,357 / 109,430 | 144 | _(high-cardinality / not enumerated)_ | Yes |

## Monthly income allocation (used in this study)

| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |
|---|---|---|---|---|---|---|
| `Q1M_DP[{_1}].Q1M` | 'Monthly Expenses (e.g., rent, utilities, groceries, transportation, medical)' : Q1M: Allocation of monthly income | mixed(numeric+text) | 109,430 / 109,430 | 11 | `0.0`; `21-30%`; `11-20%`; `41-50%` | Yes |
| `Q1M_DP[{_2}].Q1M` | 'Savings (e.g., savings accounts, emergency funds)' : Q1M: Allocation of monthly income | mixed(numeric+text) | 109,430 / 109,430 | 10 | `0.0`; `11-20%`; `1-10%`; `21-30%` | Yes |
| `Q1M_DP[{_3}].Q1M` | 'Loan Repayments (e.g., home loan EMIs, personal loan repayments, car loan installments, credit card bills)' : Q1M: Allocation of monthly income | mixed(numeric+text) | 109,430 / 109,430 | 10 | `0.0`; `1-10%`; `11-20%`; `21-30%` | Yes |
| `Q1M_DP[{_4}].Q1M` | 'Investments (e.g., stocks, mutual funds, real estate, gold, retirement products)' : Q1M: Allocation of monthly income | mixed(numeric+text) | 109,430 / 109,430 | 9 | `0.0`; `1-10%`; `11-20%`; `21-30%` | Yes |
| `Q1M_DP[{_5}].Q1M` | 'Other Expenses (e.g., dining out, travel, hobbies, entertainment, luxury purchases)' : Q1M: Allocation of monthly income | mixed(numeric+text) | 109,430 / 109,430 | 11 | `0.0`; `11-20%`; `1-10%`; `21-30%` | Yes |

## Product journey: Stocks/Shares (not MF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `SS_B1` | SS_B1:  SHOW SCREEN  B1. What sources did you reach- out / use to gather information when you first decided to invest in stocks or shares? Please select top 3   MULTI CODING & | 5,593 / 109,430 | 159 | _(high-cardinality / not enumerated)_ |
| `SS_B10` | SS_B10:  SHOW SCREEN  B10. Could you please tell me what your current reasons are for investing in stocks/shares? Please select your top 3 reasons  MULTI CODING | 9,797 / 109,430 | 858 | _(high-cardinality / not enumerated)_ |
| `SS_B11` | SS_B11: B11. Please tell me how frequently you invest in stock/shares?  SINGLE CODING | 9,797 / 109,430 | 6 | `Once a month or more`; `Quarterly`; `Half Yearly`; `Annually` |
| `SS_B12` | SS_B12: B12. Could you please tell me what you think are the expected returns for stock/ shares?  SINGLE CODING | 9,797 / 109,430 | 8 | `8% - 10%`; `10% - 15%`; `5% - 8%`; `15% - 20%` |
| `SS_B13` | SS_B13:  SHOW SCREEN  B13. What challenges do you face before/ while making fresh investment in stock/shares? Please select your top 3 challenges faced  MULTI CODING </fon | 9,797 / 109,430 | 523 | _(high-cardinality / not enumerated)_ |
| `SS_B14` | SS_B14:  SHOW SCREEN  B14. What challenges do you face after</ b> making investment in stock/shares? Please select your top 3 challenges faced  MULTI CODING < | 9,797 / 109,430 | 222 | _(high-cardinality / not enumerated)_ |
| `SS_B15` | SS_B15:  SHOW SCREEN  B15. You have not invested in stock/shares in the last 1 year. Could you please tell me what are the reasons for not investing in stock/shares anymore?  Please select top 3 reasons</b& | 3,883 / 109,430 | 424 | _(high-cardinality / not enumerated)_ |
| `SS_B2` | SS_B2:  SHOW SCREEN  B2. Could you please tell me your reasons for deciding to start investments in stocks/shares? Please select top 3 reasons  MULTI CODIN | 5,593 / 109,430 | 783 | _(high-cardinality / not enumerated)_ |
| `SS_B3` | SS_B3:  SHOW SCREEN  B3. What are your usual sources to gather information related to Stocks/ Shares? Please select top 3   MULTI CODING | 9,797 / 109,430 | 159 | _(high-cardinality / not enumerated)_ |
| `SS_B4` | SS_B4: B4. You mentioned that you follow Social Media Influencers to get information for stocks/ shares. Which platform do you use to follow them?  MULTI CODING | 5,067 / 109,430 | 40 | _(high-cardinality / not enumerated)_ |
| `SS_B5` | SS_B5:  SHOW SCREEN  B5. How credible do you find the financial influencers you follow on social media?  SINGLE CODING | 5,067 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `SS_B6` | SS_B6: Role of financial influencers in decision making | 5,067 / 109,430 | 3 | `Yes, but only some of my investments are basis their recommendations`; `No, I follow them only to learn and then decide basis my own analysis/ understanding`; `Yes, most of my investments are basis their recommendations` |
| `SS_B7` | SS_B7:  SHOW SCREEN  B7. When you invest in stocks/shares, what types of information do you look for? Top 3  MULTI CODING | 9,797 / 109,430 | 358 | _(high-cardinality / not enumerated)_ |
| `SS_BB1` | SS_BB1: What are your primary reasons for considering investing in stock market products | 1,775 / 109,430 | 614 | _(high-cardinality / not enumerated)_ |
| `SS_BB2` | SS_BB2:  SHOW SCREEN  BB2. What are your reasons for not investing in stocks/shares? Please select top 3 reasons  MULTI CODING | 14,794 / 109,430 | 791 | _(high-cardinality / not enumerated)_ |
| `SS_BB3` | SS_BB3:  SHOW SCREEN  BB3. What factors would encourage you to consider investing in stocks/shares that you currently do not invest in? Please select top 3 reasons < font color='Red'> MULTI COD | 14,794 / 109,430 | 124 | _(high-cardinality / not enumerated)_ |
| `SS_BB4` | SS_BB4:  SHOW SCREEN  BB4. What were the reasons you stopped investing in stock/shares? Please select top 3 reasons  MULTI CODING | 921 / 109,430 | 282 | _(high-cardinality / not enumerated)_ |

## Product journey: Futures & Options (not MF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `FO_C1` | FO_C1:  SHOW SCREEN  C1. What sources did you reach- out to / use to gather information when you first decided to invest in Future & Options? Please select top 3   MULTI CODIN | 245 / 109,430 | 103 | _(high-cardinality / not enumerated)_ |
| `FO_C10` | FO_C10:  SHOW SCREEN  C10. Could you please tell me what your current reasons are for investing in F&Os? Please select top 3 reasons  MULTI CODING | 581 / 109,430 | 269 | _(high-cardinality / not enumerated)_ |
| `FO_C11` | FO_C11: C11. Please tell me how frequently you invest in Futures & Options?  SINGLE CODING | 581 / 109,430 | 6 | `Once a month or more`; `Quarterly`; `Daily`; `Half Yearly` |
| `FO_C12` | FO_C12: C12. Could you please tell me what you think are the expected returns for Futures & Options?  SINGLE CODING | 581 / 109,430 | 8 | `8% - 10%`; `10% - 15%`; `5% - 8%`; `15% - 20%` |
| `FO_C13` | FO_C13:  SHOW SCREEN  C13. What challenges do you face before/ while making fresh investment in Futures & Options? Please select your top 3 challenges faced  MULTI CODING < | 581 / 109,430 | 220 | _(high-cardinality / not enumerated)_ |
| `FO_C14` | FO_C14:  SHOW SCREEN  C14. What challenges do you face after</ b> making investment in Futures & Options? Please select your top 3 challenges faced  MULTI CODI | 581 / 109,430 | 150 | _(high-cardinality / not enumerated)_ |
| `FO_C15` | FO_C15:  SHOW SCREEN  C15. You have not invested in Futures & Options in the last 1 year. Could you please tell me what the reasons are for not investing in futures & options anymore? Please select top 3 reaso | 227 / 109,430 | 125 | _(high-cardinality / not enumerated)_ |
| `FO_C2` | FO_C2:  SHOW SCREEN  C2. Could you please tell me the reasons for deciding to invest in Future & Options? Please select top 3 reasons  MULTI CODING </fon | 245 / 109,430 | 177 | _(high-cardinality / not enumerated)_ |
| `FO_C3` | FO_C3:  SHOW SCREEN  C3. What are your usual sources to gather information related to Future & Options? Please select top 3   MULTI CODING | 581 / 109,430 | 148 | _(high-cardinality / not enumerated)_ |
| `FO_C4` | FO_C4: C4. You mentioned that you follow Social Media Influencers to get information for Future & Options. Which platform do you use to follow them?  MULTI CODING | 275 / 109,430 | 21 | `YouTube,Instagram,Facebook`; `YouTube`; `YouTube,Instagram`; `YouTube,Facebook` |
| `FO_C5` | FO_C5:  SHOW SCREEN  C5. How credible do you find the financial influencers you follow on social media?  SINGLE CODING | 275 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `FO_C6` | FO_C6:  READ OUT OPTIONS FROM THE SCREEN  C6. You mentioned that you follow financial influencers on social media, select the most appropriate option.  SINGLE CODING | 275 / 109,430 | 3 | `No, I follow them only to learn and then decide basis my own analysis/ understanding`; `Yes, but only some of my investments are basis their recommendations`; `Yes, most of my investments are basis their recommendations` |
| `FO_C7` | FO_C7:  SHOW SCREEN  C7. When you invest in Future & Options, what types of information do you look for? Top 3  MULTI CODING | 581 / 109,430 | 188 | _(high-cardinality / not enumerated)_ |
| `FO_CC1` | FO_CC1:  SHOW SCREEN  CC1. What are your primary reasons for considering investing in F&Os ? Please select top 3 reasons  MULTI CODING | 166 / 109,430 | 134 | _(high-cardinality / not enumerated)_ |
| `FO_CC2` | FO_CC2:  SHOW SCREEN  CC2. What are your reasons for not investing in F&Os? Please select top 3 reasons  MULTI CODING | 2,861 / 109,430 | 590 | _(high-cardinality / not enumerated)_ |
| `FO_CC3` | FO_CC3:  SHOW SCREEN  CC3. What factors would encourage you to consider investing in F&Os that you currently do not invest in? Please select top 3 reasons  MULTI CODING </f | 2,861 / 109,430 | 119 | _(high-cardinality / not enumerated)_ |
| `FO_CC4` | FO_CC4:  SHOW SCREEN  CC4. What were the reasons you stopped investing in futures & options? Please select top 3 reasons  MULTI CODING | 117 / 109,430 | 85 | _(high-cardinality / not enumerated)_ |

## Product journey: REITs/InvITs (not MF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `REIT_INVIT_E1` | REIT_InvIT_E1:  SHOW SCREEN  E1. What sources did you reach out to / use to gather information when you first decided to invest in REITs and/or InvITs? Please select top 3   M | 204 / 109,430 | 89 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E10` | REIT_InvIT_E10:  SHOW SCREEN  E10. Could you please tell me what your current reasons are for investing in REITs and/or InvITs? Please select top 3 reasons < font color='Red'> MULTI CODING < | 511 / 109,430 | 371 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E11` | REIT_InvIT_E11: E11. Please tell me how frequently you invest in REITs and/or InvITs? < font color='Red'> SINGLE CODING | 511 / 109,430 | 5 | `Quarterly`; `Half Yearly`; `Once a month or more`; `Annually` |
| `REIT_INVIT_E12` | REIT_InvIT_E12: E12. Could you please tell me what you think are the expected returns for REITs and/or InvITs?  SINGLE CODING | 511 / 109,430 | 8 | `10% - 15%`; `8% - 10%`; `5% - 8%`; `15% - 20%` |
| `REIT_INVIT_E13` | REIT_InvIT_E13:  SHOW SCREEN  E13. What challenges do you face before/while making fresh investment in REITs and/or InvITs? Please select your top 3 challenges faced  MULTI CO | 511 / 109,430 | 260 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E14` | REIT_InvIT_E14:  SHOW SCREEN  E14. What challenges do you face after making investment in REITs and/or InvITs? Please select your top 3 challenges faced</ b>  M | 511 / 109,430 | 164 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E15` | REIT_InvIT_E15:  SHOW SCREEN  E15. You have not invested in REITS AND/OR INVITS in the last 1 year. Could you please tell me what the reasons are for not investing in REITS AND/OR INVITS anymore? Please select | 288 / 109,430 | 164 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E2` | REIT_InvIT_E2:  SHOW SCREEN  E2. Could you please tell me your reasons for deciding to start investments in REITs and/or InvITs? Please select top 3 reasons | 204 / 109,430 | 185 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E3` | REIT_InvIT_E3:  SHOW SCREEN  E3. What are your usual sources to gather information related to REITs and/or InvITs? Please select top 3   MULTI CODING | 511 / 109,430 | 136 | _(high-cardinality / not enumerated)_ |
| `REIT_INVIT_E4` | REIT_InvIT_E4: E4. You mentioned that you follow Social Media Influencers to get information for REITs and/or InvITs. Which platform do you use to follow them?  MULTI CODING | 237 / 109,430 | 21 | `YouTube,Instagram,Facebook`; `YouTube`; `YouTube,Instagram`; `YouTube,Facebook` |
| `REIT_INVIT_E5` | REIT_InvIT_E5:  SHOW SCREEN  E5. How credible do you find the financial influencers you follow on social media?  SINGLE CODING | 237 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `REIT_INVIT_E6` | REIT_InvIT_E6:  READ OUT OPTIONS FROM THE SCREEN  E6. You mentioned that you follow financial influencers on social media, select the most appropriate option.  SINGLE CODING | 237 / 109,430 | 3 | `Yes, but only some of my investments are basis their recommendations`; `Yes, most of my investments are basis their recommendations`; `No, I follow them only to learn and then decide basis my own analysis/ understanding` |
| `REIT_INVIT_E7` | REIT_InvIT_E7:  SHOW SCREEN  E7. When you invest in REITs and/or InvITs, what types of information do you look for? Top 3  MULTI CODING | 511 / 109,430 | 240 | _(high-cardinality / not enumerated)_ |
| `RI_EE1` | RI_EE1:  SHOW SCREEN  EE1. What are your primary reasons for considering investing in REITS AND/OR INVITS? Please select top 3 reasons  MULTI CODING | 364 / 109,430 | 288 | _(high-cardinality / not enumerated)_ |
| `RI_EE2` | RI_EE2:  SHOW SCREEN  EE2. What are your reasons for not investing in REITS AND/OR INVITS? Please select top 3 reasons  MULTI CODING </ font> | 4,448 / 109,430 | 722 | _(high-cardinality / not enumerated)_ |
| `RI_EE3` | RI_EE3:  SHOW SCREEN  EE3. What factors would encourage you to consider investing in REITS AND/OR INVITS that you currently do not invest in? Please select top 3 reasons</ b>  MUL | 4,448 / 109,430 | 120 | _(high-cardinality / not enumerated)_ |
| `RI_EE4` | RI_EE4:  SHOW SCREEN  EE4. What were the reasons you stopped investing in REITS AND/OR INVITS? Please select top 3 reasons  MULTI CODING </ font> | 145 / 109,430 | 111 | _(high-cardinality / not enumerated)_ |

## Product journey: Corporate Bonds (not MF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `GC_BONDS_F1` | GC_Bonds_F1:  SHOW SCREEN  F1. What sources did you reach out to / use to gather information when you first decided to invest in Corporate bonds? Please select top 3 </ b>  MULTI | 128 / 109,430 | 75 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F10` | GC_Bonds_F10:  SHOW SCREEN  F10. Could you please tell me what your current reasons are for investing in Corporate bonds? Please select top 3 reasons  MULTI CODING </font&g | 313 / 109,430 | 223 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F11` | GC_Bonds_F11: F11. Please tell me how frequently you invest in Corporate bonds?  SINGLE CODING | 313 / 109,430 | 5 | `Quarterly`; `Half Yearly`; `Annually`; `Once a month or more` |
| `GC_BONDS_F12` | GC_Bonds_F12: F12. Could you please tell me what you think are the expected returns for Corporate bonds?  SINGLE CODING | 313 / 109,430 | 8 | `10% - 15%`; `8% - 10%`; `5% - 8%`; `15% - 20%` |
| `GC_BONDS_F13` | GC_Bonds_F13:  SHOW SCREEN  F13. What challenges do you face before/while making fresh investment in Corporate bonds? Please select your top 3 challenges faced < font color='Red'> MULTI CODING | 313 / 109,430 | 194 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F14` | GC_Bonds_F14:  SHOW SCREEN  F14. What challenges do you face after making investment in Corporate bonds? Please select your top 3 challenges faced  MULTI CO | 313 / 109,430 | 118 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F15` | GC_Bonds_F15:  SHOW SCREEN  F15. You have not invested in Corporate bonds in the last 1 year. Could you please tell me what the reasons are for not investing in Corporate bonds anymore? Please select top 3 rea | 160 / 109,430 | 119 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F2` | GC_Bonds_F2:  SHOW SCREEN  F2. Could you please tell me your reasons for deciding to start investments in Corporate bonds? Please select top 3 reasons  MULT | 128 / 109,430 | 105 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F3` | GC_Bonds_F3:  SHOW SCREEN  F3. What are your usual sources to gather information related to Corporate bonds? Please select top 3   MULTI CODING | 313 / 109,430 | 112 | _(high-cardinality / not enumerated)_ |
| `GC_BONDS_F4` | GC_Bonds_F4: F4. You mentioned that you follow Social Media Influencers to get information for Corporate bonds. Which platform do you use to follow them?  MULTI CODING | 131 / 109,430 | 21 | `YouTube,Instagram,Facebook`; `YouTube`; `YouTube,Instagram`; `YouTube,Facebook` |
| `GC_BONDS_F5` | GC_Bonds_F5:  SHOW SCREEN  F5. How credible do you find the financial influencers you follow on social media?  SINGLE CODING | 131 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `GC_BONDS_F6` | GC_Bonds_F6:  READ OUT OPTIONS FROM THE SCREEN  F6. You mentioned that you follow financial influencers on social media, select the most appropriate option.  SINGLE CODING | 131 / 109,430 | 3 | `Yes, most of my investments are basis their recommendations`; `Yes, but only some of my investments are basis their recommendations`; `No, I follow them only to learn and then decide basis my own analysis/ understanding` |
| `GC_BONDS_F7` | GC_Bonds_F7:  SHOW SCREEN  F7. When you invest in Corporate bonds, what types of information do you look for? Top 3  MULTI CODING | 313 / 109,430 | 175 | _(high-cardinality / not enumerated)_ |
| `GC_FF1` | GC_FF1:  SHOW SCREEN  FF1. What are your primary reasons for considering investing in Corporate Bonds? Please select top 3 reasons  MULTI CODING | 55 / 109,430 | 52 | _(high-cardinality / not enumerated)_ |
| `GC_FF2` | GC_FF2:  SHOW SCREEN  FF2. What are your reasons for not investing in Corporate Bonds? Please select top 3 reasons  MULTI CODING | 2,638 / 109,430 | 562 | _(high-cardinality / not enumerated)_ |
| `GC_FF3` | GC_FF3:  SHOW SCREEN  FF3. What factors would encourage you to consider investing in Corporate Bonds that you currently do not invest in? Please select top 3 reasons < font color='Red'> MULTI C | 2,638 / 109,430 | 121 | _(high-cardinality / not enumerated)_ |
| `GC_FF4` | GC_FF4:  SHOW SCREEN  FF4. What were the reasons you stopped investing in Corporate Bonds? Please select top 3 reasons  MULTI CODING | 65 / 109,430 | 56 | _(high-cardinality / not enumerated)_ |

## Product journey: Alternate Investment Funds (not MF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `AIF_G1` | AIF_G1:  SHOW SCREEN  G1. What sources did you reach out to / use to gather information when you first decided to invest in Alternative Investment Fund (AIF)? Please select top 3  <font color='Red | 38 / 109,430 | 28 | _(high-cardinality / not enumerated)_ |
| `AIF_G10` | AIF_G10:  SHOW SCREEN  G10. Could you please tell me what your current reasons are for investing in Alternative Investment Fund (AIF)? Please select top 3 reasons  MULTI CODIN | 83 / 109,430 | 66 | _(high-cardinality / not enumerated)_ |
| `AIF_G11` | AIF_G11: G11. Please tell me how frequently you invest in Alternative Investment Fund (AIF)? < font color='Red'> SINGLE CODING | 83 / 109,430 | 5 | `Half Yearly`; `Annually`; `Quarterly`; `Once a month or more` |
| `AIF_G12` | AIF_G12: G12. Could you please tell me what you think are the expected returns for Alternative Investment Fund (AIF)?  SINGLE CODING | 83 / 109,430 | 6 | `5% - 8%`; `10% - 15%`; `8% - 10%`; `15% - 20%` |
| `AIF_G13` | AIF_G13:  SHOW SCREEN  G13. What challenges do you face before/ while making fresh investment in Alternative Investment Fund (AIF)? Please select your top 3 challenges faced | 83 / 109,430 | 64 | _(high-cardinality / not enumerated)_ |
| `AIF_G14` | AIF_G14:  SHOW SCREEN  G14. What challenges do you face  after making investment in Alternative Investment Fund (AIF)? Please select your top 3 challenges faced <font color='Red | 83 / 109,430 | 67 | _(high-cardinality / not enumerated)_ |
| `AIF_G15` | AIF_G15:  SHOW SCREEN  G15. You have not invested in Alternative Investment Fund (AIF) in the last 1 year. Could you please tell me what the reasons are for not investing in Alternative Investment Fund (AIF) anymore? & | 52 / 109,430 | 44 | _(high-cardinality / not enumerated)_ |
| `AIF_G2` | AIF_G2:  SHOW SCREEN  G2. Could you please tell me your reasons for deciding to start investments in Alternative Investment Fund (AIF)? Please select top 3 reasons</ b> <font color= | 38 / 109,430 | 38 | _(high-cardinality / not enumerated)_ |
| `AIF_G3` | AIF_G3:  SHOW SCREEN  G3. What are your usual sources to gather information related to Alternative Investment Fund (AIF)? Please select top 3   MULTI CODING | 83 / 109,430 | 58 | _(high-cardinality / not enumerated)_ |
| `AIF_G4` | AIF_G4: G4. You mentioned that you follow Social Media Influencers to get information for Alternative Investment Fund (AIF). Which platform do you use to follow them?  MULTI CODING | 32 / 109,430 | 6 | `YouTube,Instagram,Facebook`; `YouTube`; `YouTube,Instagram,Facebook,Twitter/ X`; `YouTube,Instagram,Facebook,Twitter/ X,LinkedIn` |
| `AIF_G5` | AIF_G5: G5. How credible do you find the financial influencers you follow on social media?  SINGLE CODING | 32 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `AIF_G6` | AIF_G6:  READ OUT OPTIONS FROM THE SCREEN  G6. You mentioned that you follow financial influencers on social media, select the most appropriate option.  SINGLE CODING | 32 / 109,430 | 3 | `Yes, but only some of my investments are basis their recommendations`; `No, I follow them only to learn and then decide basis my own analysis/ understanding`; `Yes, most of my investments are basis their recommendations` |
| `AIF_G7` | AIF_G7:  SHOW SCREEN  G7. When you invest in Alternative Investment Fund (AIF), what types of information do you look for? Top 3  MULTI CODING </ font> | 83 / 109,430 | 73 | _(high-cardinality / not enumerated)_ |
| `AIF_GG1` | AIF_GG1:  SHOW SCREEN  GG1. What are your primary reasons for considering investing Alternative Investment Fund (AIF)? Please select top 3 reasons  MULTI CODING | 49 / 109,430 | 45 | _(high-cardinality / not enumerated)_ |
| `AIF_GG2` | AIF_GG2:  SHOW SCREEN  GG2. What are your reasons for not investing in Alternative Investment Fund (AIF) ? Please select top 3 reasons  MULTI CODING | 1,782 / 109,430 | 506 | _(high-cardinality / not enumerated)_ |
| `AIF_GG3` | AIF_GG3:  SHOW SCREEN  GG3. What factors would encourage you to consider investing in Alternative Investment Fund (AIF) that you currently do not invest in? Please select top 3 reasons <font color | 1,782 / 109,430 | 120 | _(high-cardinality / not enumerated)_ |
| `AIF_GG4` | AIF_GG4:  SHOW SCREEN  GG4. What were the reasons you stopped investing in Alternative Investment Fund (AIF)? Please select top 3 reasons  MULTI CODING | 55 / 109,430 | 52 | _(high-cardinality / not enumerated)_ |

## Barriers/behavior: other products (not MF+ETF)

| Code | Wording | Answered | Distinct | Example values |
|---|---|---|---|---|
| `A10_D10` | A10_D10:MF+ETF -  Top 3 Current reasons are for investing in MF/ETF | 13,862 / 109,430 | 928 | _(high-cardinality / not enumerated)_ |
| `A1_D1` | A1_D1:MF+ETF- Sources to gather information | 7,512 / 109,430 | 140 | _(high-cardinality / not enumerated)_ |
| `A2_D2` | A2_D2:MF+ETF - Top 3 Reasons for deciding to start investments | 7,512 / 109,430 | 861 | _(high-cardinality / not enumerated)_ |
| `A3_D3` | A3_D3: MF+ETF - Usual sources to gather information related to MF or ETF | 13,862 / 109,430 | 166 | _(high-cardinality / not enumerated)_ |
| `A4_D4` | A4_D4: Platform use to follow Social media Influencer | 7,360 / 109,430 | 36 | _(high-cardinality / not enumerated)_ |
| `A5_D5` | A5_D5: MF+ETF - How credible do you find the financial influencers you follow on social media | 7,360 / 109,430 | 4 | `Somewhat credible`; `Mostly credible`; `Very credible`; `Not credible at all` |
| `A6_D6` | A6_D6: MF+ETF - Role of financial influencers in decision making | 7,360 / 109,430 | 3 | `No, I follow them only to learn and then decide basis my own analysis/ understanding`; `Yes, but only some of my investments are basis their recommendations`; `Yes, most of my investments are basis their recommendations` |
| `A7_D7` | A7_D7:MF+EFT - When you invest in MF/ETF, what types of information do you look for | 13,862 / 109,430 | 285 | _(high-cardinality / not enumerated)_ |

## Repeated-slot grids (one row per item — usually a financial product, sometimes a goal or a time-horizon label)

Each family below repeats the same question once per item (up to 21 slots) — for most families the item is a financial product, but `Q6_RANK_GRID` repeats per financial *goal* and `GridxQ8M` repeats per time-horizon label (Short/Mid/Long Term) — the heading states the family's own verified parent question, not an assumption. Per `docs/data_inspection.md`, many slots are entirely blank in this fielding — only the item(s) shown with an answered count actually have data.

### GRIDxP1.P1 — For each of the financial product(s) that you currently hold an investment in, could you tell me the last time you made a fresh investment?

**`GRIDxP1.P1`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 592 / 109,430 | `Within the Last 1 Year`; `Within the Last 3 Years`; `More than 3 Years Ago` |
| slot `4` | Stocks / Shares | 10,104 / 109,430 | `Within the Last 1 Year`; `Within the Last 3 Years`; `More than 3 Years Ago` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 520 / 109,430 | `Within the Last 1 Year`; `More than 3 Years Ago`; `Within the Last 3 Years` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 322 / 109,430 | `Within the Last 1 Year`; `Within the Last 3 Years`; `More than 3 Years Ago` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 90 / 109,430 | `Within the Last 1 Year`; `Within the Last 3 Years`; `More than 3 Years Ago` |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF_ETF | 14,121 / 109,430 | `Within the Last 1 Year`; `Within the Last 3 Years`; `More than 3 Years Ago` |

### Q1MXGrid.Q1M — Q1M_1: TOTAL

**`Q1MXGrid.Q1M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `1` | Monthly Expenses (e.g., rent, utilities, groceries, transportation, medical) | 46,271 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `2` | Savings (e.g., savings accounts, emergency funds) | 45,319 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `3` | Loan Repayments (e.g., home loan EMIs, personal loan repayments, car loan installments, credit card bills) | 43,000 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `4` | Investments (e.g., stocks, mutual funds, real estate, gold, retirement products) | 44,410 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Other Expenses (e.g., dining out, travel, hobbies, entertainment, luxury purchases) | 44,820 / 109,430 | _(high-cardinality / not enumerated)_ |

### Q2MXGrid.Q2M — Q2M_1: TOTAL

**`Q2MXGrid.Q2M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 592 / 109,430 | `10.0`; `20.0`; `5.0`; `30.0` |
| slot `4` | Stocks / Shares | 10,104 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | 817 / 109,430 | `10.0`; `20.0`; `5.0`; `50.0` |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 520 / 109,430 | `10.0`; `20.0`; `100.0`; `25.0` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | 15,566 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `9` | Chit Fund | 2,277 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | 1,738 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `11` | Corporate Bonds | 322 / 109,430 | `10.0`; `100.0`; `20.0`; `50.0` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | 27,520 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | 785 / 109,430 | `10.0`; `20.0`; `5.0`; `50.0` |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | 7,629 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | 1,357 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | 8,118 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | 790 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `20` | Alternate Investment Fund (AIF) | 90 / 109,430 | `10.0`; `5.0`; `30.0`; `20.0` |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 14,121 / 109,430 | _(high-cardinality / not enumerated)_ |

### Q6_RANK_GRID.Q6_RANK — Q6_RANK

**`Q6_RANK_GRID.Q6_RANK`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `1` | Buying a house | 16,246 / 109,430 | `1.0`; `2.0`; `3.0` |
| slot `2` | Children's education | 24,129 / 109,430 | `1.0`; `2.0`; `3.0` |
| slot `3` | Planning for retirement | 9,193 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `4` | Building an emergency fund | 15,340 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `5` | Growing wealth | 18,115 / 109,430 | `1.0`; `2.0`; `3.0` |
| slot `6` | Saving for a major expense (e.g., purchasing car, vacation) | 10,838 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `7` | Generating passive income | 6,043 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `8` | Supporting family members | 23,132 / 109,430 | `3.0`; `1.0`; `2.0` |
| slot `9` | Achieving financial independence | 10,451 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `10` | My child's marriage | 13,364 / 109,430 | `2.0`; `3.0`; `1.0` |
| slot `11` | Optimizing tax savings and benefits | 4,720 / 109,430 | `3.0`; `1.0`; `2.0` |
| slot `12` | Earning money actively on a daily basis | 8,500 / 109,430 | `3.0`; `2.0`; `1.0` |
| slot `19` | Others | 249 / 109,430 | `3.0`; `1.0`; `2.0` |

### GridxQ7.Q7 — Q7 Investment Duration Classification

**`GridxQ7.Q7`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 10,397 / 109,430 | `Short Term`; `Mid Term`; `Long Term`; `DK/CS` |
| slot `4` | Stocks / Shares | 34,716 / 109,430 | `Mid Term`; `Long Term`; `Short Term`; `DK/CS` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 12,916 / 109,430 | `Long Term`; `Mid Term`; `Short Term`; `DK/CS` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 9,678 / 109,430 | `Mid Term`; `Long Term`; `Short Term`; `DK/CS` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 6,386 / 109,430 | `Long Term`; `Mid Term`; `DK/CS`; `Short Term` |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF_ETF | _all-blank in this fielding_ | — |

### GridxQ8M.Q8M — Q8 Definition of Short/Mid/Long Term

**`GridxQ8M.Q8M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `1` | Short Term | 53,357 / 109,430 | `More than 6 months - 1 year`; `More than 3 months - 6 months`; `More than 1 year - 3 years`; `1 - 3 months` |
| slot `2` | Mid Term | 53,353 / 109,430 | `More than 3 years - 5 years`; `More than 1 year - 3 years`; `More than 5 years - 7 years`; `More than 7 years - 10 years` |
| slot `3` | Long Term | 53,336 / 109,430 | `More than 10 years - 20 years`; `More than 7 years - 10 years`; `More than 5 years - 7 years`; `More than 20 years` |

### Q14M_RANK_GRID.Q14M_RANK — Q14_RANK

**`Q14M_RANK_GRID.Q14M_RANK`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 10,397 / 109,430 | `1.0`; `2.0`; `3.0`; `4.0` |
| slot `4` | Stocks / Shares | 34,716 / 109,430 | `1.0`; `2.0`; `3.0`; `4.0` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | _all-blank in this fielding_ | — |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | 31,330 / 109,430 | `4.0`; `3.0`; `5.0`; `2.0` |
| slot `11` | Corporate Bonds | 9,678 / 109,430 | `2.0`; `3.0`; `4.0`; `5.0` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | 52,922 / 109,430 | `1.0`; `2.0`; `3.0`; `4.0` |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | 39,101 / 109,430 | `2.0`; `3.0`; `1.0`; `4.0` |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | _all-blank in this fielding_ | — |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 38,792 / 109,430 | `2.0`; `1.0`; `3.0`; `4.0` |

### Q15M_RANK_GRID.Q15M_RANK — Q15_RANK

**`Q15M_RANK_GRID.Q15M_RANK`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 10,397 / 109,430 | `4.0`; `3.0`; `5.0`; `2.0` |
| slot `4` | Stocks / Shares | 34,716 / 109,430 | `1.0`; `2.0`; `3.0`; `4.0` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | _all-blank in this fielding_ | — |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | 31,330 / 109,430 | `3.0`; `4.0`; `5.0`; `2.0` |
| slot `11` | Corporate Bonds | 9,678 / 109,430 | `5.0`; `4.0`; `6.0`; `3.0` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | 52,922 / 109,430 | `1.0`; `2.0`; `3.0`; `4.0` |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | 39,101 / 109,430 | `2.0`; `1.0`; `3.0`; `4.0` |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | _all-blank in this fielding_ | — |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 38,792 / 109,430 | `2.0`; `1.0`; `3.0`; `4.0` |

### GRIDxQ15AM.Q15AM — Period of Last Investment for Selective Products

**`GRIDxQ15AM.Q15AM`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `1` | Direct plans in mutual funds have a lower expense ratio than regular plans | 53,357 / 109,430 | `TRUE`; `Not Aware`; `FALSE` |
| slot `2` | A portion of investments in pension/provident funds is invested in the stock market | 53,357 / 109,430 | `Not Aware`; `TRUE`; `FALSE` |
| slot `3` | The concept of compounding is beneficial in the short term | 53,357 / 109,430 | `Not Aware`; `FALSE`; `TRUE` |
| slot `4` | KYC can be completed online | 53,357 / 109,430 | `TRUE`; `Not Aware`; `FALSE` |
| slot `5` | Need to open a Demat account to invest in securities in addition to trading account | 53,357 / 109,430 | `TRUE`; `Not Aware`; `FALSE` |
| slot `6` | Investment options that offer high returns are also associated with high-risk | 53,357 / 109,430 | `TRUE`; `Not Aware`; `FALSE` |
| slot `7` | Investments across different asset classes increase risk | 53,357 / 109,430 | `Not Aware`; `TRUE`; `FALSE` |
| slot `8` | CAS (Consolidated Account statement) provides overview of investments in Securities/stock market.E.g. Equity, Mutual Funds, Bonds, Government Securities, NPS, NIR, etc. investment held in demat and folio form | 53,357 / 109,430 | `Not Aware`; `TRUE`; `FALSE` |
| slot `9` | BSDA (Basic service demat account) allows you to have a demat account with nil or negligible charges when your investment holdings are below a certain amount | 53,357 / 109,430 | `Not Aware`; `TRUE`; `FALSE` |

### Q2M_DP_Filt.Q2M — Q2M: Percentage you invest across the following investment products

**`Q2M_DP_Filt.Q2M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 754 / 109,430 | `1-10%`; `11-20%`; `0.0`; `21-30%` |
| slot `4` | Stocks / Shares | 13,751 / 109,430 | `0.0`; `91-100%`; `21-30%`; `11-20%` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | 1,385 / 109,430 | `0.0`; `1-10%`; `11-20%`; `21-30%` |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 640 / 109,430 | `1-10%`; `11-20%`; `0.0`; `21-30%` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | 25,904 / 109,430 | `0.0`; `11-20%`; `21-30%`; `41-50%` |
| slot `9` | Chit Fund | 4,007 / 109,430 | `0.0`; `11-20%`; `21-30%`; `1-10%` |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | 2,428 / 109,430 | `0.0`; `11-20%`; `21-30%`; `1-10%` |
| slot `11` | Corporate Bonds | 369 / 109,430 | `1-10%`; `91-100%`; `11-20%`; `0.0` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | 51,203 / 109,430 | `0.0`; `91-100%`; `41-50%`; `21-30%` |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | 1,292 / 109,430 | `0.0`; `1-10%`; `11-20%`; `21-30%` |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | 12,677 / 109,430 | `0.0`; `11-20%`; `21-30%`; `41-50%` |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | 2,192 / 109,430 | `0.0`; `1-10%`; `11-20%`; `21-30%` |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | 14,156 / 109,430 | `0.0`; `21-30%`; `11-20%`; `41-50%` |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | 971 / 109,430 | `1-10%`; `0.0`; `11-20%`; `21-30%` |
| slot `20` | Alternate Investment Fund (AIF) | 109 / 109,430 | `1-10%`; `0.0`; `21-30%`; `11-20%` |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 18,624 / 109,430 | `0.0`; `91-100%`; `21-30%`; `11-20%` |

### Q4_Q5_Inv_Filt.Q4M — Q4M:Sources of Awareness

**`Q4_Q5_Inv_Filt.Q4M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `1` | Mutual Funds (One-time Lumpsum / SIP) | 13,588 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `3` | Futures & Options (F&O) | 581 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `4` | Stocks / Shares | 9,797 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 511 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 313 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 83 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 13,862 / 109,430 | _(high-cardinality / not enumerated)_ |

### Q4_Q5_Inv_Filt.Q5M — Q5M: Media of Awareness

**`Q4_Q5_Inv_Filt.Q5M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `2` | Exchange Trade Funds (ETF) / Gold Exchange Trade Funds (Gold ETF) | 358 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `3` | Futures & Options (F&O) | 581 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `4` | Stocks / Shares | 9,797 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 511 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 313 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 83 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | _all-blank in this fielding_ | — |

### Q4_Q5_NONInv_Filt.Q4M — Q4M:Sources of Awareness

**`Q4_Q5_NONInv_Filt.Q4M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 2,861 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `4` | Stocks / Shares | 14,794 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 4,448 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 2,638 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 1,782 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 18,223 / 109,430 | _(high-cardinality / not enumerated)_ |

### Q4_Q5_NONInv_Filt.Q5M — Q5M: Media of Awareness

**`Q4_Q5_NONInv_Filt.Q5M`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 2,861 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `4` | Stocks / Shares | 14,794 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 4,448 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 2,638 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 1,782 / 109,430 | _(high-cardinality / not enumerated)_ |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF+ETF | 18,223 / 109,430 | _(high-cardinality / not enumerated)_ |

### ADI_Dashboard.Slice — Active/Dormant Investor Based Q22C and productwise for dashboard

**`ADI_Dashboard.Slice`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 592 / 109,430 | `Active Investor`; `Dormant Investor` |
| slot `4` | Stocks / Shares | 10,104 / 109,430 | `Active Investor`; `Dormant Investor` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | _all-blank in this fielding_ | — |
| slot `6` | National Pension System (NPS) | _all-blank in this fielding_ | — |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 520 / 109,430 | `Dormant Investor`; `Active Investor` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | _all-blank in this fielding_ | — |
| slot `9` | Chit Fund | _all-blank in this fielding_ | — |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | _all-blank in this fielding_ | — |
| slot `11` | Corporate Bonds | 322 / 109,430 | `Active Investor`; `Dormant Investor` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | _all-blank in this fielding_ | — |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | _all-blank in this fielding_ | — |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | _all-blank in this fielding_ | — |
| slot `15` | Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `16` | Employees Provident Fund (EPF) | _all-blank in this fielding_ | — |
| slot `17` | Portfolio Management Services (PMS) | _all-blank in this fielding_ | — |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | _all-blank in this fielding_ | — |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | _all-blank in this fielding_ | — |
| slot `20` | Alternate Investment Fund (AIF) | 90 / 109,430 | `Dormant Investor`; `Active Investor` |
| slot `21` | Specialized Investment Fund (SIF) | _all-blank in this fielding_ | — |
| slot `1_2` | MF_ETF | 14,121 / 109,430 | `Active Investor`; `Dormant Investor` |

### NI_Dashboard.Slice — NI_Dashboard: Non- Investor and productwise for dashboard

**`NI_Dashboard.Slice`**

| Slot | Item | Answered | Example values |
|---|---|---|---|
| slot `3` | Futures & Options (F&O) | 52,765 / 109,430 | `Not Aware`; `Non-Intenders`; `Intenders` |
| slot `4` | Stocks / Shares | 43,253 / 109,430 | `Non-Intenders`; `Not Aware`; `Intenders` |
| slot `5` | Gold Exchange Trade Funds (Gold ETF) | 53,357 / 109,430 | `Not Aware` |
| slot `6` | National Pension System (NPS) | 52,540 / 109,430 | `Not Aware`; `Non-Intenders` |
| slot `7` | Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT) | 52,837 / 109,430 | `Not Aware`; `Non-Intenders`; `Intenders` |
| slot `8` | Life insurance / Unit Linked Insurance Plans (ULIPS) | 37,791 / 109,430 | `Non-Intenders`; `Not Aware` |
| slot `9` | Chit Fund | 51,080 / 109,430 | `Not Aware`; `Non-Intenders` |
| slot `10` | Real Estate as an Investment (excluding where you are staying) | 51,619 / 109,430 | `Non-Intenders`; `Not Aware` |
| slot `11` | Corporate Bonds | 53,035 / 109,430 | `Not Aware`; `Non-Intenders`; `Intenders` |
| slot `12` | Fixed Deposits / Recurring Deposit / Bank Savings Account | 25,837 / 109,430 | `Non-Intenders`; `Not Aware` |
| slot `13` | Public Provident Fund (PPF) / Voluntary Provident Fund (VPF) | 52,572 / 109,430 | `Not Aware`; `Non-Intenders` |
| slot `14` | Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC) | 45,728 / 109,430 | `Non-Intenders`; `Not Aware` |
| slot `15` | Sovereign Gold Bond (SGB) | 53,357 / 109,430 | `Not Aware` |
| slot `16` | Employees Provident Fund (EPF) | 51,999 / 109,430 | `Not Aware`; `Non-Intenders` |
| slot `17` | Portfolio Management Services (PMS) | 53,357 / 109,430 | `Not Aware` |
| slot `18` | Gold - Physical form / Sovereign Gold Bond (SGB) | 45,239 / 109,430 | `Non-Intenders`; `Not Aware` |
| slot `19` | Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc) | 52,567 / 109,430 | `Not Aware`; `Non-Intenders` |
| slot `20` | Alternate Investment Fund (AIF) | 53,267 / 109,430 | `Not Aware`; `Non-Intenders`; `Intenders` |
| slot `21` | Specialized Investment Fund (SIF) | 53,357 / 109,430 | `Not Aware` |
| slot `1_2` | MF_ETF | 53,076 / 109,430 | `Not Aware`; `Non-Intenders`; `Intenders` |
