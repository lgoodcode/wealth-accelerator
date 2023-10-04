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

      <section className="container py-12 max-w-6xl">
        <div className="flex justify-center max-w-full">
          <div className="flex flex-row gap-8">
            <div className="bg-white shadow-lg">
              <div className="relative p-12 space-y-2 rounded-t-md bg-gradient-to-br from-cyan-900 from-30% to-cyan-600">
                <h2 className="text-3xl font-bold text-white">Cookies Policy</h2>
                <p className="text-base text-white opacity-80">Effective: October 1, 2023</p>
              </div>

              <div className="p-8 md:px-12 space-y-12 text-muted-foreground">
                <div className="space-y-4">
                  <p>
                    The information provided below coincide with the guidelines outlined in our{' '}
                    <Link href="/privacy" className="link">
                      Privacy Policy
                    </Link>
                  </p>

                  <p>
                    Cookies are small pieces of data&ndash; usually text files &ndash; placed on
                    your computer, tablet, phone or similar device when you use that device to
                    access our Services. Please note that because of our use of Cookies, our
                    services do not support &ldquo;Do Not Track&rdquo; requests sent from a browser
                    at this time.
                  </p>

                  <div>
                    <p className="mb-2">We use the following types of Cookies:</p>
                    <ul className="pl-10 list-disc space-y-1">
                      <li>
                        <span className="underline">Essential Cookies:</span>{' '}
                        <span>
                          Required for providing you with features or services that you have
                          requested. For example, certain Cookies enable you to log into secure
                          areas of our Services. Disabling these Cookies will make the services
                          unavailable.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p>
                    We also utilize the{' '}
                    <Link
                      className="link"
                      href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
                      referrerPolicy="no-referrer"
                      target="_blank"
                    >
                      LocalStorage API
                    </Link>{' '}
                    of the browser of your device.
                  </p>
                  <div>
                    <p className="mb-2">We use and store the following in the LocalStorage:</p>
                    <ul className="pl-10 list-disc space-y-1">
                      <li>
                        <span className="underline">theme</span>{' '}
                        <span>
                          Used to store the theme preference of the user. The value can be either of{' '}
                          <code>light</code> or <code>dark</code>.
                        </span>
                      </li>
                      <li>
                        <span className="underline">loglevel</span>{' '}
                        <span>
                          Used to store the log level used by Sentry for error logging. The value
                          can be either of <code>debug</code>, <code>info</code>,{' '}
                          <code>warning</code>, <code>error</code>, <code>fatal</code>.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p>
                    The Plaid API, a necessary third party vendor that connects user financial
                    institutions, also stores data in the LocalStorage.
                  </p>
                  <div>
                    <p className="mb-2">Plaid stores the following in the LocalStorage:</p>
                    <ul className="pl-10 list-disc space-y-1">
                      <li>
                        <span className="underline">plaid_link_persistent_id</span>{' '}
                        <span>
                          Used to uniquely identify users across devices and browsers. This is
                          necessary for Plaid to function properly.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
