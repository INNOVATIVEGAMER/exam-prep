## What I Need You To Do

Generate **question papers with detailed answer keys** as validated JSON files, saved directly into my project's `seed/` directory. Follow this exact workflow:

---

## Step 0 — Ask Me What Type of Paper to Generate

Before doing anything else, ask me:

> **What type of paper do you want to generate?**
> 1. **Practice Set** — A large pool of questions (MCQs + short answers) compiled from a professor's practice sheet or important topics list. Not constrained by the exam pattern. All questions visible to students.
> 2. **End Sem** — A full end-semester exam paper following the exact exam pattern from previous year papers (Group A MCQs + Group B short + Group C long answers). Paywall preview flags apply.
> 3. **Mid Sem** — Same as End Sem but for a mid-semester exam (may have a different pattern — ask me to provide previous mid-sem papers).

Wait for my answer. Then follow **only** the section below that matches my choice:
- [Section A] for Practice Set
- [Section B] for End Sem / Mid Sem

---

---

# [Section A] — Practice Set Workflow

---

## A1 — Analyze My Inputs

I'm attaching:

- **Syllabus** (modules, COs, BLs, topic breakdown)
- **Professor's practice sheet / important topics list** (the main source — digitize this exactly)
- **[Optional] Any other reference material**

Study these carefully. Extract:

- Every question from the practice sheet verbatim (don't paraphrase or alter)
- The CO and BL mapping for each question (infer from syllabus if not stated)
- Which modules each question belongs to

---

## A2 — Create / Verify the Subject File

Check if `seed/subjects/{SUBJECT_CODE}.json` already exists.

- **If it exists** — read it, confirm it matches the syllabus, and move on.
- **If it doesn't exist** — create it following this exact schema:

```json
{
  "code": "PHIT301",
  "name": "Engineering Physics - II",
  "short_name": "Physics-II",
  "regulation": "R23",
  "semester": 3,
  "department": "IT",
  "college": "JISCE",
  "exam_pattern": {
    "total_marks": 70,
    "duration_minutes": 180,
    "groups": [
      {
        "name": "A",
        "label": "Group A",
        "instructions": "Answer any 10 out of 12 questions",
        "questions_count": 12,
        "attempt_count": 10,
        "marks_per_question": 1,
        "question_type": "mcq"
      },
      {
        "name": "B",
        "label": "Group B",
        "instructions": "Answer any 3 out of 5 questions",
        "questions_count": 5,
        "attempt_count": 3,
        "marks_per_question": 5,
        "question_type": "short"
      },
      {
        "name": "C",
        "label": "Group C",
        "instructions": "Answer any 3 out of 5 questions",
        "questions_count": 5,
        "attempt_count": 3,
        "marks_per_question": 15,
        "question_type": "long"
      }
    ]
  }
}
```

Also ensure `seed/papers/{SUBJECT_CODE}/` directory exists.

---

## A3 — Generate the Practice Set JSON

A practice set is **not** constrained by the exam pattern. It is a **large pool** of questions from the professor's sheet. Follow this schema:

```json
{
  "subject_code": "PHIT301",
  "title": "Practice Set — SEE Engineering Physics II",
  "type": "practice",
  "year": "2025-26",
  "is_free": false,
  "price": 9900,
  "metadata": {
    "difficulty": "medium",
    "modules_covered": ["Module 1", "Module 2", "Module 3", "Module 4"],
    "source": "Practice_set_provided_by_professor"
  },
  "questions": { ... },
  "answers": { ... }
}
```

### Key differences from an end-sem paper:

| Property | Practice Set | End Sem |
|---|---|---|
| `type` | `"practice"` | `"end_sem"` |
| Question count | As many as in the sheet (e.g. A1–A21, B1–B25) | Fixed by exam pattern (e.g. 12+5+5) |
| Groups | Only A (MCQ) and B (short) — no Group C long answers | A + B + C |
| `is_question_free` | **`true` for ALL questions** | Only 1 per group (default) |
| `is_answer_free` | **`true` for A1/B1 only** (first free preview), `false` for rest | Same |
| Source | From professor's practice sheet | From previous year exam papers |
| metadata.source | Name/ref of the practice sheet | Omit |

### Question numbering for practice sets:

- MCQs: `A1`, `A2`, ... `AN` (as many as in the sheet)
- Short answers: `B1`, `B2`, ... `BN` (as many as in the sheet)
- No Group C in practice sets (long answers are not part of practice sheets typically)

### Free preview flags for practice sets:

- **All questions**: `is_question_free: true` (students can see all questions)
- **A1 and B1**: `is_answer_free: true` (first question of each group has free answer)
- **All others**: `is_answer_free: false` (answers require payment)

---

## A4 — Write Solutions with Proper Formatting

Follow the same formatting rules as Section B Step 5 (Markdown + KaTeX). Solutions must be complete and exam-worthy.

---

## A5 — Validate JSON Structure

Run the same validations as Section B Step 7, with these adjustments:

- `type` must be `"practice"`
- No cross-validation against `questions_count` in exam pattern (practice sets are not constrained)
- All questions must have `is_question_free: true`
- Only A1 and B1 may have `is_answer_free: true`; all others must be `false`

Print a validation summary:

```
✓ Practice Set: 21 MCQs (A1–A21), 25 short answers (B1–B25), 46 total answers
  - All questions: is_question_free: true ✓
  - Free answers: A1, B1 only ✓
  - All key_points present ✓
  - Valid JSON ✓
```

---

## A6 — Save File

Save to:

```
seed/subjects/{SUBJECT_CODE}.json          ← create only if new
seed/papers/{SUBJECT_CODE}/practice_set.json
```

---

---

# [Section B] — End Sem / Mid Sem Workflow

---

## B1 — Analyze My Inputs

I'm attaching:

- **Syllabus** (modules, COs, BLs, topic breakdown)
- **Previous year question papers** (for exam pattern reference)
- **[Optional] Suggestion/important topics list**
- **[Optional] Any other reference material**

Study these carefully. Extract:

- Exact exam pattern (groups, marks per question, how many to attempt, total marks, duration)
- Module-wise topic distribution
- CO and BL mapping scheme
- Question style and difficulty level from previous papers

---

## B2 — Research & Plan

- Identify the most important/frequently asked topics per module
- Ensure all modules get fair coverage across papers
- Plan questions at varying Bloom's Taxonomy levels (BL1–BL6)
- Include numericals where the subject demands it
- If I've provided a suggestion list, cover those topics well

---

## B3 — Create / Verify the Subject File

Check if `seed/subjects/{SUBJECT_CODE}.json` already exists.

- **If it exists** — read it, confirm it matches the syllabus, and move on.
- **If it doesn't exist** — create it following this exact schema:

```json
{
  "code": "IT301",
  "name": "Computer Organization & Architecture",
  "short_name": "COA",
  "regulation": "R23",
  "semester": 3,
  "department": "IT",
  "college": "JISCE",
  "exam_pattern": {
    "total_marks": 70,
    "duration_minutes": 180,
    "groups": [
      {
        "name": "A",
        "label": "Group A",
        "instructions": "Answer any 10 out of 12 questions",
        "questions_count": 12,
        "attempt_count": 10,
        "marks_per_question": 1,
        "question_type": "mcq"
      },
      {
        "name": "B",
        "label": "Group B",
        "instructions": "Answer any 3 out of 5 questions",
        "questions_count": 5,
        "attempt_count": 3,
        "marks_per_question": 5,
        "question_type": "short"
      },
      {
        "name": "C",
        "label": "Group C",
        "instructions": "Answer any 3 out of 5 questions",
        "questions_count": 5,
        "attempt_count": 3,
        "marks_per_question": 15,
        "question_type": "long"
      }
    ]
  }
}
```

**Subject file rules:**

- `question_type` must be one of: `"mcq"`, `"short"`, `"long"`
- `exam_pattern.groups` must match the actual exam pattern from the reference papers
- Save to: `seed/subjects/{SUBJECT_CODE}.json`

Also ensure `seed/papers/{SUBJECT_CODE}/` directory exists (create it if not).

---

## B4 — Generate Question Papers as JSON

Create **2 sample question papers** (unless I specify otherwise). Each paper must follow this **exact JSON schema**:

```json
{
  "subject_code": "IT301",
  "title": "Sample Question Paper 1",
  "type": "end_sem",
  "year": "2025-26",
  "is_free": false,
  "price": 9900,
  "metadata": {
    "difficulty": "medium",
    "modules_covered": [
      "Module 1",
      "Module 2",
      "Module 3",
      "Module 4",
      "Module 5"
    ]
  },
  "questions": {
    "A1": {
      "group": "A",
      "number": "A1",
      "text": "Question text here with $inline\\ math$ if needed",
      "marks": 1,
      "co": "CO1",
      "bl": "L1",
      "is_question_free": true,
      "is_answer_free": true,
      "options": [
        { "key": "a", "text": "Option A" },
        { "key": "b", "text": "Option B" },
        { "key": "c", "text": "Option C" },
        { "key": "d", "text": "Option D" }
      ]
    },
    "A2": {
      "group": "A",
      "number": "A2",
      "text": "Another MCQ question",
      "marks": 1,
      "co": "CO1",
      "bl": "L1",
      "is_question_free": false,
      "is_answer_free": false,
      "options": [
        { "key": "a", "text": "Option A" },
        { "key": "b", "text": "Option B" },
        { "key": "c", "text": "Option C" },
        { "key": "d", "text": "Option D" }
      ]
    },
    "B1": {
      "group": "B",
      "number": "B1",
      "text": "Short answer question text",
      "marks": 5,
      "co": "CO2",
      "bl": "L2",
      "is_question_free": true,
      "is_answer_free": true
    },
    "B2": {
      "group": "B",
      "number": "B2",
      "text": "Another short answer question",
      "marks": 5,
      "co": "CO2",
      "bl": "L2",
      "is_question_free": false,
      "is_answer_free": false
    },
    "C1": {
      "group": "C",
      "number": "C1",
      "text": "(a) First part of the question. [5]\n(b) Second part. [6]\n(c) Third part. [4]",
      "marks": 15,
      "co": "CO1",
      "bl": "L2",
      "is_question_free": true,
      "is_answer_free": true
    },
    "C2": {
      "group": "C",
      "number": "C2",
      "text": "(a) Another long answer question. [8]\n(b) Second part. [7]",
      "marks": 15,
      "co": "CO1",
      "bl": "L2",
      "is_question_free": false,
      "is_answer_free": false
    }
  },
  "answers": {
    "A1": {
      "question_number": "A1",
      "correct_option": "b",
      "solution": "Explanation using **bold** and $math$ notation.",
      "key_points": ["Key point 1", "Key point 2"]
    },
    "B1": {
      "question_number": "B1",
      "solution": "Full markdown solution here...",
      "key_points": ["Point 1", "Point 2"]
    },
    "C1": {
      "question_number": "C1",
      "solution": "Full multi-part solution...",
      "key_points": ["Point 1", "Point 2"]
    }
  }
}
```

### Rules for each paper:

- Follow the **exact exam pattern** from the previous year papers (same groups, same marks, same attempt rules)
- `type` must be `"end_sem"` or `"mid_sem_1"` / `"mid_sem_2"` as applicable
- Include **CO and BL mapping** for every question
- Cover **all modules** with balanced distribution
- Have **no overlap** between Paper 1 and Paper 2 — different questions, different numericals
- Include a mix of conceptual, analytical, and numerical questions appropriate to the subject
- **Group A** = MCQs (must have `options` array with 4 choices and `correct_option` in answer)
- **Group B** = Short answer questions (5 marks each)
- **Group C** = Long answer questions (15 marks each, typically multi-part)
- Question numbering: `A1`–`A12`, `B1`–`B5`, `C1`–`C5` (adjust to match actual exam pattern)

### Preview flags (`is_question_free` and `is_answer_free`):

Every question **must** include both `is_question_free` and `is_answer_free` fields (boolean). These control what unpaid users can see:

- `is_question_free: true` — the question text is visible to all users
- `is_answer_free: true` — the answer is visible to all users (only meaningful if `is_question_free` is also `true`)
- `is_question_free: false` — the question is hidden behind a paywall for unpaid users
- Both fields **default to `false`** — locked unless explicitly set to `true`

**Default rule:** Mark exactly **one question per group** as the free preview by setting both `is_question_free: true` and `is_answer_free: true`. All other questions must have both set to `false`. This gives unpaid users a sample of each question type.

**Flexibility:** You may deviate from the default rule if instructed. Always follow the instructions provided. When no specific instructions are given, use the default rule above.

---

## B5 — Write Solutions with Proper Formatting

This is the most important part. Solutions are rendered on a web app using **Markdown + KaTeX math**. You MUST follow these formatting rules:

### Math Formatting (KaTeX)

- **Inline math**: Use `$...$` for math within text — e.g., `$2^8 = 256$`, `$T_{\text{non}}$`
- **Block math**: Use `$$...$$` on its own line for standalone equations:
  ```
  $$S = \frac{T_{\text{non}}}{T_{\text{pipe}}} = \frac{5000}{1040} \approx 4.81$$
  ```
- Use `\frac{a}{b}` for fractions, `x^{n}` for superscripts, `x_{i}` for subscripts
- Use `\text{word}` inside math for text words: `$T_{\text{pipe}}$` not `$T_{pipe}$`
- Use `\times` for multiplication, `\div` for division, `\approx` for approximately
- Use `\leftarrow` for arrows: `$\text{PC} \leftarrow \text{PC} + 1$`
- Use `\oplus` for XOR, `\cdot` for dot product
- Use `\log_2` for logarithms
- For aligned multi-line equations use `$$` blocks, one equation per block

### Text Formatting (Markdown)

- **Bold**: `**important term**`
- **Italic**: `*emphasis*`
- **Headings** within solutions: `#### Sub-heading` (use h4 or smaller)
- **Bullet lists**: `- item` or `* item`
- **Numbered lists**: `1. step one`
- **Code/assembly blocks**: Triple backticks with language:
  ````
  ```asm
  ADD R1, A, B   ; R1 = A + B
  SUB R2, C, D   ; R2 = C - D
  ```
  ````

### Tables (Markdown)

Use standard Markdown tables for comparisons, truth tables, algorithm steps:

```
| Parameter | Hardwired Control | Microprogrammed Control |
|-----------|-------------------|------------------------|
| Speed | Faster | Slower |
| Flexibility | Difficult to modify | Easy to modify |
```

### Newlines in JSON

- Use `\n` for line breaks within JSON strings
- Use `\n\n` for paragraph breaks
- Example: `"**Step 1:** Convert to binary\n- Integer: $13 = 1101_2$\n- Fraction: $0.625 = 0.101_2$"`

---

## B6 — Solution Quality Requirements

For each answer:

- **MCQs**: Include `correct_option` field + explanation of why the answer is correct and why others are wrong
- **Short answers**: Full structured solution with proper headings, lists, and math
- **Long answers**: Complete multi-part solutions with:
  - Step-by-step working for all **numericals and derivations**
  - **Comparison tables** where asked (Markdown table format)
  - **Key formulas** in `$$...$$` block math
  - **Assembly/code examples** in fenced code blocks
  - **Bullet points** for features/characteristics
  - **Boxed final answers** for numerical results using bold: `**Result: $-35_{10}$**`
- Include `key_points` array with 2–5 short takeaways per answer

---

## B7 — Validate JSON Structure

Before saving, validate **every** paper JSON against these rules. Fix any issues before writing files.

### Structural validation:

1. **Valid JSON** — parseable by `JSON.parse()` with no trailing commas, proper escaping (`\n`, `\\`, `\"`)
2. **Required top-level fields**: `subject_code` (string), `title` (string), `type` (one of `"end_sem"`, `"mid_sem_1"`, `"mid_sem_2"`, `"practice"`), `year` (string), `is_free` (boolean), `price` (number, in paisa — e.g. 9900 = ₹99), `metadata` (object), `questions` (object), `answers` (object)
3. **Every question key** in `questions` must have a matching key in `answers` (and vice versa)
4. **Question numbering** must match: `questions.A1.number === "A1"` and `answers.A1.question_number === "A1"`

### Question validation:

5. Every question must have: `group` (string), `number` (string), `text` (string), `marks` (number), `co` (string), `bl` (string), `is_question_free` (boolean), `is_answer_free` (boolean)
6. **MCQ questions** (Group A) must have an `options` array with exactly 4 objects, each with `key` (`"a"`, `"b"`, `"c"`, `"d"`) and `text`
7. Non-MCQ questions must NOT have `options`
8. Each group must have **at least one** question with `is_question_free: true` and `is_answer_free: true` (the free preview). Unless specific instructions override this.

### Answer validation:

9. Every answer must have: `question_number` (string), `solution` (non-empty string), `key_points` (array of strings, 2–5 items)
10. **MCQ answers** must have `correct_option` (one of `"a"`, `"b"`, `"c"`, `"d"`)
11. Non-MCQ answers must NOT have `correct_option`

### Cross-validation with subject:

12. Question groups must match the groups defined in the subject's `exam_pattern`
13. Question counts per group must match `questions_count` in the exam pattern
14. Marks per question must match `marks_per_question` in the exam pattern

### Print a validation summary:

```
✓ Paper 1: 22 questions, 22 answers, all keys match
  - Group A: 12 MCQs (all have 4 options + correct_option) ✓
  - Group B: 5 short answers ✓
  - Group C: 5 long answers ✓
  - All key_points present ✓
  - Preview flags: 1 free question per group (A1, B1, C1) ✓
  - All questions have is_question_free + is_answer_free fields ✓
  - Valid JSON ✓

✓ Paper 2: 22 questions, 22 answers, all keys match
  ...
```

---

## B8 — Save Files

Save the validated files to these exact paths:

```
seed/subjects/{SUBJECT_CODE}.json          ← subject file (create only if new)
seed/papers/{SUBJECT_CODE}/                ← create directory if needed
seed/papers/{SUBJECT_CODE}/sample_question_paper_1.json
seed/papers/{SUBJECT_CODE}/sample_question_paper_2.json
```

**File naming:** If papers already exist for this subject, name the new ones with the next available number (e.g., `sample_question_paper_3.json`).

---

---

# CRITICAL — What NOT to do (applies to both types)

- **DO NOT** use LaTeX document commands (`\begin{document}`, `\usepackage`, `\section`, etc.)
- **DO NOT** use LaTeX environments (`\begin{itemize}`, `\begin{tabular}`, `\begin{align}`, etc.)
- **DO NOT** use `\textbf{}` — use Markdown `**bold**` instead
- **DO NOT** use `\textit{}` — use Markdown `*italic*` instead
- **DO NOT** use `\\` for line breaks — use `\n` in JSON strings
- **DO NOT** leave math expressions as plain text — always wrap in `$...$` or `$$...$$`
- **DO NOT** generate PDF or LaTeX source — only JSON
- **DO NOT** use `\underbrace` or `\overset` — these don't render well in KaTeX on web
- **DO NOT** skip validation — every file must pass all checks before saving
- **DO NOT** use placeholder content — every solution must be complete and exam-worthy

---

## After This Prompt Completes

The only thing you need to do is run:

```bash
npm run seed
```

This will upsert the subject and all papers into the database. That's it — the papers will be live on the app.

If you want to seed only the new subject:

```bash
npm run seed:subject {SUBJECT_CODE}
```

---

## Example — Well-Formatted MCQ Answer

```json
{
  "question_number": "A7",
  "correct_option": "a",
  "solution": "Pipeline speedup formula:\n\n$$S = \\frac{T_{\\text{non}}}{T_{\\text{pipe}}} = \\frac{n \\cdot k \\cdot \\tau}{(k + n - 1) \\cdot \\tau} = \\frac{nk}{k + n - 1}$$\n\nAs $n \\to \\infty$, $S_{\\max} \\to k$ (ideal speedup equals number of pipeline stages).",
  "key_points": [
    "Speedup $S = \\frac{nk}{k+n-1}$",
    "Maximum speedup approaches $k$ (number of stages) as $n \\to \\infty$"
  ]
}
```

## Example — Well-Formatted Long Answer Solution

```json
{
  "question_number": "C3",
  "solution": "**(a) Pipelining Concept:**\n\nPipelining is a technique where multiple instructions are **overlapped** in execution, like an assembly line.\n\n**Five-stage instruction pipeline:**\n1. **IF** (Instruction Fetch): Fetch instruction from memory using PC\n2. **ID** (Instruction Decode): Decode opcode, read registers\n3. **EX** (Execute): ALU performs computation\n4. **MEM** (Memory Access): Read/write data memory\n5. **WB** (Write Back): Write result back to register file\n\n**Throughput improvement:** Without pipelining, each instruction takes $k$ cycles. With $k$-stage pipelining and $n$ instructions:\n\n$$T_{\\text{total}} = (k + n - 1) \\text{ cycles instead of } n \\times k \\text{ cycles}$$\n\n**(b) Pipeline Hazards:**\n\n| Hazard Type | Cause | Example | Solution |\n|-------------|-------|---------|----------|\n| Data | RAW dependency | `ADD R1,R2,R3` then `SUB R4,R1,R5` | Forwarding, stalling |\n| Control | Branch instructions | `BEQ R1,R2,LABEL` | Branch prediction, BTB |\n| Structural | Resource conflict | IF and MEM both need memory | Separate I/D caches |\n\n**(c) Speedup Calculation:**\n\nGiven: Non-pipelined = 50 ns, $k = 5$ stages, $\\tau = 10$ ns, $n = 100$ tasks.\n\n$$T_{\\text{non}} = n \\times 50 = 5000 \\text{ ns}$$\n\n$$T_{\\text{pipe}} = (k + n - 1) \\times \\tau = 104 \\times 10 = 1040 \\text{ ns}$$\n\n$$S = \\frac{5000}{1040} \\approx 4.81$$\n\n**Maximum speedup** (as $n \\to \\infty$):\n\n$$S_{\\max} = \\frac{n \\times k}{k + n - 1} \\to k = 5$$\n\n**Result: Maximum achievable speedup = $k$ = number of pipeline stages.**",
  "key_points": [
    "5-stage pipeline: IF → ID → EX → MEM → WB",
    "Three hazard types: data, control, structural",
    "Speedup $S \\approx 4.81$ for 100 tasks",
    "Maximum speedup equals number of stages ($k = 5$)"
  ]
}
```

---

## Input Details

**Subject:** [FILL IN — e.g., Computer Organization & Architecture]
**Subject Code:** [FILL IN — e.g., IT301]
**Short Name:** [FILL IN — e.g., COA]
**College:** [FILL IN — e.g., JISCE, Kalyani]
**Regulation:** [FILL IN — e.g., R23]
**Department:** [FILL IN — e.g., IT]
**Semester:** [FILL IN — e.g., 3]

**Paper type:** [Leave blank — the AI will ask you]
**Number of papers to generate:** [FILL IN — default 2, only for end_sem/mid_sem]
**Any specific topics to prioritize:** [FILL IN or remove]
**Any other instructions:** [FILL IN or remove]
