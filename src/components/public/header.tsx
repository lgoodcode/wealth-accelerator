import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="sticky z-50 top-0 w-full flex justify-center">
      <nav className="absolute w-full bg-gray-50/90 bd-frost shadow-md">
        <div className="container relative flex mx-auto px-8 h-16 justify-between items-center">
          <Link href="/">
            <Image src="/img/logo-318x85.png" alt="logo" priority width={168} height={45} />
          </Link>

          <div className="flex gap-2">
            <Button variant="ghost" className="hover:bg-blackAlpha-200">
              <Link href="/contact">
                <span className="font-semibold leading-none">Contact Us</span>
              </Link>
            </Button>
            <Button>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
