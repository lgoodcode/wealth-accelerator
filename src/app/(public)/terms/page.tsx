import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

interface QuickLink {
  label: string;
  anchor: string;
}

const quickLinks: QuickLink[] = [
  {
    label: 'General Terms',
    anchor: '#general',
  },
  {
    label: 'Cookies',
    anchor: '#cookies',
  },
  {
    label: 'Privacy Policy',
    anchor: '#privacy',
  },
  {
    label: 'Disclaimer',
    anchor: '#disclaimer',
  },
];

const QuickLinks = () => {
  return (
    <div className="w-[280px] min-w-[280px] lg:block hidden">
      <ul className="sticky top-28 p-4 rounded-md bg-white leading-relaxed text-muted-foreground shadow-main font-medium">
        {quickLinks.map((item, index) => (
          <li className="flex flex-row" key={index}>
            <Link
              href={item.anchor}
              className="flex flex-row px-4 py-2 rounded-md hover:bg-gray-200 duration-200 whitespace-nowrap cursor-pointer min-w-full"
            >
              <p>{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function TermsPage() {
  return (
    <section id="general" className="container py-32">
      <div className="flex justify-center max-w-full">
        <div className="flex flex-row gap-8">
          <QuickLinks />

          <div className="bg-white shadow-lg">
            <div className="relative p-12 space-y-2 rounded-t-md bg-gradient-to-br from-cyan-900 from-30% to-cyan-600">
              <h2 className="text-3xl font-bold text-white">Terms of Use</h2>
              <p className="text-base text-white opacity-80">Effective: Oct, 1 2023</p>
            </div>

            <div className="md:p-12 p-8">
              <p className="text-muted-foreground mb-4">
                These terms and conditions outline the rules and regulations for the use of the
                ChiroWealth app, WealthAccelerator, located here.
              </p>
              <p className="text-muted-foreground mb-4">
                By accessing this website we assume you accept these terms and conditions. Do not
                continue to use the ChiroWealth WealthAccelerator app if you do not agree to take
                all of the terms and conditions stated on this page.
              </p>
              <p className="text-muted-foreground mb-8">
                The following terminology applies to these Terms and Conditions, Privacy Statement
                and Disclaimer Notice and all Agreements: &#34;Client&#34;, &#34;You&#34; and
                &#34;Your&#34; refers to you, the person log on this website and compliant to the
                Company&#39;s terms and conditions. &#34;The Company&#34;, &#34;Ourselves&#34;,
                &#34;We&#34;, &#34;Our&#34; and &#34;Us&#34;, refers to our Company.
                &#34;Party&#34;, &#34;Parties&#34;, or &#34;Us&#34;, refers to both the Client and
                ourselves. All terms refer to the offer, acceptance and consideration of payment
                necessary to undertake the process of our assistance to the Client in the most
                appropriate manner for the express purpose of meeting the Client&#39;s needs in
                respect of provision of the Company&#39;s stated services, in accordance with and
                subject to, prevailing law of Netherlands. Any use of the above terminology or other
                words in the singular, plural, capitalization and/or he/she or they, are taken as
                interchangeable and therefore as referring to same.
              </p>

              <h2 id="cookies" className="text-3xl text-muted-foreground font-bold mb-3 ">
                Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                Please read{' '}
                <Link href="/cookies" className="link">
                  Cookies
                </Link>
              </p>

              <h2 id="privacy" className="text-3xl text-muted-foreground font-bold mb-3">
                Privacy Policy
              </h2>
              <p className="text-muted-foreground mb-8">
                Please read{' '}
                <Link href="/privacy" className="link">
                  Privacy
                </Link>
              </p>

              <h2 id="disclaimer" className="text-3xl text-muted-foreground font-bold mb-3">
                Disclaimer
              </h2>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by applicable law, we exclude all representations,
                warranties and conditions relating to our website and the use of this website.
                Nothing in this disclaimer will:
              </p>
              <ul className="pl-10 mb-4 list-disc">
                <li className="text-muted-foreground">
                  limit or exclude our or your liability for death or personal injury;
                </li>
                <li className="text-muted-foreground">
                  limit or exclude our or your liability for fraud or fraudulent misrepresentation;
                </li>
                <li className="text-muted-foreground">
                  limit any of our or your liabilities in any way that is not permitted under
                  applicable law; or
                </li>
                <li className="text-muted-foreground">
                  exclude any of our or your liabilities that may not be excluded under applicable
                  law.
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                The limitations and prohibitions of liability set in this Section and elsewhere in
                this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all
                liabilities arising under the disclaimer, including liabilities arising in contract,
                in tort and for breach of statutory duty.
              </p>
              <p className="text-muted-foreground mb-4">
                As long as the website and the information and services on the website are provided
                free of charge, we will not be liable for any loss or damage of any nature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
