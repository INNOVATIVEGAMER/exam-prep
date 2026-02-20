import Link from "next/link";

const POLICY_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="border-t bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {POLICY_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-xs text-zinc-600">
            © 2026 NehaNotes · Free resources for MAKAUT students.
          </p>
          <p className="text-center text-xs text-zinc-600">
            Made with love by{" "}
            <span className="text-zinc-400 font-medium">Neha Tanti</span> ·
            JISCE
          </p>
          <Link
            href="/support"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors underline underline-offset-2"
          >
            Need help? Raise a support ticket
          </Link>
        </div>
      </div>
    </footer>
  );
}
