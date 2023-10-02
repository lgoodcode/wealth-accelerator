import { Box } from 'lucide-react';

export function Features() {
  return (
    <>
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
            <p className="text-lg">We get insulted by others, lose trust for those We get back.</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
          <div className="space-y-6 text-center">
            <Box size={48} className="mx-auto" />
            <h5 className="text-xl font-semibold">Components</h5>
            <p className="text-lg">We get insulted by others, lose trust for those We get back.</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
          <div className="space-y-6 text-center">
            <Box size={48} className="mx-auto" />
            <h5 className="text-xl font-semibold">Components</h5>
            <p className="text-lg">We get insulted by others, lose trust for those We get back.</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
          <div className="space-y-6 text-center">
            <Box size={48} className="mx-auto" />
            <h5 className="text-xl font-semibold">Components</h5>
            <p className="text-lg">We get insulted by others, lose trust for those We get back.</p>
          </div>
        </div>
      </div>
    </>
  );
}
