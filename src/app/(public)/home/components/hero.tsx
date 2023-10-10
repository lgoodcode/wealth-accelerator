'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

const variants = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Hero() {
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <div className="container z-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex">
            <div className="flex flex-col gap-8 relative p-12 bg-white/80 bd-frost text-center md:text-start shadow-2xl">
              <h2 className="text-3xl text-cyan-900 font-bold tracking-tight">
                Financial Freedom is Within Your Reach
              </h2>
              <p className="text-2xl text-primary md:pr-12">
                Take control of your financial future with our app, designed to help you build
                long-term wealth, security and income.
              </p>

              <div className="flex gap-8">
                <Button className="text-xl w-full md:w-auto py-4 px-6 capitalize">
                  <Link href="/contact">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
