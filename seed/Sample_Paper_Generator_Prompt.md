## What I Need You To Do

I want you to generate **sample question papers with detailed answer keys** for an engineering exam. Follow this exact workflow:

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

### Step 3 — Generate Question Papers

Create **2 sample question papers** (unless I specify otherwise). Each paper must:

- Follow the **exact exam pattern** from the previous year papers (same groups, same marks, same attempt rules)
- Have a proper **cover page** with university/college name, subject code, subject name, semester, regulation, time, full marks
- Include **CO and BL mapping** for every question
- Cover **all modules** with balanced distribution
- Have **no overlap** between Paper 1 and Paper 2 — different questions, different numericals
- Include a mix of conceptual, analytical, and numerical questions appropriate to the subject

### Step 4 — Generate Answer Keys

For each paper, create a **comprehensive answer key** with:

- Every question's **full solution** (not just final answers)
- Step-by-step working for all **numericals and derivations**
- **Diagrams** where needed (block diagrams, flowcharts, circuit diagrams, graphs)
- **Comparison tables** where asked (formatted properly)
- **Key points / important takeaways** highlighted for each answer
- Mathematical notation rendered properly (fractions, summations, Greek symbols, matrices)

### Step 5 — Format as Professional PDFs

Use **LaTeX** (pdflatex) for PDF generation. The formatting must include:

- **Colored question boxes** (blue/purple header background) showing question number + topic + marks + CO/BL
- **Colored answer boxes** (green background) with full solutions
- **Note/key point boxes** (orange background) for important highlights
- **TikZ diagrams** for all block diagrams, flowcharts, and visual explanations
- **Properly formatted tables** with alternating row colors and booktabs styling
- **Mathematical equations** using amsmath (boxed final answers, proper fractions, aligned equations)
- **Header/footer** on every page with subject code, college name, page numbers
- **Cover page** with exam structure table and CO mapping table

### Output

Deliver these files:

1. `Sample_Paper_1_with_Answers.pdf` — Paper 1 questions + full answer key
2. `Sample_Paper_2_with_Answers.pdf` — Paper 2 questions + full answer key

### Important Notes

- The question text must appear **inside each question box header** (not just "Q1" — show the actual topic)
- Answer quality matters more than speed — every numerical must have correct step-by-step working
- If the subject involves formulas/equations, render them properly with LaTeX math mode
- Cross-verify that the total marks add up correctly for each paper
- Make sure the papers are **exam-realistic** — something a professor would actually set

---

**Subject:** [FILL IN — e.g., Computer Organization & Architecture]
**Subject Code:** [FILL IN — e.g., IT301]
**College:** [FILL IN — e.g., JISCE, Kalyani]
**Regulation:** [FILL IN — e.g., R23 Autonomous]
**Semester:** [FILL IN — e.g., 3rd]

**Number of papers to generate:** [FILL IN — default 2]
**Any specific topics to prioritize:** [FILL IN or remove]
**Any other instructions:** [FILL IN or remove]
