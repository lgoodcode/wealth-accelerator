interface VerticalNavItemType {
  icon: string;
  label: string;
  anchor: string;
}

const verticalNavItems: Array<VerticalNavItemType> = [
  { icon: '🚀', label: 'General Terms', anchor: '#general-terms' },
  { icon: '🚀', label: 'Cookies', anchor: '#cookies' },
  { icon: '🚀', label: 'Privacy Policy', anchor: '#privacy-policy' },
  { icon: '🚀', label: 'Disclaimer', anchor: '#disclaimer' },
];

// export const content = [
//   {
//     id: 'general-terms',
//     sectionTitle: '',
//     body: ['Welcome to Creative Tim!', 'These terms and conditions'],
//   },
//   {
//     id: 'cookies',
//     sectionTitle: 'Cookies',
//     body: ['We employ the use of cookies', 'Most interactive websites use'],
//   },
//   { id: 'privacy', sectionTitle: 'Privacy Policy', body: ['Please read Privacy Policy'] },
//   {
//     id: 'disclaimer',
//     sectionTitle: 'Disclaimer',
//     body: ['To the maximum extent permitted by applicable law'],
//   },
// ];

export default function Terms() {
  return (
    <>
      <div className="font-sans">
        <div>{/* Space for Navbar */}</div>

        <section id="general-terms" className="min-h-screen bg-[#e9ecef] py-32">
          <div className="flex justify-center max-w-full">
            <div className="flex flex-col md:flex-row">
              <div className="md:min-w-[28%] px-4 mb-4">
                <ul className="flex flex-col p-4 md:w-32 rounded-xl bg-white leading-relaxed text-[#344767] sticky top-4 min-w-max md:min-w-full">
                  {verticalNavItems.map((item, index) => (
                    <li
                      className="flex flex-row px-4 py-2 hover:bg-[#f3f3f3] hover:rounded-lg duration-300 whitespace-nowrap cursor-pointer"
                      key={index}
                    >
                      <a href={item.anchor} className="flex flex-row justify-center">
                        <div>
                          <div>{item.icon}</div>
                        </div>
                        <p className="pl-4">{item.label}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-3">
                <div className="max-w-6xl rounded-2xl bg-white shadow-main">
                  <div className="relative p-12 rounded-t-2xl bg-gradient-to-r from-[#ff0080] to-[#7928ca]">
                    <h2 className="text-3xl font-bold text-white">Terms & conditions</h2>
                    <p className="text-base text-white opacity-80 mb-4">
                      Last modified: Sep 30 2023
                    </p>
                    <div>{/*svg for waves here*/}</div>
                  </div>
                  <div className="p-12">
                    <p className="text-[#67748e] mb-4">Welcome to Creative Tim!</p>
                    <p className="text-[#67748e] mb-4">
                      These terms and conditions outline the rules and regulations for the use of
                      Creative Tim&#39;s Website, located here.
                    </p>
                    <p className="text-[#67748e] mb-4">
                      By accessing this website we assume you accept these terms and conditions. Do
                      not continue to use Creative Tim if you do not agree to take all of the terms
                      and conditions stated on this page.
                    </p>
                    <p className="text-[#67748e] mb-8">
                      The following terminology applies to these Terms and Conditions, Privacy
                      Statement and Disclaimer Notice and all Agreements: &#34;Client&#34;,
                      &#34;You&#34; and &#34;Your&#34; refers to you, the person log on this website
                      and compliant to the Company&#39;s terms and conditions. &#34;The
                      Company&#34;, &#34;Ourselves&#34;, &#34;We&#34;, &#34;Our&#34; and
                      &#34;Us&#34;, refers to our Company. &#34;Party&#34;, &#34;Parties&#34;, or
                      &#34;Us&#34;, refers to both the Client and ourselves. All terms refer to the
                      offer, acceptance and consideration of payment necessary to undertake the
                      process of our assistance to the Client in the most appropriate manner for the
                      express purpose of meeting the Client&#39;s needs in respect of provision of
                      the Company&#39;s stated services, in accordance with and subject to,
                      prevailing law of Netherlands. Any use of the above terminology or other words
                      in the singular, plural, capitalization and/or he/she or they, are taken as
                      interchangeable and therefore as referring to same.
                    </p>

                    <h2 id="cookies" className="text-3xl text-[#344767] font-bold mb-3 ">
                      Cookies
                    </h2>
                    <p className="text-[#67748e] mb-4">
                      We employ the use of cookies. By accessing Creative Tim, you agreed to use
                      cookies in agreement with the Creative Tim&#39;s Privacy Policy.
                    </p>
                    <p className="text-[#67748e] mb-8">
                      Most interactive websites use cookies to let us retrieve the user&#39;s
                      details for each visit. Cookies are used by our website to enable the
                      functionality of certain areas to make it easier for people visiting our
                      website. Some of our affiliate/advertising partners may also use cookies.
                    </p>

                    <h2 id="privacy-policy" className="text-3xl text-[#344767] font-bold mb-3">
                      Your Privacy
                    </h2>
                    <p className="text-[#67748e] mb-8">
                      Please read{' '}
                      <a href="" target="_blank" rel="noreferrer" className="text-slate-800">
                        Privacy Policy
                      </a>
                    </p>

                    <h2 id="disclaimer" className="text-3xl text-[#344767] font-bold mb-3">
                      Disclaimer
                    </h2>
                    <p className="text-[#67748e] mb-4">
                      To the maximum extent permitted by applicable law, we exclude all
                      representations, warranties and conditions relating to our website and the use
                      of this website. Nothing in this disclaimer will:
                    </p>
                    <ul className="pl-10 mb-4 list-disc">
                      <li className="text-[#67748e]">
                        limit or exclude our or your liability for death or personal injury;
                      </li>
                      <li className="text-[#67748e]">
                        limit or exclude our or your liability for fraud or fraudulent
                        misrepresentation;
                      </li>
                      <li className="text-[#67748e]">
                        limit any of our or your liabilities in any way that is not permitted under
                        applicable law; or
                      </li>
                      <li className="text-[#67748e]">
                        exclude any of our or your liabilities that may not be excluded under
                        applicable law.
                      </li>
                    </ul>
                    <p className="text-[#67748e] mb-4">
                      The limitations and prohibitions of liability set in this Section and
                      elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and
                      (b) govern all liabilities arising under the disclaimer, including liabilities
                      arising in contract, in tort and for breach of statutory duty.
                    </p>
                    <p className="text-[#67748e] mb-4">
                      As long as the website and the information and services on the website are
                      provided free of charge, we will not be liable for any loss or damage of any
                      nature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
