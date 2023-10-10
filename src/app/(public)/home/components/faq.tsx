'use client';

import { motion } from 'framer-motion';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqAccordionItemProps {
  question: string;
  answer: string;
}

const FAQs: Array<{ question: string; answer: string }> = [
  {
    question: 'What is Wealth Accelerator?',
    answer:
      'Wealth Accelerator is a concept that we created as a part of our strategy to help individuals. It is a financial advising tool designed to help individuals and businesses understand their expenses and manage their money more effectively.',
  },
  {
    question: 'What is the Creative Cash Flow?',
    answer:
      'Our proprietary Creative Cash Flow algorithm analyzes both your business and personal expenses, including taxes, to provide a comprehensive view of your spending habits and where your money is being utilized.',
  },
  {
    question: 'Is it safe to connect my bank account?',
    answer:
      'Absolutely. We use the Plaid API, a trusted and secure method, to connect to financial institutions. Your safety is our top priority.',
  },
  {
    question: 'Do you store my bank login credentials?',
    answer:
      'No, we never store your bank credentials. The Plaid API allows us to access your financial data without storing any sensitive information.',
  },
  {
    question: 'How can I trust the security of the Plaid API?',
    answer:
      'Plaid is a reputable service used by many financial apps and platforms. They prioritize user security and have multiple layers of protection in place.',
  },
  {
    question: 'How can Wealth Accelerator help me manage my finances better',
    answer:
      'By providing a clear breakdown of your expenses and identifying areas of spending, our tool empowers you to make informed decisions about your finances and find opportunities to save.',
  },
  {
    question: 'How do I connect my bank account to Wealth Accelerator?',
    answer:
      "It's simple! Just follow the on-screen instructions and use your bank's login credentials. Remember, we never store this information.",
  },
  {
    question: 'How often is my financial data updated on Wealth Accelerator?',
    answer:
      'Your data is updated regularly to ensure you always have the most recent information. Account data is updated every couple of hours in the background or on demand with viewing it.',
  },
  {
    question: 'Is my financial data shared with third parties?',
    answer:
      "No. We have no third parties that we share your data with. It's your data. Your privacy is paramount to us. We do not share your financial data with any third parties without your explicit consent.",
  },
];

const FaqAccordionItem = ({ question, answer }: FaqAccordionItemProps) => {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-xl capitalize data-[state=closed]:text-muted-foreground text-left lg:text-center">
        {question}
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 text-lg">{answer}</div>
      </AccordionContent>
    </AccordionItem>
  );
};

export function FAQ({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        amount: 0.6,
        once: true,
      }}
      transition={{
        ease: 'easeInOut',
        duration: 0.5,
      }}
    >
      <div className="mb-12 text-center">
        <h2 className="text-5xl text-cyan-900 font-semibold tracking-tight uppercase">FAQ</h2>
      </div>
      <Accordion type="single" collapsible className="max-w-5xl mx-auto shadow-2xl p-8 lg:p-12">
        {FAQs.map((faq) => (
          <FaqAccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </Accordion>
    </motion.div>
  );
}
