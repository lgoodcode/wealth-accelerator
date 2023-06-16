import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <>
      <div className="flex flex-row items-center justify-center min-h-screen">
        <Spinner className="mr-6 w-12 h-12" />
        <h1 className="text-4xl font-semibold">Loading...</h1>
      </div>
    </>
  );
}
