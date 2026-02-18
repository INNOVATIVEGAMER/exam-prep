import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-2">
        <p className="text-center text-sm">
          © 2026 ExamPrep. For MAKAUT students.
        </p>
        <Link
          href="/support"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
        >
          Need help? Raise a support ticket
        </Link>
      </div>
    </footer>
  )
}
