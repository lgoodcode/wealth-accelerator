'use client'

import { useRouter } from 'next/navigation'
import { captureException } from '@sentry/nextjs'

import { Button } from '@/components/ui/button'

export default function Error({ error }: any) {
  const router = useRouter()

  captureException(error)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-semibold">Oops, Something went wrong</h1>
      <div className="mt-6 text-lg text-muted-foreground">
        <Button size="lg" className="text-lg" onClick={() => router.push('/dashboard/home')}>
          Go home
        </Button>
      </div>
    </div>
  )
}
