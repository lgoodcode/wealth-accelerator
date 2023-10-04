import Link from 'next/link';
import Image from 'next/image';

import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="container h-full mt-32 lg:mt-0 flex-grow grid grid-cols-2 gap-8">
        <div className="md:container col-span-2 lg:col-span-1 my-auto space-y-6">
          <h1 className="text-4xl font-semibold leading-snug">
            Oops, the page you&apos;re looking for wasn&apos;t found.
          </h1>
          <div className="mr-auto">
            <Button size="lg">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
          <Image
            src="/img/404.png"
            alt="404 illustration - Image by pikisuperstar on Freepik"
            priority
            width={668}
            height={668}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
