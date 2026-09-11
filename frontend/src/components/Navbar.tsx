'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import clsx from 'clsx';
import { getActiveTools, toolCards } from '@/lib/seoConfigs';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeTools = getActiveTools();
  const comingSoonTools = toolCards.filter(t => t.comingSoon);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 group"
            aria-label="KrocPDF Home"
          >
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/brand/logo-without-bg.png"
                alt="KrocPDF Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-200"
                style={{
                  filter: 'drop-shadow(1px 0 0 rgba(255,255,255,0.95)) drop-shadow(-1px 0 0 rgba(255,255,255,0.95)) drop-shadow(0 1px 0 rgba(255,255,255,0.95)) drop-shadow(0 -1px 0 rgba(255,255,255,0.95)) drop-shadow(0 0 6px rgba(255,255,255,0.5)) drop-shadow(0 0 12px rgba(59,130,246,0.35))'
                }}
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Kroc
              </span>
              <span className="text-neutral-300">PDF</span>
            </span>
          </Link>

          {/* Desktop Tool Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {activeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                aria-current={pathname === `/${tool.slug}` ? 'page' : undefined}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  pathname === `/${tool.slug}`
                    ? "bg-white/10 text-white"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                )}
              >
                {tool.name}
              </Link>
            ))}

            {/* Grayed out Coming Soon Tools */}
            {comingSoonTools.map((tool) => (
              <span
                key={tool.slug}
                title={`${tool.name} (Coming Soon)`}
                className="px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-400 select-none flex items-center space-x-1.5 cursor-not-allowed transition-colors"
              >
                <span>{tool.name}</span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-neutral-400">
                  Soon
                </span>
              </span>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://github.com/alokprashar864/jpg_to_pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="View on GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <button
              className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Log in (coming soon)"
              title="Coming soon"
            >
              <LogIn className="w-4 h-4 inline mr-1.5" />
              Log in
            </button>
            <button
              className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              aria-label="Sign up (coming soon)"
              title="Coming soon"
            >
              <UserPlus className="w-4 h-4 inline mr-1.5" />
              Sign up
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={clsx("mobile-menu-enter lg:hidden border-t border-white/5 max-h-[85vh] overflow-y-auto", mobileOpen && "open")}
        role="menu"
      >
        <div className="px-4 py-4 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 px-3 py-1">
            Active Tools
          </div>
          {activeTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === `/${tool.slug}`
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              )}
            >
              {tool.name}
            </Link>
          ))}

          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 px-3 pt-3 pb-1">
            Coming Soon
          </div>
          {comingSoonTools.map((tool) => (
            <div
              key={tool.slug}
              role="menuitem"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-neutral-500 cursor-not-allowed select-none"
            >
              <span>{tool.name}</span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-neutral-400">
                Soon
              </span>
            </div>
          ))}

          <hr className="border-white/5 my-3" />

          <a
            href="https://github.com/alokprashar864/jpg_to_pdf"
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center px-4 py-3 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <GithubIcon className="w-4 h-4 mr-3" />
            GitHub
          </a>

          <div className="flex space-x-2 px-4 pt-2">
            <button
              className="flex-1 py-2.5 text-sm text-neutral-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              title="Coming soon"
            >
              Log in
            </button>
            <button
              className="flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
              title="Coming soon"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
