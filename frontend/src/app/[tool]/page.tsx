import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ConverterWidget } from '@/components/ConverterWidget';
import { getSeoConfig, getSiblingTools, toolCards } from '@/lib/seoConfigs';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return [
    { tool: 'jpg-to-pdf' },
    { tool: 'png-to-pdf' },
    { tool: 'jpeg-to-pdf' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const config = getSeoConfig(tool);
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `https://your-domain.com/${tool}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;

  // Only allow valid routes
  const validTools = ['jpg-to-pdf', 'png-to-pdf', 'jpeg-to-pdf'];
  if (!validTools.includes(tool)) {
    notFound();
  }

  const config = getSeoConfig(tool);
  const siblings = getSiblingTools(tool);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.toolSchemaName,
    "operatingSystem": "WebBrowser",
    "applicationCategory": "UtilitiesApplication",
    "description": config.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-950 text-neutral-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl w-full mb-6 pt-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to All Tools
        </Link>
      </div>
      
      <div className="max-w-4xl w-full space-y-8 pb-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {config.h1}
          </h1>
          <p className="text-neutral-400">{config.subtitle}</p>
        </div>

        <ConverterWidget />

        {/* Sibling Tool Links */}
        {siblings.length > 0 && (
          <div className="pt-8 border-t border-neutral-800/50">
            <p className="text-sm text-neutral-500 mb-3">Try also:</p>
            <div className="flex flex-wrap gap-2">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`/${sibling.slug}`}
                  className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
                >
                  {sibling.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
