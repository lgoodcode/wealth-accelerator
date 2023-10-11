import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <div className="container h-full flex-grow grid grid-cols-2 mt-12 lg:mt-0 py-32 gap-12 lg:gap-8 ">
      <div className="md:container col-span-2 lg:col-span-1 my-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold leading-snug">
            Sorry, we are doing some maintenance right now.
          </h1>
          <p className="text-lg text-muted-foreground">
            Come back in an hour or so and everything should be back to normal.
          </p>
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
        <Image
          src="/img/maintenance.webp"
          alt="Maintenance mode text with computer under construction - Image by Freepik - https://www.freepik.com/free-vector/hand-drawn-construction-background_1583772.htm#query=under%20construction&position=0&from_view=search&track=ais"
          className="max-w-2xl"
          width={835}
          height={698}
          priority
        />
      </div>
    </div>
  );
}
