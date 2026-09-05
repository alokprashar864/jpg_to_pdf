import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConverterWidget } from '@/components/ConverterWidget';
import { getSeoConfig } from '@/lib/seoConfigs';

export async function generateMetadata({ params }: { params: { tool: string } }): Promise<Metadata> {
  const config = getSeoConfig(params.tool);
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `https://your-domain.com/${params.tool}`,
    },
  };
}

export default function ToolPage({ params }: { params: { tool: string } }) {
  // Only allow valid routes
  const validTools = ['jpg-to-pdf', 'png-to-pdf', 'jpeg-to-pdf'];
  if (!validTools.includes(params.tool)) {
    notFound();
  }

  const config = getSeoConfig(params.tool);

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8 font-sans">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {config.h1}
          </h1>
          <p className="text-neutral-400">{config.subtitle}</p>
        </div>

        <ConverterWidget />
      </div>
    </div>
  );
}
