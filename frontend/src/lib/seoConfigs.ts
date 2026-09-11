export interface SeoConfig {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  toolSchemaName: string;
}

export interface ToolCardConfig {
  slug: string;
  name: string;
  shortDescription: string;
  iconId: 'image' | 'image-plus' | 'camera' | 'merge' | 'minimize' | 'file-output';
  accentFrom: string;
  accentTo: string;
  comingSoon: boolean;
  comingSoonBlurb?: string;
}

const seoConfigs: Record<string, SeoConfig> = {
  'jpg-to-pdf': {
    title: 'Convert JPG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your JPG images to PDF documents instantly. 100% secure, local in-browser conversion or blazing fast cloud servers.',
    h1: 'JPG to PDF',
    subtitle: 'Secure, client-side direct uploads. Blazing fast conversion.',
    toolSchemaName: 'JPG to PDF Converter'
  },
  'png-to-pdf': {
    title: 'Convert PNG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your PNG transparent images to PDF documents instantly. 100% secure, local in-browser conversion.',
    h1: 'PNG to PDF',
    subtitle: 'Preserve transparency and quality. Secure PNG conversion.',
    toolSchemaName: 'PNG to PDF Converter'
  },
  'jpeg-to-pdf': {
    title: 'Convert JPEG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your JPEG photos to PDF documents instantly. High quality, no watermark.',
    h1: 'JPEG to PDF',
    subtitle: 'High quality JPEG conversion. No limits, no watermarks.',
    toolSchemaName: 'JPEG to PDF Converter'
  }
};

export const toolCards: ToolCardConfig[] = [
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert JPG images to PDF documents instantly.',
    iconId: 'image',
    accentFrom: '#f97316',
    accentTo: '#ef4444',
    comingSoon: false,
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    shortDescription: 'Preserve transparency. Convert PNG to PDF.',
    iconId: 'image-plus',
    accentFrom: '#22c55e',
    accentTo: '#06b6d4',
    comingSoon: false,
  },
  {
    slug: 'jpeg-to-pdf',
    name: 'JPEG to PDF',
    shortDescription: 'High quality JPEG to PDF. No watermarks.',
    iconId: 'camera',
    accentFrom: '#3b82f6',
    accentTo: '#8b5cf6',
    comingSoon: false,
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDFs into a single document.',
    iconId: 'merge',
    accentFrom: '#ec4899',
    accentTo: '#f43f5e',
    comingSoon: true,
    comingSoonBlurb: 'Merge multiple PDF files into one seamless document. Coming in the next release.',
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size without losing quality.',
    iconId: 'minimize',
    accentFrom: '#a855f7',
    accentTo: '#6366f1',
    comingSoon: true,
    comingSoonBlurb: 'Intelligent PDF compression to shrink file sizes while preserving visual quality.',
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Extract pages from PDF as JPG images.',
    iconId: 'file-output',
    accentFrom: '#14b8a6',
    accentTo: '#0ea5e9',
    comingSoon: true,
    comingSoonBlurb: 'Convert PDF pages back to high-resolution JPG images. Batch export supported.',
  },
];

export const getSeoConfig = (tool: string): SeoConfig => {
  return seoConfigs[tool] || seoConfigs['jpg-to-pdf'];
};

export const getActiveTools = (): ToolCardConfig[] => {
  return toolCards.filter(t => !t.comingSoon);
};

export const getSiblingTools = (currentSlug: string): ToolCardConfig[] => {
  return toolCards.filter(t => !t.comingSoon && t.slug !== currentSlug);
};
