export interface Subject {
  id: string
  code: string
  name: string
  short_name: string
  regulation: string
  semester: number
  department: string
  college: string
  exam_pattern: ExamPattern
  featured_until: string | null
  created_at: string
}

export interface ExamPattern {
  groups: Group[]
  total_marks: number
  duration_minutes: number
}

export interface Group {
  name: string
  label: string
  instructions: string
  questions_count: number
  attempt_count: number
  marks_per_question: number
  question_type: 'mcq' | 'short' | 'long'
}

export interface Paper {
  id: string
  subject_id: string
  title: string
  type: 'end_sem' | 'mid_sem_1' | 'mid_sem_2' | 'practice'
  year: string
  is_free: boolean
  price: number
  questions: Record<string, Question>
  answers: Record<string, Answer> | null // null if not purchased and not free
  metadata: PaperMetadata
  created_at: string
}

export interface Question {
  group: string
  number: string
  text: string
  marks: number
  co?: string // Course Outcome
  bl?: string // Bloom's Level
  options?: McqOption[] // for MCQ
  sub_parts?: SubPart[] // for multi-part questions
}

export interface McqOption {
  key: string // 'a', 'b', 'c', 'd'
  text: string
}

export interface SubPart {
  part: string // 'i', 'ii', 'iii'
  text: string
  marks: number
}

export interface Answer {
  question_number: string
  solution: string // markdown + LaTeX
  correct_option?: string // for MCQ: 'a', 'b', 'c', 'd'
  key_points?: string[]
}

export interface PaperMetadata {
  difficulty?: 'easy' | 'medium' | 'hard'
  modules_covered?: string[]
}

export interface Purchase {
  id: string
  user_id: string
  paper_id: string
  amount: number
  razorpay_order_id: string
  razorpay_payment_id?: string
  status: 'created' | 'paid' | 'failed'
  created_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  college?: string
  semester?: number
  active_device_token?: string
  created_at: string
}
