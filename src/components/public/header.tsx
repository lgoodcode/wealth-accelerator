import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="sticky z-50 top-0 w-full flex justify-center">
      <nav className="absolute w-full bg-white/80 bd-sat-blur">
        <div className="container relative flex max-w-6xl mx-auto h-16 justify-between items-center">
          <Link href="https://www.chirowealth.com" target="_blank" rel="noreferrer">
            <Image src="/img/logo-318x85.png" alt="logo" priority width={160} height={43} />
          </Link>
          <ul className="flex gap-3">
            {/* <li>
              <a
                href="https://www.chirowealth.com/about"
                target="_blank"
                referrerPolicy="no-referrer"
                className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none"
                rel="noreferrer"
              >
                <span className="font-semibold leading-none">About Us</span>
              </a>
            </li> */}
            <li>
              <a
                href="https://www.chirowealth.com/contact"
                target="_blank"
                referrerPolicy="no-referrer"
                className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blackAlpha-100"
                rel="noreferrer"
              >
                <span className="font-semibold leading-none">Contact Us</span>
              </a>
            </li>
          </ul>
          <Button>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
