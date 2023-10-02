import { Box } from 'lucide-react';

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem = ({ title, description }: FeatureItemProps) => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 border-2 p-6 py-8 shadow-main">
      <div className="space-y-6 text-center">
        <div className="p-4 mx-auto w-fit bg-gradient-to-br from-cyan-600 to-cyan-900 text-white rounded-full">
          <Box size={48} className="mx-auto" />
        </div>
        <h5 className="text-xl font-semibold">{title}</h5>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
};

export function Features({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="text-center">
        <h2 className="text-4xl text-cyan-900 font-semibold tracking-tight capitalize">
          What We Can Do
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-12 gap-8">
        <FeatureItem
          title="Components"
          description="We get insulted by others, lose trust for those We get back."
        />
        <FeatureItem
          title="Components"
          description="We get insulted by others, lose trust for those We get back."
        />
        <FeatureItem
          title="Components"
          description="We get insulted by others, lose trust for those We get back."
        />
        <FeatureItem
          title="Components"
          description="We get insulted by others, lose trust for those We get back."
        />
      </div>
    </div>
  );
}
