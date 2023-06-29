import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex flex-row mt-16 items-center justify-center">
      <Spinner className="mr-4" size="xl" />
      <h1 className="text-4xl font-semibold">Loading...</h1>
    </div>
  );
}
