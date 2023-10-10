import Image from 'next/image';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { testimonials } from '../testimonials';

export function Testimonials({ className }: { className?: string }) {
  const col1 = testimonials.slice(0, 2);
  const col2 = testimonials.slice(2, 4);
  const col3 = testimonials.slice(4, 5);

  return (
    <div className={className}>
      <div className="mb-12 text-center">
        <h2 className="text-5xl text-cyan-900 font-semibold tracking-tight capitalize">
          What Our Customers Are Saying
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-8">
          {col1.map((testimonial) => (
            <div key={testimonial.name} className="space-y-6 p-6 border shadow-md bg-white">
              <div className="flex flex-row gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.personalImage} alt={`${testimonial.name}`} />
                </Avatar>
                <h3 className="text-lg font-bold">{testimonial.name}</h3>
              </div>
              <Image
                src={testimonial.companyImage}
                alt={`${testimonial.name}-practice`}
                width={180}
                height={47}
              />
              <blockquote className="text-muted-foregroud italic line-clamp-[18]">
                <p>&quot;{testimonial.message}&quot;</p>
              </blockquote>
            </div>
          ))}
        </div>
        <div className="space-y-8">
          {col2.map((testimonial) => (
            <div key={testimonial.name} className="space-y-6 p-6 border shadow-md bg-white">
              <div className="flex flex-row gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.personalImage} alt={`${testimonial.name}`} />
                </Avatar>
                <h3 className="text-lg font-bold">{testimonial.name}</h3>
              </div>
              <Image
                src={testimonial.companyImage}
                alt={`${testimonial.name}-practice`}
                width={180}
                height={47}
              />
              <blockquote className="text-muted-foregroud italic line-clamp-[18]">
                <p>&quot;{testimonial.message}&quot;</p>
              </blockquote>
            </div>
          ))}
        </div>
        <div className="space-y-8">
          {col3.map((testimonial) => (
            <div key={testimonial.name} className="space-y-6 p-6 border shadow-md bg-white">
              <div className="flex flex-row gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.personalImage} alt={`${testimonial.name}`} />
                </Avatar>
                <h3 className="text-lg font-bold">{testimonial.name}</h3>
              </div>
              <Image
                src={testimonial.companyImage}
                alt={`${testimonial.name}-practice`}
                width={180}
                height={47}
              />
              <blockquote className="text-muted-foregroud italic line-clamp-[18]">
                <p>&quot;{testimonial.message}&quot;</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
