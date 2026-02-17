import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'ExamPrep',
  description: 'Exam papers and solutions for engineering students',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
