import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 pt-8 pb-4 space-y-6">
      <div className="container mx-auto grid lg:grid-cols-3 gap-8">
        <div>
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

        <div>
          <h4 className="text-white mb-2">Legal</h4>
          <div className="flex flex-col gap-1 w-fit">
            <Link href="/terms" className="text-gray-400 hover:text-gray-300">
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

      <div className="text-center">
        <p className="text-gray-400">
          &copy; 2023 - ChiroWealth Learning Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
