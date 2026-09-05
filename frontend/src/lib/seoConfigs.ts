export interface SeoConfig {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  toolSchemaName: string;
}

const configs: Record<string, SeoConfig> = {
  'jpg-to-pdf': {
    title: 'Convert JPG to PDF Online | Free & Secure',
    description: 'Convert your JPG images to PDF documents instantly. 100% secure, local in-browser conversion or blazing fast cloud servers.',
    h1: 'JPG to PDF',
    subtitle: 'Secure, client-side direct uploads. Blazing fast conversion.',
    toolSchemaName: 'JPG to PDF Converter'
  },
  'png-to-pdf': {
    title: 'Convert PNG to PDF Online | Free & Secure',
    description: 'Convert your PNG transparent images to PDF documents instantly. 100% secure, local in-browser conversion.',
    h1: 'PNG to PDF',
    subtitle: 'Preserve transparency and quality. Secure PNG conversion.',
    toolSchemaName: 'PNG to PDF Converter'
  },
  'jpeg-to-pdf': {
    title: 'Convert JPEG to PDF Online | Free & Secure',
    description: 'Convert your JPEG photos to PDF documents instantly. High quality, no watermark.',
    h1: 'JPEG to PDF',
    subtitle: 'High quality JPEG conversion. No limits, no watermarks.',
    toolSchemaName: 'JPEG to PDF Converter'
  }
};

export const getSeoConfig = (tool: string): SeoConfig => {
  return configs[tool] || configs['jpg-to-pdf'];
};
