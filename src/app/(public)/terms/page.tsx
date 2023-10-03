import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

interface GroupProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

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
  {
    label: 'User Representations',
    anchor: '#user-representations',
  },
  {
    label: 'Prohibited Uses',
    anchor: '#prohibited-uses',
  },
  {
    label: 'Services Management',
    anchor: '#services-management',
  },
  {
    label: 'Term and Termination',
    anchor: '#term-and-termination',
  },
];

export const Group = ({ id, title, children }: GroupProps) => (
  <div>
    <h2 id={id} className="text-3xl text-cyan-900 font-bold mb-4">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

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

            <div className="p-8 md:px-12 space-y-12 text-muted-foreground">
              <div className="space-y-4">
                <p className="uppercase font-lg mb-8 font-bold text-cyan-900 px-[15%] md:px[20%]">
                  PLEASE NOTE THAT YOUR USE OF AND ACCESS TO OUR SERVICES (DEFINED BELOW) ARE
                  SUBJECT TO THE FOLLOWING TERMS; IF YOU DO NOT AGREE TO ALL OF THE FOLLOWING, YOU
                  MAY NOT USE OR ACCESS THE SERVICES IN ANY MANNER.
                </p>
                <p>
                  These terms and conditions outline the rules and regulations for the use of the
                  ChiroWealth app, WealthAccelerator, located here.
                </p>
                <p>
                  By accessing this website we assume you accept these terms and conditions. Do not
                  continue to use the ChiroWealth WealthAccelerator app if you do not agree to take
                  all of the terms and conditions stated on this page.
                </p>
                <p>
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
                  subject to, prevailing law of Netherlands. Any use of the above terminology or
                  other words in the singular, plural, capitalization and/or he/she or they, are
                  taken as interchangeable and therefore as referring to same.
                </p>
              </div>

              <Group id="cookies" title="Cookies">
                <p>
                  Please read{' '}
                  <Link href="/cookies" className="link">
                    Cookies
                  </Link>
                </p>
              </Group>

              <Group id="privacy" title="Privacy Policy">
                <p>
                  Please read{' '}
                  <Link href="/privacy" className="link">
                    Privacy
                  </Link>
                </p>
              </Group>

              <Group id="user-representations" title="User Representations">
                <p>By using the Services, you represent and warrant that:</p>

                <ol className="pl-10 list-decimal space-y-1">
                  <li>
                    All registration information you submit will be true, accurate, current, and
                    complete.
                  </li>
                  <li>
                    You will maintain the accuracy of such information and promptly update such
                    registration information as necessary.
                  </li>
                  <li>
                    You have the legal capacity and you agree to comply with these Legal Terms.
                  </li>
                  <li>You are not a minor in the jurisdiction in which you reside.</li>
                  <li>
                    You will not access the Services through automated or non-human means, whether
                    through a bot, script or otherwise.
                  </li>
                  <li>You will not use the Services for any illegal or unauthorized purpose.</li>
                  <li>
                    Your use of the Services will not violate any applicable law or regulation.
                  </li>
                </ol>

                <p>
                  If you provide any information that is untrue, inaccurate, not current, or
                  incomplete, we have the right to suspend or terminate your account and refuse any
                  and all current or future use of the Services (or any portion thereof).
                </p>
              </Group>

              <Group id="disclaimer" title="Disclaimer">
                <p>
                  To the maximum extent permitted by applicable law, we exclude all representations,
                  warranties and conditions relating to our website and the use of this website.
                  Nothing in this disclaimer will:
                </p>
                <ul className="pl-10 list-disc space-y-1">
                  <li>limit or exclude our or your liability for death or personal injury;</li>
                  <li>
                    limit or exclude our or your liability for fraud or fraudulent
                    misrepresentation;
                  </li>
                  <li>
                    limit any of our or your liabilities in any way that is not permitted under
                    applicable law; or
                  </li>
                  <li>
                    exclude any of our or your liabilities that may not be excluded under applicable
                    law.
                  </li>
                </ul>
                <p>
                  The limitations and prohibitions of liability set in this Section and elsewhere in
                  this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all
                  liabilities arising under the disclaimer, including liabilities arising in
                  contract, in tort and for breach of statutory duty.
                </p>
                <p>
                  As long as the website and the information and services on the website are
                  provided free of charge, we will not be liable for any loss or damage of any
                  nature.
                </p>
              </Group>

              <Group id="prohibited-uses" title="Prohibited Uses">
                <p>
                  You may not access or use the Services for any purpose other than that for which
                  we make the Services available. The Services may not be used in connection with
                  any commercial endeavors except those that are specifically endorsed or approved
                  by us.
                </p>
                <p>As a user of the Services, you agree not to:</p>
                <ul className="pl-10 list-disc space-y-1">
                  <li>
                    Systematically retrieve data or other content from the Services to create or
                    compile, directly or indirectly, a collection, compilation, database, or
                    directory without written permission from us.
                  </li>
                  <li>
                    Trick, defraud, or mislead us and other users, especially in any attempt to
                    learn sensitive account information such as user passwords.
                  </li>
                  <li>
                    Circumvent, disable, or otherwise interfere with security-related features of
                    the Services, including features that prevent or restrict the use or copying of
                    any Content or enforce limitations on the use of the Services and/or the Content
                    contained therein.
                  </li>
                  <li>
                    Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
                  </li>
                  <li>
                    Use any information obtained from the Services in order to harass, abuse, or
                    harm another person.
                  </li>
                  <li>
                    Make improper use of our support services or submit false reports of abuse or
                    misconduct.
                  </li>
                  <li>
                    Use the Services in a manner inconsistent with any applicable laws or
                    regulations.
                  </li>
                  <li>Engage in unauthorized framing of or linking to the Services.</li>
                  <li>
                    Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses,
                    or other material, including excessive use of capital letters and spamming
                    (continuous posting of repetitive text), that interferes with any party’s
                    uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts,
                    alters, or interferes with the use, features, functions, operation, or
                    maintenance of the Services.
                  </li>
                  <li>
                    Engage in any automated use of the system, such as using scripts to send
                    comments or messages, or using any data mining, robots, or similar data
                    gathering and extraction tools.
                  </li>
                  <li>Delete the copyright or other proprietary rights notice from any Content.</li>
                  <li>
                    Attempt to impersonate another user or person or use the username of another
                    user.
                  </li>
                  <li>
                    Upload or transmit (or attempt to upload or to transmit) any material that acts
                    as a passive or active information collection or transmission mechanism,
                    including without limitation, clear graphics interchange formats
                    (&quot;gifs&quot;), 1x1 pixels, web bugs, cookies, or other similar devices
                    (sometimes referred to as &quot;spyware&quot; or &quot;passive collection
                    mechanisms&quot; or &quot;pcms&quot;).
                  </li>
                  <li>
                    Interfere with, disrupt, or create an undue burden on the Services or the
                    networks or services connected to the Services.
                  </li>
                  <li>
                    Harass, annoy, intimidate, or threaten any of our employees or agents engaged in
                    providing any portion of the Services to you.
                  </li>
                  <li>
                    Attempt to bypass any measures of the Services designed to prevent or restrict
                    access to the Services, or any portion of the Services.
                  </li>
                  <li>
                    Copy or adapt the Services&apos; software, including but not limited to Flash,
                    PHP, HTML, JavaScript, or other code.
                  </li>
                  <li>
                    Except as permitted by applicable law, decipher, decompile, disassemble, or
                    reverse engineer any of the software comprising or in any way making up a part
                    of the Services.
                  </li>
                  <li>
                    Except as may be the result of standard search engine or Internet browser usage,
                    use, launch, develop, or distribute any automated system, including without
                    limitation, any spider, robot, cheat utility, scraper, or offline reader that
                    accesses the Services, or use or launch any unauthorized script or other
                    software.
                  </li>
                  <li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
                  <li>
                    Make any unauthorized use of the Services, including collecting usernames and/or
                    email addresses of users by electronic or other means for the purpose of sending
                    unsolicited email, or creating user accounts by automated means or under false
                    pretenses.
                  </li>
                  <li>
                    Use the Services as part of any effort to compete with us or otherwise use the
                    Services and/or the Content for any revenue-generating endeavor or commercial
                    enterprise.
                  </li>
                </ul>
              </Group>

              <Group id="services-management" title="Services Management">
                <p>
                  We reserve the right, but not the obligation, to: (1) monitor the Services for
                  violations of these Legal Terms; (2) take appropriate legal action against anyone
                  who, in our sole discretion, violates the law or these Legal Terms, including
                  without limitation, reporting such user to law enforcement authorities; (3) in our
                  sole discretion and without limitation, refuse, restrict access to, limit the
                  availability of, or disable (to the extent technologically feasible) any of your
                  Contributions or any portion thereof; (4) in our sole discretion and without
                  limitation, notice, or liability, to remove from the Services or otherwise disable
                  all files and content that are excessive in size or are in any way burdensome to
                  our systems; and (5) otherwise manage the Services in a manner designed to protect
                  our rights and property and to facilitate the proper functioning of the Services
                </p>
              </Group>

              <Group id="term-and-termination" title="Term and Termination">
                <p>
                  These Legal Terms shall remain in full force and effect while you use the
                  Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE
                  THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS
                  TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY
                  PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF
                  ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY
                  APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE
                  SERVICES OR DELETE ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT
                  WARNING, IN OUR SOLE DISCRETION.
                </p>
                <p>
                  If we terminate or suspend your account for any reason, you are prohibited from
                  registering and creating a new account under your name, a fake or borrowed name,
                  or the name of any third party, even if you may be acting on behalf of the third
                  party. In addition to terminating or suspending your account, we reserve the right
                  to take appropriate legal action, including without limitation pursuing civil,
                  criminal, and injunctive redress.
                </p>
              </Group>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
