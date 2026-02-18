# Reusable Prompt — Sample Question Paper JSON Generator

> Copy everything below the line and paste it as your message in Claude. Attach your files (syllabus, previous year papers, any reference material) along with it.

---

## What I Need You To Do

I want you to generate **sample question papers with detailed answer keys** as **JSON files** that I can directly use in my web application. Follow this exact workflow:

### Step 1 — Analyze My Inputs

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

### Step 2 — Research & Plan

- Identify the most important/frequently asked topics per module
- Ensure all modules get fair coverage across papers
- Plan questions at varying Bloom's Taxonomy levels (BL1-BL6)
- Include numericals where the subject demands it
- If I've provided a suggestion list, make sure the papers cover those topics well

### Step 3 — Generate Question Papers as JSON

Create **2 sample question papers** (unless I specify otherwise). Each paper must follow this **exact JSON schema**:

```json
{
  "subject_code": "IT301",
  "title": "Sample Question Paper 1",
  "type": "end_sem",
  "year": "2025-26",
  "is_free": false,
  "price": 4900,
  "metadata": {
    "difficulty": "medium",
    "modules_covered": ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
  },
  "questions": {
    "A1": {
      "group": "A",
      "number": "A1",
      "text": "Question text here with $inline\\ math$ if needed",
      "marks": 1,
      "co": "CO1",
      "bl": "L1",
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
      "bl": "L2"
    },
    "C1": {
      "group": "C",
      "number": "C1",
      "text": "(a) First part of the question. [5]\n(b) Second part. [6]\n(c) Third part. [4]",
      "marks": 15,
      "co": "CO1",
      "bl": "L2"
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
- Include **CO and BL mapping** for every question
- Cover **all modules** with balanced distribution
- Have **no overlap** between Paper 1 and Paper 2 — different questions, different numericals
- Include a mix of conceptual, analytical, and numerical questions appropriate to the subject
- **Group A** = MCQs (must have `options` array with 4 choices and `correct_option` in answer)
- **Group B** = Short answer questions (5 marks each)
- **Group C** = Long answer questions (15 marks each)
- Question numbering: `A1`-`A12` for Group A, `B1`-`B5` for Group B, `C1`-`C4` for Group C (adjust to match actual exam pattern)

### Step 4 — Write Solutions with Proper Formatting

This is the most important part. Solutions are rendered on a web app using **Markdown + KaTeX math**. You MUST follow these formatting rules:

#### Math Formatting (KaTeX)
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

#### Text Formatting (Markdown)
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

#### Tables (Markdown)
Use standard Markdown tables for comparisons, truth tables, algorithm steps:
```
| Parameter | Hardwired Control | Microprogrammed Control |
|-----------|-------------------|------------------------|
| Speed | Faster | Slower |
| Flexibility | Difficult to modify | Easy to modify |
```

#### Newlines in JSON
- Use `\n` for line breaks within JSON strings
- Use `\n\n` for paragraph breaks
- Example: `"**Step 1:** Convert to binary\n- Integer: $13 = 1101_2$\n- Fraction: $0.625 = 0.101_2$"`

### Step 5 — Solution Quality Requirements

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
- Include `key_points` array with 2-5 short takeaways per answer

### CRITICAL — What NOT to do

- **DO NOT** use LaTeX document commands (`\begin{document}`, `\usepackage`, `\section`, etc.)
- **DO NOT** use LaTeX environments (`\begin{itemize}`, `\begin{tabular}`, `\begin{align}`, etc.)
- **DO NOT** use `\textbf{}` — use Markdown `**bold**` instead
- **DO NOT** use `\textit{}` — use Markdown `*italic*` instead
- **DO NOT** use `\\` for line breaks — use `\n` in JSON strings
- **DO NOT** leave math expressions as plain text — always wrap in `$...$` or `$$...$$`
- **DO NOT** generate PDF or LaTeX source — only JSON
- **DO NOT** use `|{z}` or `\underbrace` — these don't render well in KaTeX on web

### Output

Deliver these files:
1. `sample_question_paper_1.json` — Paper 1 (questions + answers in one JSON)
2. `sample_question_paper_2.json` — Paper 2 (questions + answers in one JSON)

Each file must be **valid JSON** that can be parsed by `JSON.parse()`. Double-check:
- All strings are properly escaped (especially `\n`, `\\`, quotes)
- No trailing commas
- All question keys match between `questions` and `answers` objects
- MCQs have exactly 4 options and a `correct_option`

### Example — Well-Formatted MCQ Answer

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

### Example — Well-Formatted Long Answer Solution

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

**Subject:** [FILL IN — e.g., Computer Organization & Architecture]
**Subject Code:** [FILL IN — e.g., IT301]
**College:** [FILL IN — e.g., JISCE, Kalyani]
**Regulation:** [FILL IN — e.g., R23 Autonomous]
**Semester:** [FILL IN — e.g., 3rd]

**Number of papers to generate:** [FILL IN — default 2]
**Any specific topics to prioritize:** [FILL IN or remove]
**Any other instructions:** [FILL IN or remove]
