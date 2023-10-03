import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="sticky z-50 top-0 w-full flex justify-center">
      <nav className="absolute w-full bg-gray-50/90 bd-frost shadow-md">
        <div className="container relative flex mx-auto px-4 xl:px-0 h-16 justify-between items-center">
          <Link href="/">
            <Image src="/img/logo-318x85.png" alt="logo" priority width={168} height={45} />
          </Link>
          <ul className="flex gap-3">
            {/* <li>
              <a
                href="/about"
                className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none"
              >
                <span className="font-semibold leading-none">About Us</span>
              </a>
            </li> */}
            <li>
              <Link
                href="/contact"
                className="select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-200"
              >
                <span className="font-medium leading-none">Contact Us</span>
              </Link>
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
