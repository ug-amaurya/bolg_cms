import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BlogCMS</h3>
            <p className="text-gray-400">
              A modern blog platform built with Next.js, TypeScript, and Prisma.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/blog/category/technology"
                  className="hover:text-white"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/category/lifestyle"
                  className="hover:text-white"
                >
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/category/business"
                  className="hover:text-white"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get latest updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BlogCMS. Built with Next.js and Prisma.</p>
        </div>
      </div>
    </footer>
  );
}
