import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { captureException } from '@sentry/nextjs'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * This middleware refreshes the Supabase session before each route is rendered;
 * before loading Server Component routes.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    error,
    data: { session },
  } = await supabase.auth.getSession()

  if (error) {
    console.error(error)
    captureException(error)
  }

  if (error || !session) {
    return NextResponse.redirect(new URL(`${req.nextUrl.origin}/login`))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
