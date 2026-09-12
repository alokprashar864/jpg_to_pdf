import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { getActiveTools } from '@/lib/seoConfigs';

export function Footer() {
  const activeTools = getActiveTools();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-neutral-950/80" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 — Product */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 group mb-4" aria-label="KrocPDF Home">
              <div className="relative w-7 h-7 rounded-lg flex items-center justify-center">
                <Image
                  src="/brand/logo-without-bg.png"
                  alt="KrocPDF Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className="text-base font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Kroc</span>
                <span className="text-neutral-300">PDF</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Privacy-first document conversion.
              Every file processed securely — locally in your browser or via encrypted cloud workers.
            </p>
          </div>

          {/* Column 2 — Tools */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {activeTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-sm text-neutral-600 italic">More tools coming soon...</span>
              </li>
            </ul>
          </div>

          {/* Column 3 — Developers */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Developers</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/alokprashar864/jpg_to_pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-white transition-colors inline-flex items-center"
                >
              <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                  GitHub Repository
                  <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
              <li>
                <span className="text-sm text-neutral-600 inline-flex items-center cursor-default" title="Coming soon">
                  KrocAPI Docs
                  <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-500">License: MIT</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal / Company */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-neutral-600 cursor-default" title="Coming soon">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-neutral-600 cursor-default" title="Coming soon">Terms of Service</span>
              </li>
              <li>
                <a
                  href="https://github.com/alokprashar864/jpg_to_pdf/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-white transition-colors inline-flex items-center"
                >
                  Report a Bug
                  <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {currentYear} KrocPDF. Open source under MIT License.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/alokprashar864/jpg_to_pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-400 transition-colors"
              aria-label="KrocPDF on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
