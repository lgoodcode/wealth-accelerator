import Link from 'next/link';
import type { Metadata } from 'next';

import { Header } from '@/components/public/header';

export const metadata: Metadata = {
  title: 'Cookies Policy',
};

export default function CookiesPolicyPage() {
  return (
    <>
      <Header />

      <section id="general" className="container py-12">
        <div className="flex justify-center max-w-full">
          <div className="flex flex-row gap-8">
            <div className="bg-white shadow-lg">
              <div className="relative p-12 space-y-2 rounded-t-md bg-gradient-to-br from-cyan-900 from-30% to-cyan-600">
                <h2 className="text-3xl font-bold text-white">Cookies Policy</h2>
                <p className="text-base text-white opacity-80">Effective: Oct, 1 2023</p>
              </div>

              <div className="p-8 md:px-12 space-y-12 text-muted-foreground">
                <div className="space-y-4">
                  <p>
                    Cookies are small pieces of data&ndash; usually text files &ndash; placed on
                    your computer, tablet, phone or similar device when you use that device to
                    access our Services. Please note that because of our use of Cookies, our
                    services do not support &ldquo;Do Not Track&rdquo; requests sent from a browser
                    at this time.
                  </p>
                  <p>We use the following types of Cookies:</p>
                  <ul className="pl-10 list-disc space-y-1">
                    <li>
                      <span className="underline">Essential Cookies,</span>
                      <span>
                        Essential Cookies are required for providing you with features or services
                        that you have requested. For example, certain Cookies enable you to log into
                        secure areas of our Services. Disabling these Cookies may make certain
                        features and services unavailable.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
