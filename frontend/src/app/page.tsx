'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Image,
  ImagePlus,
  Camera,
  GitMerge,
  Minimize2,
  FileOutput,
  Shield,
  Zap,
  Wifi,
  Lock,

  ArrowRight,
  Bell,
  Mail,
} from 'lucide-react';
import clsx from 'clsx';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { toolCards, type ToolCardConfig } from '@/lib/seoConfigs';

const iconMap: Record<ToolCardConfig['iconId'], React.ElementType> = {
  'image': Image,
  'image-plus': ImagePlus,
  'camera': Camera,
  'merge': GitMerge,
  'minimize': Minimize2,
  'file-output': FileOutput,
};

export default function HomePage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [notifySubmitted, setNotifySubmitted] = useState<Set<string>>(new Set());

  const handleHeroDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp'
    );

    if (files.length === 0) return;

    // Detect file type and route to the right tool
    const hasPng = files.some(f => f.type === 'image/png');
    const targetTool = hasPng ? 'png-to-pdf' : 'jpg-to-pdf';
    router.push(`/${targetTool}`);
  }, [router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleNotify = (slug: string) => {
    if (!notifyEmail.trim()) return;
    setNotifySubmitted(prev => new Set(prev).add(slug));
    setNotifyEmail('');
    // In a real app, this would POST to an API
  };

  return (
    <div className="gradient-mesh min-h-screen">
      {/* ============================================
          Hero Section
          ============================================ */}
      <section className="relative py-20 sm:py-28 lg:py-36 px-4">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_6s_ease_infinite]">
              Every Document Tool
            </span>
            <br />
            <span className="text-neutral-200">You Need</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Privacy-first document conversion. Convert images to PDF instantly — locally in your browser or via secure cloud workers.{' '}
            <span className="text-neutral-300 font-medium">Free, open source, no watermarks.</span>
          </p>

          {/* Hero Drop Zone CTA */}
          <div
            onDrop={handleHeroDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={clsx(
              "relative max-w-xl mx-auto border-2 border-dashed rounded-2xl p-8 sm:p-10 transition-all duration-300 cursor-pointer group",
              dragActive
                ? "border-blue-500 bg-blue-500/10 scale-[1.02] shadow-lg shadow-blue-500/10"
                : "border-neutral-700 hover:border-neutral-500 bg-neutral-900/40 hover:bg-neutral-900/60"
            )}
            role="button"
            tabIndex={0}
            aria-label="Drop files here to start converting, or click to browse tools"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={clsx(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                dragActive
                  ? "bg-blue-500/20 text-blue-400 scale-110"
                  : "bg-neutral-800 text-neutral-400 group-hover:text-neutral-200 group-hover:bg-neutral-700"
              )}>
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-lg font-semibold text-neutral-200">
                  {dragActive ? 'Release to convert' : 'Drop any image here to start'}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  JPG, PNG, JPEG — auto-detected and routed to the right tool
                </p>
              </div>
              <Link
                href="/jpg-to-pdf"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25"
              >
                Start Converting
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          Trust Badges
          ============================================ */}
      <section className="py-6 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 animate-fade-in">
          <TrustBadge icon={Lock} text="100% Open Source" />
          <TrustBadge icon={Shield} text="Files never leave your browser" />
          <TrustBadge icon={Zap} text="No sign-up required" />
          <a
            href="https://github.com/alokprashar864/jpg_to_pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </section>

      {/* ============================================
          Tool Cards Grid
          ============================================ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-3">All PDF Tools</h2>
            <p className="text-neutral-500 max-w-lg mx-auto">
              Choose a tool below to get started. More tools are on the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {toolCards.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
                notifyEmail={notifyEmail}
                setNotifyEmail={setNotifyEmail}
                notifySubmitted={notifySubmitted}
                onNotify={handleNotify}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          Features Section
          ============================================ */}
      <section className="py-16 sm:py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-3">Why KrocPDF?</h2>
            <p className="text-neutral-500">Built different. Built right.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your files are processed locally in your browser using WebAssembly. Nothing is uploaded unless you choose Cloud mode."
              accentColor="blue"
            />
            <FeatureCard
              icon={Zap}
              title="Blazing Fast"
              description="Dual-engine architecture: instant local processing or high-throughput Go workers for batch conversions."
              accentColor="purple"
            />
            <FeatureCard
              icon={Wifi}
              title="Works Offline"
              description="Local conversion works without an internet connection. No accounts, no uploads, no tracking."
              accentColor="green"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================
   Sub-Components
   ========================================== */

function TrustBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center space-x-1.5 text-sm text-neutral-500">
      <Icon className="w-4 h-4 text-green-500/70" />
      <span>{text}</span>
    </div>
  );
}

function ToolCard({
  tool,
  activeTooltip,
  setActiveTooltip,
  notifyEmail,
  setNotifyEmail,
  notifySubmitted,
  onNotify,
}: {
  tool: ToolCardConfig;
  activeTooltip: string | null;
  setActiveTooltip: (slug: string | null) => void;
  notifyEmail: string;
  setNotifyEmail: (email: string) => void;
  notifySubmitted: Set<string>;
  onNotify: (slug: string) => void;
}) {
  const Icon = iconMap[tool.iconId];
  const isTooltipOpen = activeTooltip === tool.slug;

  if (tool.comingSoon) {
    return (
      <div className="tooltip-container relative">
        <div
          className="card-glow-muted bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center"
          onClick={() => setActiveTooltip(isTooltipOpen ? null : tool.slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTooltip(isTooltipOpen ? null : tool.slug);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${tool.name} — coming soon`}
          aria-expanded={isTooltipOpen}
        >
          <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 bg-neutral-800/50">
            <Icon className="w-6 h-6 text-neutral-600" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h3 className="font-semibold text-neutral-500">{tool.name}</h3>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-500">
              Soon
            </span>
          </div>
          <p className="text-sm text-neutral-600">{tool.shortDescription}</p>
        </div>

        {/* Tooltip */}
        {isTooltipOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-72 animate-scale-in">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-xl shadow-black/30">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-semibold text-neutral-200">Coming Soon</p>
              </div>
              <p className="text-xs text-neutral-400 mb-3">{tool.comingSoonBlurb}</p>

              {notifySubmitted.has(tool.slug) ? (
                <p className="text-xs text-green-400 font-medium">
                  ✓ We&apos;ll notify you when this ships!
                </p>
              ) : (
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      aria-label="Email for notification"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onNotify(tool.slug);
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotify(tool.slug);
                    }}
                    className="px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Notify
                  </button>
                </div>
              )}

              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-neutral-900" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className="card-glow bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center block"
      role="link"
      aria-label={`Open ${tool.name} converter`}
    >
      <div
        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${tool.accentFrom}15, ${tool.accentTo}15)`,
        }}
      >
        <Icon
          className="w-6 h-6"
          style={{ color: tool.accentFrom }}
        />
      </div>
      <h3 className="font-semibold text-neutral-200 mb-2">{tool.name}</h3>
      <p className="text-sm text-neutral-500">{tool.shortDescription}</p>
    </Link>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor: 'blue' | 'purple' | 'green';
}) {
  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400' },
  };

  const colors = colorMap[accentColor];

  return (
    <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6 hover:border-neutral-700 transition-colors">
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4", colors.bg)}>
        <Icon className={clsx("w-5 h-5", colors.text)} />
      </div>
      <h3 className="font-semibold text-neutral-200 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}
