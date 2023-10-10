import Image from 'next/image';

import { Hero } from './components/hero';
import { Features } from './components/features';
import { FAQ } from './components/faq';
import { Testimonials } from './components/testimonials';

export default function HomePage() {
  return (
    <>
      <div className="min-h-[80vh] p-0 relative overflow-hidden flex items-center bg-cover bg-[50%]">
        <Image
          className="absolute top-0 right-0 ml-auto w-full lg:w-[50%] h-[90%] z-0 lg:rounded-bl-[10rem] rounded-none"
          src="/img/curved.jpg"
          width={1001}
          height={708}
          alt="image"
          priority
        />
        <Hero />
      </div>

      <section className="py-28 lg:py-32">
        <Features className="container" />
      </section>

      <section className="py-28 lg:py-32">
        <div className="mb-12 text-center">
          <h2 className="text-5xl text-cyan-900 font-semibold tracking-tight uppercase">FAQ</h2>
        </div>
        <FAQ className="container" />
      </section>

      <section className="py-28 lg:py-32">
        <Testimonials className="container" />
      </section>
    </>
  );
}
