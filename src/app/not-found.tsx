import Link from 'next/link';
import Image from 'next/image';

import { Header } from '@/components/public/header';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="container mt-32 grid grid-cols-2 gap-8 lg:gap-0">
        <div className="col-span-2 lg:col-span-1 my-auto space-y-6">
          <h1 className="text-4xl font-semibold">
            Oops, the page you&apos;re looking for wasn&apos;t found.
          </h1>
          <div className="mr-auto">
            <Button size="lg">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 relative">
          <Image
            src="/img/404-hiker.png"
            alt="404 illustration - lost hiker"
            priority
            width={2500}
            height={1778}
          />
        </div>
      </div>
    </>
  );
}
