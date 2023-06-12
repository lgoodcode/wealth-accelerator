import Image from 'next/image'
import Link from 'next/link'

import background from '@/../public/bg-auth.jpg'
import logo from '@/../public/title-logo.png'

interface AuthenticationLayoutProps {
  children: React.ReactNode
}

export default function AuthenticationLayout({ children }: AuthenticationLayoutProps) {
  return (
    <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden -z-10 h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image src={background} alt="mountain covered by fog" fill />
      </div>

      <div className="lg:p-8 bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Image src={logo} height={70} alt="ChiroWealth logo" className="mx-auto" />

          {children}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
