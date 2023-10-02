import Image from 'next/image';

export function About() {
  return (
    <>
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
                  For thousands of years people have used tools to help them achieve life’s tasks
                  more effectively and efficiently. Just because a tool is available, does not
                  necessarily mean a benefit will be realized, or that you will take action to
                  achieve the maximum benefit available.
                </p>
                <p>
                  To benefit, you must make a decision to use the tool to your advantage, with an
                  envisioned goal that is realistic and measurable. Chirowealth Learning Systems™ is
                  a proactive, directive, holistic/macroeconomic approach that enables you to
                  achieve your maximum financial potential; in the areas of cash flow management,
                  asset protection and wealth creation. In a nonthreatening manner, coach and client
                  meet initially by video conferencing, at agreed upon pre-selected times. You’ll
                  meet regularly to assess goals, create achievement strategies, monitor progress
                  and work through any problem areas.
                </p>
                <p>
                  Numerous clients will testify to the benefits and life changing experience they
                  have had while coaching with Chirowealth Learning Systems. Clients frequently
                  complete their coaching process fully empowered, alive, and passionate about life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
