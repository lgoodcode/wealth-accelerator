import Image from 'next/image';

export default function DashboardNotFoundPage() {
  return (
    <div className="container font-sans mt-32 grid grid-cols-2 gap-8 lg:gap-0">
      <div className="col-span-2 lg:col-span-1 my-auto space-y-6">
        <h1 className="text-4xl font-semibold leading-snug">
          Oops, the page you&apos;re looking for wasn&apos;t found.
        </h1>
      </div>

      <div className="col-span-2 lg:col-span-1 relative">
        <Image
          src="/img/404-robot.png"
          alt="404 illustration - robot"
          priority
          width={678}
          height={475}
        />
      </div>
    </div>
  );
}
