import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div>
      <div className="sticky z-50 top-0 w-full flex justify-center">
        <nav className="absolute w-full bg-white/80 bd-sat-blur">
          <div className="relative flex max-w-6xl mx-auto h-16 px-4 justify-between items-center">
            <a href="https://www.chirowealth.com" target="_blank" rel="noreferrer">
              <Image src="/img/logo-318x85.png" alt="logo" priority width={160} height={43} />
            </a>
            {/* <ul className="flex gap-3">
              <li>
                <Link
                  href="/"
                  className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <span className="text-sm font-semibold leading-none">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block h-auto select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <span className="text-sm font-semibold leading-none">Contact Us</span>
                </Link>
              </li>
            </ul> */}
            <div className="flex gap-2">
              <Button variant="ghost">
                <a href="/login">Sign In</a>
              </Button>
              <Button>Contact Us</Button>
            </div>
          </div>
        </nav>
      </div>

      <header className="font-sans">
        <div className="!min-h-[85vh] p-0 relative overflow-hidden flex items-center bg-cover bg-[50%]">
          <div>
            <Image
              className="absolute top-0 right-0 ml-auto w-[50%] h-full z-0 hidden md:block rounded-bl-[10rem] rounded-none"
              src="/img/curved.jpg"
              width={1001}
              height={708}
              alt="image"
              priority
            />
          </div>

          <div className="container z-10">
            <div className="grid grid-cols-12">
              <div className="col-span-7 col-start-2 flex">
                <div className="flex flex-col gap-8 relative p-12 bg-white/80 bd-sat-blur text-center md:text-start shadow-main ">
                  <h2 className="text-3xl text-cyan-900 font-bold tracking-tight">
                    Financial Freedom is Within Your Reach
                  </h2>
                  <p className="text-2xl text-primary pr-12">
                    Take control of your financial future with our app, designed to help you build
                    long-term wealth, security and income.
                  </p>

                  <div className="flex gap-8">
                    <Button className="text-xl py-4 px-6">Contact Us</Button>
                    <Button variant="secondary" className="text-xl py-4 px-6">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
