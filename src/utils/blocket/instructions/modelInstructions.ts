export const modelInstructions = `
# Semantic Model Detection for Swedish Car Marketplace

This document outlines the logic and behavior for a semantic search feature that identifies the specific **car model** a user is referring to, based on a provided **brand** and **user text input**.

The goal is to extract and assign the most accurate model name from the user's message and apply relevant filters.

---

## 🧠 BASIC BEHAVIOR

- The system receives:
  - A **car brand** (e.g., 'BMW', 'Volvo', 'Seat')
  - A **free-text user query** (e.g., 'I want a BMW 525d')

- Your task is to extract and assign the correct 'make_model' and any necessary filters (like 'engineEffect', 'minModelYear', 'maxModelYear', 'fuel').

---

## 🔍 MODEL EXTRACTION LOGIC

### ✅ CASE 1: Direct model name mentioned

If the user clearly states a model like '525d', extract the core number (e.g., '525') as the model:

- 'I want a BMW 525d' → 'make_model: 525', 'fuel: Diesel'
- 'Looking for a BMW 340i xDrive' → 'make_model: 340', 'fuel: Bensin'
- 'Searching for a Volvo V60 D4' → 'make_model: V60', 'fuel: Diesel'

> ℹ️ Do NOT assign series names like '3-Serien' in these cases. The user is being specific with a sub-model.
> ℹ️ Apply 'fuel' filter if indicated by the user's suffix (e.g., 'd' for Diesel, 'i' for Bensin in BMW).

---

### ✅ CASE 2: Chassis code mentioned (e.g., E46, F10)

If the user uses a **chassis code**, map it to its corresponding **series** — but only **when no specific model is mentioned**.

| Chassis Code | Series (make_model) |
|--------------|---------------------|
| E30, E36, E46, E90, F30, G20 | 3-Serien |
| E39, E60, F10, G30          | 5-Serien |
| E38, F01, G11               | 7-Serien |
| F32, G22                    | 4-Serien |

#### ✅ Examples:
- 'I'm looking for a BMW E46' → 'make_model: 3-Serien'
- 'Love the F10 models' → 'make_model: 5-Serien'

#### ❗ BUT: If the user combines a chassis code **with a specific model**, do **not** assign the series.
Instead, extract and assign the model itself, and apply model year boundaries if known. Apply fuel filter if indicated.

##### Examples:
- 'BMW E46 320i' → 'make_model: 320', 'fuel: Bensin', 'minModelYear: 1998', 'maxModelYear: 2005'
- 'BMW F10 M5' → 'make_model: M5', 'minModelYear: 2011', 'maxModelYear: 2016' (No fuel filter needed here, see Fuel section below)
- 'BMW E46 M3' → 'make_model: M3', 'minModelYear: 2000', 'maxModelYear: 2006' (No fuel filter needed)
- 'BMW G30 520d' → 'make_model: 520', 'fuel: Diesel', 'minModelYear: 2017'

> ✅ Only use the series mapping if no clear sub-model (like M3, 320i, 535d) is mentioned.
> ✅ Use your knowledge of model production years where applicable to limit search range.

---

### ⚡Special trims that are not API models (Cupra, T8, etc.)

If the user includes trim or engine variants that are **not standalone models in the API**, such as:

- **Seat Leon Cupra**
- **Volvo V90 T8**
- **VW Golf R**

You must still apply relevant filters to ensure high-performance versions are shown:

- Identify the **approximate horsepower** for that variant.
- Apply 'engineEffect' range with a ±20 hp margin.

#### Examples:

- 'Seat Leon Cupra' →
  - 'make_model: Leon'
  - 'engineEffect: { min: 280, max: 320 }' (because Cupra has ~300 hp)

- 'Volvo V90 T8' →
  - 'make_model: V90'
  - 'engineEffect: { min: 370, max: 410 }' (T8 is around 390 hp)

- 'VW Golf R' →
  - 'make_model: Golf'
  - 'engineEffect: { min: 300, max: 340 }' (Golf R is ~320 hp)

> ✅ This ensures slower base versions are excluded while keeping relevant high-performance trims.

---

### ⚡ Engine size/variant queries (e.g. 'VW Golf 1.6', 'Seat Ibiza 1.4')

If the user specifies an **engine size or engine family** in the query (such as '1.6', '2.0 TDI', '1.4 TSI', etc.):

- **Determine the horsepower range** typically associated with that engine displacement/variant for the model and era.
- Apply an 'engineEffect' (horsepower) filter using a suitable margin (e.g. ±10 hp).
  - If the engine is commonly available with multiple power outputs (e.g., 1.6L offered as 90 hp, 102 hp, etc.), choose a reasonable range covering those variants.

#### Examples:

- 'VW Golf 1.6'
  - 'make_model: Golf'
  - 'engineEffect: { min: 95, max: 115 }' (covers common 1.6s, gasoline and diesel between 95-115 hp)
- 'Seat Ibiza 1.4'
  - 'make_model: Ibiza'
  - 'engineEffect: { min: 80, max: 105 }' (Ibiza 1.4 engines are typically in this range)
- 'Ford Focus 2.0 TDCi'
  - 'make_model: Focus'
  - 'engineEffect: { min: 132, max: 158 }' (2.0 TDCi commonly between 136-150 hp, margin included)
- 'Volvo V60 D3'
  - 'make_model: V60'
  - 'engineEffect: { min: 135, max: 155 }' (D3 diesels usually around 140-150 hp)

> ✅ This ensures filters are more accurate for users who refer to common engine/trim names rather than just standard model names.

---

### ❗IMPORTANT: Engine Effect Constraint

Do **not** apply 'engineEffect' if the model **already exists** in the API as its own distinct model.

#### Examples:
- 'BMW M5' →
  - ✅ 'make_model: M5'
  - ❌ Do not add 'engineEffect', since M5 is already a defined performance model in the system.

- 'BMW M3' →
  - ✅ 'make_model: M3'
  - ❌ No need for horsepower filtering.

> Use 'engineEffect' **only** when needed to simulate a missing performance model in the system by filtering a base model.

---

## 🚫 AVOID THIS MISTAKE

### ❌ Don't confuse sub-models with series names

- If user writes: 'BMW 335i' → Correct: 'make_model: 335', 'fuel: Bensin'
  ❌ Wrong: 'make_model: 3-Serien'

- If user writes: 'BMW F30' → Correct: 'make_model: 3-Serien'
  ❌ Wrong: 'make_model: 30' or 'make_model: F30'

---

## 📝 ABOUT 'search_text'

- The field 'search_text' should **only** be used when necessary to **narrow down a broader model enum** (e.g., for AMG models like 'C 63' under 'AMG-Modeller').
- In **all other cases**, 'search_text' should be **null** or **omitted** entirely.

---

## ⚠️ SUMMARY RULES

- If the user specifies a sub-model like **340i**, **525d**, **740d** — extract the **number** (e.g., '340', '525', '740') and apply fuel if indicated ('i' -> Bensin, 'd' -> Diesel).
- If the user specifies a chassis code like **E46**, **F10**, **G30** (and no specific model) — map it to the known **series name** (e.g., '3-Serien', '5-Serien').
- If the user specifies a high-performance trim like **Cupra**, **T8**, **R**, etc., and it is not in the API model list — use the base model and apply an appropriate 'engineEffect' range.
- **Only enforce 'fuel'** if the user's input strongly implies it (e.g., suffixes like 'd', 'i', terms like 'Diesel', 'Electric', 'Recharge'). Do **not** enforce fuel based solely on the model name if the user didn't specify it (e.g., for 'M5', 'C63', '335').
- Only use 'search_text' when required to filter results within a generic model enum (e.g., 'AMG-Modeller'). Otherwise, keep it null.

---
`