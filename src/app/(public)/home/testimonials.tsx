import { faker } from '@faker-js/faker';

interface TestimonialItemProps {
  title: string;
  description: string;
  name: string;
  occupation: string;
}

const TestimonialItem = ({ title, description, name, occupation }: TestimonialItemProps) => {
  return (
    <div className="space-y-6 p-6 border shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
      <div>
        <p className="text-lg font-medium">{name}</p>
        <p className="text-muted-foreground">{occupation}</p>
      </div>
    </div>
  );
};

export function Testimonials({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-12 text-center">
        <h2 className="text-4xl text-cyan-900 font-semibold tracking-tight capitalize">
          What Our Customers Are Saying
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-8">
          {new Array(3).fill(0).map(() => (
            <TestimonialItem
              key={faker.number.binary()}
              title={faker.hacker.phrase()}
              description={`"${faker.lorem.paragraph({ min: 2, max: 6 })}"`}
              name={faker.person.fullName()}
              occupation={faker.person.jobTitle()}
            />
          ))}
        </div>
        <div className="space-y-8">
          {new Array(3).fill(0).map((_, i) => (
            <TestimonialItem
              key={faker.number.binary()}
              title={faker.hacker.phrase()}
              description={`"${faker.lorem.paragraph({ min: 2, max: 6 })}"`}
              name={faker.person.fullName()}
              occupation={faker.person.jobTitle()}
            />
          ))}
        </div>
        <div className="space-y-8">
          {new Array(3).fill(0).map((_, i) => (
            <TestimonialItem
              key={faker.number.binary()}
              title={faker.hacker.phrase()}
              description={`"${faker.lorem.paragraph({ min: 2, max: 6 })}"`}
              name={faker.person.fullName()}
              occupation={faker.person.jobTitle()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
