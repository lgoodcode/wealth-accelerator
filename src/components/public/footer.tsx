import Link from 'next/link';

import { faker } from '@faker-js/faker';

export function Footer() {
  return (
    <footer className="bg-gray-800 pt-8 pb-4">
      <div className="container mx-auto mb-8">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-white mb-2">About Us</h4>
            <p className="text-gray-400">{faker.lorem.sentences(6)}</p>
          </div>

          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-white mb-2">Quick Links</h4>
            <div className="flex flex-col gap-1 w-fit">
              <Link href="#" className="text-gray-400 hover:text-gray-300 capitalize">
                Sign In
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 capitalize">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-white mb-2">Legal</h4>
            <div className="flex flex-col gap-1 w-fit">
              <Link href="/terms" className="text-gray-400 hover:text-gray-300 capitalize">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 capitalize">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-gray-300 capitalize">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400">&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
