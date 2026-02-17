/**
 * PDF → JSON converter for JISCE exam papers
 *
 * Single file:
 *   yarn pdf:convert path/to/paper.pdf
 *
 * Batch (all PDFs in seed/pdfs/):
 *   yarn pdf:convert:all
 *
 * What it extracts automatically from the PDF:
 *   - Subject code, name, short name, department, regulation, semester, college
 *   - Exam pattern (groups, marks, attempt rules)
 *   - All Group A MCQs with options + correct answer + solution
 *   - All Group B short-answer questions + solutions
 *   - All Group C long-answer questions + solutions
 *
 * Auto-creates / updates:
 *   seed/subjects/<CODE>.json   ← merged (preserves manual edits)
 *   seed/papers/<CODE>/<title>.json
 *
 * After running, do `yarn seed` to push everything to Supabase.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>

import fs from 'fs'
import path from 'path'

const SEED_DIR     = path.join(__dirname)
const PDFS_DIR     = path.join(SEED_DIR, 'pdfs')
const SUBJECTS_DIR = path.join(SEED_DIR, 'subjects')
const PAPERS_DIR   = path.join(SEED_DIR, 'papers')

// ─────────────────────────────────────────────────────────────────────────────
// Roman numeral → integer
// ─────────────────────────────────────────────────────────────────────────────
const ROMAN: Record<string, number> = {
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6,
  vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12,
}
const romanToInt = (r: string) => ROMAN[r.toLowerCase()] ?? 0

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const clean = (s: string) => s.trim().replace(/\s+/g, ' ')

/** Mark tokens that look like bare math so the reviewer knows to wrap $...$  */
function flagMath(text: string): string {
  if (text.includes('$')) return text
  return text.replace(/\b(\w+\^\w+|\w+_\w+)\b/g, '[$1]')
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Option   { key: string; text: string }
interface Question {
  group: string; number: string; text: string
  marks: number; co: string; bl: string; options?: Option[]
}
interface Answer {
  question_number: string; correct_option?: string
  solution: string; key_points?: string[]
}
interface PaperJson {
  subject_code: string; title: string; type: string; year: string
  is_free: boolean; price: number; metadata: Record<string, unknown>
  questions: Record<string, Question>; answers: Record<string, Answer>
}

interface ExamGroup {
  name: string; label: string; instructions: string
  questions_count: number; attempt_count: number
  marks_per_question: number; question_type: string
}
interface SubjectJson {
  code: string; name: string; short_name: string; regulation: string
  semester: number; department: string; college: string
  exam_pattern: { total_marks: number; duration_minutes: number; groups: ExamGroup[] }
}

// ─────────────────────────────────────────────────────────────────────────────
// Subject extraction from PDF text
// ─────────────────────────────────────────────────────────────────────────────
function extractSubject(lines: string[]): SubjectJson {
  const subject: SubjectJson = {
    code: '', name: '', short_name: '', regulation: '',
    semester: 0, department: '', college: '',
    exam_pattern: { total_marks: 70, duration_minutes: 180, groups: [] },
  }

  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const l = clean(lines[i])

    // "IT301 — Sample Question Paper 1 with Solutions"
    // → code = IT301
    if (!subject.code) {
      const m = l.match(/\b([A-Z]{2,4}\d{3})\b/)
      if (m) subject.code = m[1]
    }

    // "COMPUTER ORGANIZATION & ARCHITECTURE"  (all-caps title lines)
    if (!subject.name && /^[A-Z][A-Z\s&\/\-,]+$/.test(l) && l.length > 10 && !l.match(/^JISCE|^JIS\b/)) {
      subject.name = l.split('&').map(w =>
        w.trim().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ')
      ).join(' & ')
    }

    // "JISCE / UG / IT / R23 / SEM-3 / 2025-26"
    const infoMatch = l.match(/JISCE\s*\/\s*UG\s*\/\s*([A-Z]+)\s*\/\s*(R\d+)\s*\/\s*SEM-?(\d)/i)
    if (infoMatch) {
      subject.department = infoMatch[1].toUpperCase()
      subject.regulation  = infoMatch[2].toUpperCase()
      subject.semester    = parseInt(infoMatch[3])
      subject.college     = 'JISCE'
    }

    // Full college name "JIS College of Engineering, Kalyani"
    const collegeMatch = l.match(/JIS College of Engineering[^,]*(?:,\s*\w+)?/i)
    if (collegeMatch) subject.college = collegeMatch[0].trim()
  }

  // short_name: look for "COA — Answer Key" pattern in full text
  const fullText = lines.join(' ')
  const shortMatch = fullText.match(/([A-Z]{2,6})\s*[—\-]\s*Answer Key/i)
  if (shortMatch) {
    subject.short_name = shortMatch[1].toUpperCase()
  } else if (subject.name) {
    // Derive from initials of major words
    subject.short_name = subject.name
      .split(/[\s&\/]+/)
      .filter(w => w.length > 2)
      .map(w => w[0].toUpperCase())
      .join('')
  }

  // Exam pattern from cover table: "Group A:10×1 = 10 marks (MCQ)"
  const groupPatterns = [
    { regex: /Group A[:\s]+(\d+)[×x](\d+)\s*=\s*(\d+)\s*marks/i,
      name: 'A', label: 'Group A', type: 'mcq',   instrTpl: 'Answer any {a} out of {q} questions' },
    { regex: /Group B[:\s]+(\d+)[×x](\d+)\s*=\s*(\d+)\s*marks/i,
      name: 'B', label: 'Group B', type: 'short', instrTpl: 'Answer any {a} out of {q} questions' },
    { regex: /Group C[:\s]+(\d+)[×x](\d+)\s*=\s*(\d+)\s*marks/i,
      name: 'C', label: 'Group C', type: 'long',  instrTpl: 'Answer any {a} out of {q} questions' },
  ]

  // Attempt counts come from "Answer any ten from the following" in section headers
  const attemptText = lines.join('\n')
  const attemptCountForGroup: Record<string, number> = {}
  ;[
    { key: 'A', re: /Answer any\s+(\w+)\s+from the following.*?10.*?1/i },
    { key: 'B', re: /Answer any\s+(\w+)\s+from the following.*?5/i },
    { key: 'C', re: /Answer any\s+(\w+)\s+from the following.*?15/i },
  ].forEach(({ key, re }) => {
    const m = attemptText.match(re)
    if (m) {
      const word = m[1].toLowerCase()
      const numWords: Record<string, number> = {
        one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
      }
      attemptCountForGroup[key] = (numWords[word] ?? parseInt(word)) || 0
    }
  })

  for (const gp of groupPatterns) {
    const m = fullText.match(gp.regex)
    if (m) {
      const attemptCount = parseInt(m[1])
      const marksEach    = parseInt(m[2])
      // total questions = total marks / marks each
      const totalMarks   = parseInt(m[3])
      const qCount       = totalMarks / marksEach
      const attempt      = attemptCountForGroup[gp.name] || attemptCount

      subject.exam_pattern.groups.push({
        name:               gp.name,
        label:              gp.label,
        instructions:       gp.instrTpl.replace('{a}', String(attempt)).replace('{q}', String(qCount)),
        questions_count:    qCount,
        attempt_count:      attempt,
        marks_per_question: marksEach,
        question_type:      gp.type,
      })
    }
  }

  // Total marks from "Full Marks: 70"
  const marksMatch = fullText.match(/Full\s*Marks[:\s]+(\d+)/i)
  if (marksMatch) subject.exam_pattern.total_marks = parseInt(marksMatch[1])

  // Duration from "Time Allotted: 3 Hours"
  const timeMatch = fullText.match(/Time\s*Allotted[:\s]+(\d+)\s*Hours/i)
  if (timeMatch) subject.exam_pattern.duration_minutes = parseInt(timeMatch[1]) * 60

  return subject
}

// ─────────────────────────────────────────────────────────────────────────────
// Subject JSON: merge extracted data into existing file (preserve manual edits)
// ─────────────────────────────────────────────────────────────────────────────
function saveSubject(extracted: SubjectJson) {
  const filePath = path.join(SUBJECTS_DIR, `${extracted.code}.json`)
  let existing: Partial<SubjectJson> = {}

  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }

  // Merge: extracted fills blanks; existing values win for non-empty fields
  const merged: SubjectJson = {
    code:        existing.code        || extracted.code,
    name:        existing.name        || extracted.name,
    short_name:  existing.short_name  || extracted.short_name,
    regulation:  existing.regulation  || extracted.regulation,
    semester:    existing.semester    || extracted.semester,
    department:  existing.department  || extracted.department,
    college:     existing.college     || extracted.college,
    exam_pattern: existing.exam_pattern?.groups?.length
      ? existing.exam_pattern
      : extracted.exam_pattern,
  }

  fs.mkdirSync(SUBJECTS_DIR, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8')
  return filePath
}

// ─────────────────────────────────────────────────────────────────────────────
// Paper metadata from cover
// ─────────────────────────────────────────────────────────────────────────────
function extractPaperMeta(lines: string[]) {
  let subjectCode = '', title = '', year = '', type = 'end_sem'

  for (const line of lines.slice(0, 20)) {
    const l = clean(line)

    const titleMatch = l.match(/([A-Z]{2,4}\d{3})\s*[—\-]\s*(.+?)\s*with\s*Solutions/i)
    if (titleMatch) {
      subjectCode = titleMatch[1].toUpperCase()
      title       = titleMatch[2].trim()
    }

    const yearMatch = l.match(/(\d{4}-\d{2,4})/)
    if (yearMatch && !year) year = yearMatch[1]
  }

  const tl = title.toLowerCase()
  if      (tl.includes('end sem'))    type = 'end_sem'
  else if (tl.includes('mid sem 1'))  type = 'mid_sem_1'
  else if (tl.includes('mid sem 2'))  type = 'mid_sem_2'
  else if (tl.includes('practice'))   type = 'practice'

  return { subjectCode, title, year, type }
}

// ─────────────────────────────────────────────────────────────────────────────
// Group A (MCQ) parser
// ─────────────────────────────────────────────────────────────────────────────
function parseGroupA(lines: string[], paper: PaperJson) {
  const qHeader = /^Q1\.(i{1,3}|iv|vi{0,3}|ix|xi{0,3}|xii?)\s*:\s+(.+?)\s*\((\d+)\)\s+(CO\d+)\s+(BL[\d/]+)/i

  let i = 0
  while (i < lines.length) {
    const hm = lines[i].match(qHeader)
    if (!hm) { i++; continue }

    const roman = hm[1], title = hm[2], marks = parseInt(hm[3])
    const co = hm[4].toUpperCase(), bl = hm[5].toUpperCase().replace('BL', 'L')
    const qNum = `A${romanToInt(roman)}`
    i++

    // Optional question body lines before options
    const bodyLines: string[] = []
    while (i < lines.length && !lines[i].match(/^\([abcd]\)/) && !lines[i].match(/^Q1\./i) && !lines[i].match(/^Answer:/i)) {
      bodyLines.push(lines[i])
      i++
    }

    // Options
    const options: Option[] = []
    while (i < lines.length && lines[i].match(/^\([abcd]\)/)) {
      const om = lines[i].match(/^\(([abcd])\)\s+(.+)/)
      if (om) options.push({ key: om[1], text: flagMath(clean(om[2])) })
      i++
    }

    // Answer
    let correctOption = ''
    if (i < lines.length && lines[i].match(/^Answer:/i)) {
      const am = lines[i].match(/Answer:\s*\(([abcd])\)/i)
      if (am) correctOption = am[1]
      i++
    }

    // Solution
    const solLines: string[] = []
    while (i < lines.length && !lines[i].match(/^Q1\.(i{1,3}|iv|vi{0,3}|ix|xi{0,3}|xii?)/i) && !lines[i].match(/^Group\s+[BC]/i)) {
      solLines.push(lines[i])
      i++
    }

    const questionText = bodyLines.length > 0 ? clean(bodyLines.join(' ')) : title

    paper.questions[qNum] = { group: 'A', number: qNum, text: flagMath(questionText), marks, co, bl, options }
    paper.answers[qNum]   = { question_number: qNum, correct_option: correctOption || undefined, solution: flagMath(solLines.join('\n').trim()) }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Group B / C parser
// ─────────────────────────────────────────────────────────────────────────────
function parseGroupBC(lines: string[], group: 'B' | 'C', paper: PaperJson) {
  const startQ = group === 'B' ? 2 : 7
  const qHeader = /^Q(\d+)\s*:\s+(.+?)\s*\((\d+)\)\s+(CO[\d/]+)(?:\s+(BL[\d/]+))?/i

  let i = 0
  while (i < lines.length) {
    const hm = lines[i].match(qHeader)
    if (!hm) { i++; continue }

    const qIndex = parseInt(hm[1]), title = hm[2], marks = parseInt(hm[3])
    const co = hm[4].toUpperCase(), bl = (hm[5] ?? '').toUpperCase().replace('BL', 'L') || 'L2'
    const qNum = `${group}${qIndex - startQ + 1}`
    i++

    // Question body up to Solution marker
    const bodyLines: string[] = []
    while (i < lines.length && !lines[i].match(/^Solution\b/i) && !lines[i].match(qHeader)) {
      bodyLines.push(lines[i])
      i++
    }
    if (i < lines.length && lines[i].match(/^Solution\b/i)) i++

    // Solution until next question
    const solLines: string[] = []
    while (i < lines.length && !lines[i].match(qHeader)) {
      solLines.push(lines[i])
      i++
    }

    const questionText = bodyLines.length > 0 ? clean(bodyLines.join(' ')) : title

    paper.questions[qNum] = { group, number: qNum, text: flagMath(questionText), marks, co, bl }
    paper.answers[qNum]   = { question_number: qNum, solution: flagMath(solLines.join('\n').trim()) }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main converter: PDF buffer → writes subject + paper JSON files
// ─────────────────────────────────────────────────────────────────────────────
async function convertPdf(pdfPath: string): Promise<{ subjectPath: string; paperPath: string; mathFlags: number }> {
  const buf    = fs.readFileSync(pdfPath)
  const parsed = await pdfParse(buf)
  const allLines = parsed.text.split('\n').map(clean).filter(Boolean)

  // ── Subject ─────────────────────────────────────────────────────────────────
  const subjectData = extractSubject(allLines)
  const subjectPath = saveSubject(subjectData)

  // ── Paper metadata ───────────────────────────────────────────────────────────
  const { subjectCode, title, year, type } = extractPaperMeta(allLines)

  const paper: PaperJson = {
    subject_code: subjectCode || subjectData.code,
    title,
    type,
    year,
    is_free: false,
    price:   4900,
    metadata: {},
    questions: {},
    answers:   {},
  }

  // ── Find group sections ──────────────────────────────────────────────────────
  let gA = -1, gB = -1, gC = -1
  for (let i = 0; i < allLines.length; i++) {
    const l = allLines[i].toLowerCase()
    if (l.match(/group a\s*[—\-]/) && l.includes('multiple choice'))  gA = i
    if (l.match(/group b\s*[—\-]/) && l.includes('short answer'))     gB = i
    if (l.match(/group c\s*[—\-]/) && l.includes('long answer'))      gC = i
  }

  const sliceA = gA >= 0 ? allLines.slice(gA, gB >= 0 ? gB : undefined) : []
  const sliceB = gB >= 0 ? allLines.slice(gB, gC >= 0 ? gC : undefined) : []
  const sliceC = gC >= 0 ? allLines.slice(gC) : []

  parseGroupA(sliceA, paper)
  parseGroupBC(sliceB, 'B', paper)
  parseGroupBC(sliceC, 'C', paper)

  // ── Save paper JSON ──────────────────────────────────────────────────────────
  const fileName  = title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '.json'
  const paperDir  = path.join(PAPERS_DIR, paper.subject_code)
  const paperPath = path.join(paperDir, fileName)
  fs.mkdirSync(paperDir, { recursive: true })

  const jsonStr  = JSON.stringify(paper, null, 2)
  const mathFlags = (jsonStr.match(/\[[\w^_]+\]/g) ?? []).length
  fs.writeFileSync(paperPath, jsonStr, 'utf-8')

  return { subjectPath, paperPath, mathFlags }
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)

  // Batch mode: no args → process all PDFs in seed/pdfs/
  const pdfFiles: string[] =
    args.length === 0
      ? fs.readdirSync(PDFS_DIR)
          .filter(f => f.toLowerCase().endsWith('.pdf'))
          .map(f => path.join(PDFS_DIR, f))
      : [args[0]]

  if (pdfFiles.length === 0) {
    console.error(`\nNo PDFs found in ${PDFS_DIR}\nDrop .pdf files there and re-run.\n`)
    process.exit(1)
  }

  if (!fs.existsSync(pdfFiles[0])) {
    console.error(`File not found: ${pdfFiles[0]}`)
    process.exit(1)
  }

  console.log(`\nConverting ${pdfFiles.length} PDF(s)...\n`)

  let totalMathFlags = 0

  for (const pdfPath of pdfFiles) {
    console.log(`  ${path.basename(pdfPath)}`)
    const { subjectPath, paperPath, mathFlags } = await convertPdf(pdfPath)
    const qCount = JSON.parse(fs.readFileSync(paperPath, 'utf-8')).questions
    console.log(`    Subject → ${path.relative(SEED_DIR, subjectPath)}`)
    console.log(`    Paper   → ${path.relative(SEED_DIR, paperPath)}  (${Object.keys(qCount).length} questions)`)
    if (mathFlags > 0) console.log(`    ⚠  ${mathFlags} math expression(s) flagged — wrap with $...$`)
    totalMathFlags += mathFlags
    console.log('')
  }

  if (totalMathFlags > 0) {
    console.log(`Total math flags to review: ${totalMathFlags}`)
    console.log('Search for [...] in the generated JSON files to find them.\n')
  }

  console.log('Done. Run `yarn seed` to push to Supabase.\n')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
