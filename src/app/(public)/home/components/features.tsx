import Image from 'next/image';
import { Box } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface FeatureItemProps {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    isLeft?: boolean;
    priority?: boolean;
  };
}

const FeatureItem = ({ title, description, image }: FeatureItemProps) => {
  return (
    <div className="col-span-12 grid grid-cols-12 gap-16 lg:gap-8">
      <div
        className={cn('col-span-12 lg:col-span-5 flex items-center justify-center', {
          'order-1 lg:order-2': image.isLeft,
        })}
      >
        <div className="space-y-6 text-center">
          <div className="p-4 mx-auto w-fit bg-gradient-to-br from-cyan-600 to-cyan-900 text-white rounded-full">
            <Box size={48} className="mx-auto" />
          </div>
          <h5 className="text-4xl font-semibold capitalize">{title}</h5>
          <p className="text-2xl max-w-md mx-auto">{description}</p>
        </div>
      </div>

      <div
        className={cn('col-span-12 lg:col-span-7', {
          'order-1': image.isLeft,
        })}
      >
        <div>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={image.priority}
          />
        </div>
      </div>
    </div>
  );
};

export function Features({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="space-y-40 lg:space-y-72">
        <FeatureItem
          title="Connect your bank accounts"
          description="Connect your bank accounts to Wealth Accelerator securely and with ease. Plaid supports over 10,000 financial institutions."
          image={{
            src: '/img/mocks/banking.webp',
            alt: 'Mock of banking feature in Wealth Accelerator',
            width: 1363,
            height: 876,
            priority: true,
          }}
        />
        <FeatureItem
          title="Creative Cash Flow"
          description="After linking your bank accounts, Wealth Accelerator will automatically categorize your transactions, providing a clear visualization of where your money is being spent."
          image={{
            src: '/img/mocks/creative-cash-flow.webp',
            alt: 'Mock of Creative Cash Flow feature in Wealth Accelerator',
            width: 1363,
            height: 876,
            isLeft: true,
          }}
        />
        <FeatureItem
          title="Debt Snowball"
          description="Wealth Accelerator will present various strategies and compare them to help you find the most efficient way to pay off your debts quickly."
          image={{
            src: '/img/mocks/debt-snowball.webp',
            alt: 'Mock of Debt Snowball feature in Wealth Accelerator',
            width: 1363,
            height: 876,
          }}
        />
      </div>
    </div>
  );
}
