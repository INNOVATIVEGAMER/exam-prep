import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Payment Successful — ExamPrep',
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ paperId?: string; returnUrl?: string }>
}) {
  const { paperId, returnUrl } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="size-12 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your answers are now unlocked. Happy studying!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {paperId && returnUrl && (
            <Button asChild>
              <Link href={returnUrl}>View Answers</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
