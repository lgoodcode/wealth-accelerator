import Image from 'next/image';
import { Box } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FAQ } from './faq';
import { Testimonials } from './testimonials';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <div className="font-sans">
      <div className="min-h-[80vh] p-0 relative overflow-hidden flex items-center bg-cover bg-[50%]">
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

      <section className="container py-32 bg-blackAlpha-50">
        <div className="text-center">
          <h2 className="text-4xl text-cyan-900 font-semibold tracking-tight capitalize">
            What We Can Do
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-8 mt-12">
          <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
            <div className="space-y-6 text-center">
              <Box size={48} className="mx-auto" />
              <h5 className="text-xl font-semibold">Components</h5>
              <p className="text-lg">
                We get insulted by others, lose trust for those We get back.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
            <div className="space-y-6 text-center">
              <Box size={48} className="mx-auto" />
              <h5 className="text-xl font-semibold">Components</h5>
              <p className="text-lg">
                We get insulted by others, lose trust for those We get back.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
            <div className="space-y-6 text-center">
              <Box size={48} className="mx-auto" />
              <h5 className="text-xl font-semibold">Components</h5>
              <p className="text-lg">
                We get insulted by others, lose trust for those We get back.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
            <div className="space-y-6 text-center">
              <Box size={48} className="mx-auto" />
              <h5 className="text-xl font-semibold">Components</h5>
              <p className="text-lg">
                We get insulted by others, lose trust for those We get back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-32">
          <div className="min-h-[50vh] lg:min-h-[70vh] p-0 relative overflow-hidden flex items-center bg-cover bg-[50%]">
            <Image
              className="absolute top-0 left-0 ml-auto w-full lg:w-[50%] h-full z-0 lg:rounded-br-[10rem] rounded-none"
              src="/img/curved.jpg"
              width={1001}
              height={708}
              alt="image"
              priority
            />

            <div className="container z-10">
              <div className="grid grid-cols-11">
                <div className="col-span-12 lg:col-span-5">
                  <div className="flex flex-col gap-8 relative p-12 bg-white/80 bd-frost text-center md:text-start shadow-main">
                    <h2 className="text-3xl text-cyan-900 font-bold tracking-tight">
                      The Wealth Accelerator Strategy
                    </h2>
                    <p className="text-2xl text-primary md:pr-12">
                      Get clarity, confidence, and peace of mind for your finances.
                    </p>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-5 lg:col-start-7">
                  <div className="p-8 border-2 shadow-main text-muted-foreground text-lg space-y-4">
                    <p>
                      For thousands of years people have used tools to help them achieve life’s
                      tasks more effectively and efficiently. Just because a tool is available, does
                      not necessarily mean a benefit will be realized, or that you will take action
                      to achieve the maximum benefit available.
                    </p>
                    <p>
                      To benefit, you must make a decision to use the tool to your advantage, with
                      an envisioned goal that is realistic and measurable. Chirowealth Learning
                      Systems™ is a proactive, directive, holistic/macroeconomic approach that
                      enables you to achieve your maximum financial potential; in the areas of cash
                      flow management, asset protection and wealth creation. In a nonthreatening
                      manner, coach and client meet initially by video conferencing, at agreed upon
                      pre-selected times. You’ll meet regularly to assess goals, create achievement
                      strategies, monitor progress and work through any problem areas.
                    </p>
                    <p>
                      Numerous clients will testify to the benefits and life changing experience
                      they have had while coaching with Chirowealth Learning Systems. Clients
                      frequently complete their coaching process fully empowered, alive, and
                      passionate about life.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

      <section className="container py-32">
        <FAQ />
      </section>

      <section className="container py-32">
        <Testimonials />
      </section>
    </div>
  );
}
