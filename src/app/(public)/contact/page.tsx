import Image from 'next/image';

import { ContactForm } from './contact-form';

export default function ContactPage() {
  return (
    <div className="min-h-[85vh] p-0 mb-32 relative overflow-hidden flex items-center bg-cover bg-[50%]">
      <Image
        className="absolute top-0 right-0 ml-auto hidden lg:block w-full lg:w-[50%] h-full z-0 lg:rounded-bl-[10rem] rounded-none"
        src="/img/curved.jpg"
        width={1001}
        height={708}
        alt="image"
        priority
      />
      <div className="container z-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex">
            <div className="w-full flex flex-col gap-8 relative p-12 bg-white/80 bd-frost shadow-2xl">
              <div className="text-center space-y-4">
                <h2 className="text-3xl text-cyan-900 font-bold tracking-tight">Contact Us</h2>
                <p className="text-lg text-primary md:pr-12">
                  Send us a message and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
