import Link from 'next/link';
import type { Metadata } from 'next';

import { Header } from '@/components/public/header';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <section className="container py-12 max-w-5xl">
        <div className="flex justify-center max-w-full">
          <div className="flex flex-row gap-8">
            <div className="bg-white shadow-lg">
              <div className="relative p-12 space-y-2 rounded-t-md bg-gradient-to-br from-cyan-900 from-30% to-cyan-600">
                <h2 className="text-3xl font-bold text-white">Privacy Policy</h2>
                <p className="text-base text-white opacity-80">Effective: October 1, 2023</p>
              </div>

              <div className="px-8 py-12 md:px-12 space-y-12 text-muted-foreground">
                <div className="space-y-4">
                  <p>
                    This Privacy Policy document contains types of information that is collected and
                    recorded by ChiroWealth and how we use it.
                  </p>
                  <p>
                    If you have additional questions or require more information about our Privacy
                    Policy, do not hesitate to contact us through email at{' '}
                    <a className="link" href="mailto:privacy@chirowealth.com">
                      privacy@chirowealth.com
                    </a>
                  </p>
                  <p>
                    This privacy policy applies only to our online activities and is valid for
                    visitors to our website with regards to the information that they shared and/or
                    collect in the ChiroWealth WealthAccelerator app. This policy is not applicable
                    to any information collected offline or via channels other than this app.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl text-cyan-900 font-bold mb-4">Security</h2>
                  <div className="space-y-4">
                    <p>
                      We shall not be hold responsible for any content that appears on your Website.
                      You agree to protect and defend us against all claims that is rising on your
                      Website. No link(s) should appear on any Website that may be interpreted as
                      libelous, obscene or criminal, or which infringes, otherwise violates, or
                      advocates the infringement or other violation of, any third party rights.
                    </p>
                    <p>
                      All information provided is transmitted securely using TLS/SSL encrypted
                      connections and stored encrypted at rest in the database. No critical
                      sensitive personal information is stored in our database except for the
                      following:
                    </p>
                    <ul className="pl-10 !mt-2 list-disc space-y-1">
                      <li>Users name</li>
                      <li>Users email</li>
                      <li>
                        The name of a financial institution that a user connects (can be renamed by
                        the user)
                      </li>
                      <li>
                        The name of an account belonging to a user at a financial institution that a
                        user connects (can be renamed by the user)
                      </li>
                      <li>
                        Transactions belonging to an account:
                        <ul className="pl-10 !mt-2 list-[circle] space-y-1">
                          <li>The name of the transaction</li>
                          <li>The amount of the transaction</li>
                          <li>The date of the transaction</li>
                        </ul>
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
