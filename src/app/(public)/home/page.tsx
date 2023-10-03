import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/public/header';
import { Features } from './components/features';
import { FAQ } from './components/faq';
import { Testimonials } from './components/testimonials';

export default function HomePage() {
  return (
    <>
      <Header sticky />

      <div className="min-h-[75vh] p-0 relative overflow-hidden flex items-center bg-cover bg-[50%]">
        <Image
          className="absolute top-0 right-0 ml-auto w-full lg:w-[50%] h-[90%] z-0 lg:rounded-bl-[10rem] rounded-none"
          src="/img/curved.jpg"
          width={1001}
          height={708}
          alt="image"
          priority
        />

        <div className="container z-10">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex">
              <div className="flex flex-col gap-8 relative p-12 bg-white/80 bd-sat-blur text-center md:text-start shadow-main">
                <h2 className="text-3xl text-cyan-900 font-bold tracking-tight">
                  Financial Freedom is Within Your Reach
                </h2>
                <p className="text-2xl text-primary md:pr-12">
                  Take control of your financial future with our app, designed to help you build
                  long-term wealth, security and income.
                </p>

                <div className="flex gap-8">
                  <Button className="text-xl w-full md:w-auto py-4 px-6 capitalize">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-28 lg:py-32">
        <Features className="container" />
      </section>

      <section className="py-28 lg:py-32">
        <div className="mb-12 text-center">
          <h2 className="text-4xl text-cyan-900 font-semibold tracking-tight uppercase">FAQ</h2>
        </div>
        <FAQ className="container" />
      </section>

      <section className="py-28 lg:py-32">
        <Testimonials className="container" />
      </section>
    </>
  );
}
