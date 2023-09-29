import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="sticky z-50 top-0 w-full flex justify-center">
      <nav className="absolute w-full bg-white/80 bd-sat-blur">
        <div className="container relative flex max-w-6xl mx-auto h-16 justify-between items-center">
          <a href="https://www.chirowealth.com" target="_blank" rel="noreferrer">
            <Image src="/img/logo-318x85.png" alt="logo" priority width={160} height={43} />
          </a>
          <ul className="flex gap-3">
            <li>
              <a
                href="https://www.chirowealth.com"
                target="_blank"
                referrerPolicy="no-referrer"
                className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none"
                rel="noreferrer"
              >
                <span className="font-semibold leading-none">About Us</span>
              </a>
            </li>
          </ul>
          <div className="flex gap-2">
            <Button variant="ghost">
              <a href="/login">Sign In</a>
            </Button>
            <Button>Contact Us</Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
