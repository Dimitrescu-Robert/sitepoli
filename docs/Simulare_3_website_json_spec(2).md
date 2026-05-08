# Simulare 3 — Website JSON Output Specification

## Context

I'm building the website page that students submit answers through. Each submission writes one row to a Google Sheet named `Rezultate simulare 3`, and the column called `JSON Brut` holds a JSON blob describing that student's full session.

A separate Colab notebook (`Auto_fetch_simulare_3.ipynb`) reads the sheet, parses the JSON in every row, runs analysis, and exports a cleaned spreadsheet plus charts. **The notebook is already written and working — the website's job is to produce JSON that matches the contract below.**

The new thing in Simulare 3 vs. Simulare 2: math is mandatory, but each student picks **either Informatică (`info`) OR Fizică (`fizica`)** as their second discipline. The JSON shape changes depending on which one they pick.

---

## The contract

### Fields that are ALWAYS present

| Field | Type | Example | Notes |
|---|---|---|---|
| `id_participant` | string | `"ST362352"` | Unique per student |
| `timp_folosit` | string | `"47min 14s"` | Must be parseable by pandas `to_timedelta`. Keep the exact format `"<X>min <Y>s"` to match Simulare 2. |
| `scor_total` | number | `6` | Sum of math + chosen secondary score, range 0–20 |
| `scor_mate` | number | `5` | Math score, range 0–10 |
| `detalii_mate` | array of 10 objects | (see below) | Always exactly 10 items, one per problem |
| `disciplina_aleasa` | string | `"info"` or `"fizica"` | **NEW for Simulare 3.** Lowercase. Used for stats and filtering. |

### Fields that depend on the student's choice

If `disciplina_aleasa === "info"`:
- Include `scor_info` (number, 0–10)
- Include `detalii_info` (array of 10 objects)
- **Do NOT include `scor_fizica` or `detalii_fizica`**

If `disciplina_aleasa === "fizica"`:
- Include `scor_fizica` (number, 0–10)
- Include `detalii_fizica` (array of 10 objects)
- **Do NOT include `scor_info` or `detalii_info`**

Sending both pairs (or empty arrays for the unchosen one) is wrong — keep the chosen pair, omit the other entirely.

### Shape of each `detalii_*` entry

Every `detalii_mate`, `detalii_info`, and `detalii_fizica` array must contain exactly 10 objects, in problem order (1 through 10), each with this shape:

```json
{
  "problem": 1,
  "answer": "b",
  "correct": "b"
}
```

- `problem`: integer 1–10
- `answer`: the letter the student selected (`"a"` through `"e"`, or `"d"` etc. — match the multiple-choice options)
- `correct`: the correct answer letter for that problem

Both `answer` and `correct` must be lowercase single-letter strings. The notebook compares them with `==`, so casing/whitespace must match exactly.

---

## Complete examples

### A student who chose Info

```json
{
  "id_participant": "ST362352",
  "timp_folosit": "47min 14s",
  "scor_total": 6,
  "scor_mate": 5,
  "scor_info": 1,
  "disciplina_aleasa": "info",
  "detalii_mate": [
    {"problem": 1,  "answer": "b", "correct": "b"},
    {"problem": 2,  "answer": "b", "correct": "e"},
    {"problem": 3,  "answer": "b", "correct": "c"},
    {"problem": 4,  "answer": "d", "correct": "b"},
    {"problem": 5,  "answer": "d", "correct": "b"},
    {"problem": 6,  "answer": "b", "correct": "b"},
    {"problem": 7,  "answer": "b", "correct": "b"},
    {"problem": 8,  "answer": "c", "correct": "c"},
    {"problem": 9,  "answer": "c", "correct": "a"},
    {"problem": 10, "answer": "a", "correct": "a"}
  ],
  "detalii_info": [
    {"problem": 1,  "answer": "a", "correct": "d"},
    {"problem": 2,  "answer": "c", "correct": "d"},
    {"problem": 3,  "answer": "e", "correct": "d"},
    {"problem": 4,  "answer": "e", "correct": "c"},
    {"problem": 5,  "answer": "e", "correct": "b"},
    {"problem": 6,  "answer": "a", "correct": "c"},
    {"problem": 7,  "answer": "c", "correct": "b"},
    {"problem": 8,  "answer": "a", "correct": "d"},
    {"problem": 9,  "answer": "a", "correct": "d"},
    {"problem": 10, "answer": "a", "correct": "a"}
  ]
}
```

### A student who chose Fizica

```json
{
  "id_participant": "ST491203",
  "timp_folosit": "52min 08s",
  "scor_total": 14,
  "scor_mate": 8,
  "scor_fizica": 6,
  "disciplina_aleasa": "fizica",
  "detalii_mate": [
    {"problem": 1,  "answer": "b", "correct": "b"},
    {"problem": 2,  "answer": "e", "correct": "e"},
    {"problem": 3,  "answer": "c", "correct": "c"},
    {"problem": 4,  "answer": "b", "correct": "b"},
    {"problem": 5,  "answer": "a", "correct": "b"},
    {"problem": 6,  "answer": "b", "correct": "b"},
    {"problem": 7,  "answer": "b", "correct": "b"},
    {"problem": 8,  "answer": "c", "correct": "c"},
    {"problem": 9,  "answer": "a", "correct": "a"},
    {"problem": 10, "answer": "d", "correct": "a"}
  ],
  "detalii_fizica": [
    {"problem": 1,  "answer": "c", "correct": "c"},
    {"problem": 2,  "answer": "a", "correct": "a"},
    {"problem": 3,  "answer": "d", "correct": "b"},
    {"problem": 4,  "answer": "b", "correct": "b"},
    {"problem": 5,  "answer": "e", "correct": "e"},
    {"problem": 6,  "answer": "a", "correct": "c"},
    {"problem": 7,  "answer": "d", "correct": "d"},
    {"problem": 8,  "answer": "b", "correct": "a"},
    {"problem": 9,  "answer": "c", "correct": "c"},
    {"problem": 10, "answer": "e", "correct": "b"}
  ]
}
```

---

## Rules to enforce in the website code

These are invariants — violations will either crash the notebook or silently produce bad stats:

1. **`disciplina_aleasa` is mandatory and must be exactly `"info"` or `"fizica"`** (lowercase, no whitespace, no other values like `"informatica"` or `"Fizică"`). The notebook lowercases and trims defensively, but stay strict on the website side.
2. **Mutual exclusivity is hard.** Never include both `detalii_info` and `detalii_fizica` in the same submission. Same for `scor_info` and `scor_fizica`.
3. **Each `detalii_*` array has exactly 10 items.** Not 9, not 11, not an empty array as a placeholder. If the student didn't reach a problem, send `"answer": ""` (empty string) for that one — but the array must still be length 10.
4. **`scor_total === scor_mate + scor_info` (or `+ scor_fizica`).** Compute it server-side from the actual answers; don't trust client-side state.
5. **`problem` numbers go 1 through 10 in order.** Don't skip, don't reorder.
6. **All letters are lowercase strings.** `"A"` is not the same as `"a"` to the comparison logic.
7. **`timp_folosit` format is `"<minutes>min <seconds>s"`.** Pad seconds to two digits if you want consistency (`"05s"`), though pandas handles either.

---

## What goes into the Google Sheet

The simplest setup is a sheet with at minimum these columns:

| id_participant | timp_folosit | JSON Brut |
|---|---|---|

Where `JSON Brut` holds the full JSON string. The notebook parses it via `json.loads` and unpacks all top-level keys with `pd.json_normalize`, so every JSON field automatically becomes a DataFrame column — no extra sheet columns needed.

You can include additional columns (student name, email, etc.) if useful for display in the raw sheet, but they're not required by the notebook.

---

## Common mistakes to avoid

- ❌ Sending `detalii_info: []` (empty array) for fizica students "to keep the schema uniform". The notebook treats this as no data, which is fine, but it's noise — just omit the key.
- ❌ Sending `disciplina_aleasa: "Informatica"` or `"INFO"`. Stick to lowercase short codes.
- ❌ Producing `scor_total` from client-side JavaScript without re-validating. A student who tampers with their answers in DevTools could otherwise inflate their score.
- ❌ Letting `timp_folosit` be a number (seconds) or an ISO duration. The notebook expects the `"Xmin Ys"` string format.
- ❌ Forgetting to JSON-stringify the object before writing it into the `JSON Brut` cell. The cell must contain a string, not an object reference or `[object Object]`.

---

## How the notebook handles edge cases (so you know what's safe)

For reference, the notebook is defensive in these ways:

- If `disciplina_aleasa` is missing entirely, it infers the discipline from which `detalii_*` array is populated. So you *can* ship without that field initially, but adding it gives you the discipline-split stats chart and is the recommended path.
- If zero students chose a discipline, plots for that discipline are skipped with a console message rather than crashing.
- If `scor_info`/`scor_fizica` are missing, the corresponding distribution plot is skipped.

Don't rely on these as escape hatches — they're safety nets, not the contract.

---

## TL;DR for implementation

1. Add a UI step where the student picks Info or Fizica before starting the second part.
2. Store that choice as a string `"info"` or `"fizica"`.
3. When constructing the submission JSON:
   - Always include math fields and `detalii_mate`
   - Conditionally include the chosen discipline's `scor_*` and `detalii_*`
   - Always include `disciplina_aleasa`
4. Stringify the JSON, write it to the `JSON Brut` column of the row.
5. Done — the notebook handles everything downstream.
