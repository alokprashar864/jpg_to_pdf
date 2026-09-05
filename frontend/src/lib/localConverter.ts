import { PDFDocument, PageSizes } from 'pdf-lib';

export interface LayoutSettings {
  pageSize: string;
  orientation: string;
  margins: string;
  dpi: number;
}

const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  A4: PageSizes.A4,
  LETTER: PageSizes.Letter,
  LEGAL: [612, 1008], // Legal size in points
};

const getScaleFromMargins = (margins: string): number => {
  switch (margins) {
    case 'SMALL': return 0.95;
    case 'MEDIUM': return 0.90;
    case 'LARGE': return 0.80;
    default: return 1.0;
  }
};

export async function generateLocalPdf(
  files: File[],
  settings: LayoutSettings,
  onProgress: (percent: number) => void
): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    
    let image;
    if (file.type === 'image/jpeg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }
    
    let [pageWidth, pageHeight] = PAGE_DIMENSIONS[settings.pageSize] || PageSizes.A4;
    
    if (settings.pageSize === 'FIT_TO_IMAGE' || settings.pageSize === 'CUSTOM') {
      // In a real app we'd fit to image, but for MVP we fallback to A4 size if FIT_TO_IMAGE
      pageWidth = PageSizes.A4[0];
      pageHeight = PageSizes.A4[1];
    }

    if (settings.orientation === 'LANDSCAPE') {
      [pageWidth, pageHeight] = [pageHeight, pageWidth]; // Swap
    } else if (settings.orientation === 'AUTO') {
      if (image.width > image.height) {
        [pageWidth, pageHeight] = [Math.max(pageWidth, pageHeight), Math.min(pageWidth, pageHeight)];
      } else {
        [pageWidth, pageHeight] = [Math.min(pageWidth, pageHeight), Math.max(pageWidth, pageHeight)];
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
    const scale = getScaleFromMargins(settings.margins);
    
    // Calculate dimensions to fit within the page while maintaining aspect ratio
    const imgDims = image.scale(1);
    const widthRatio = (pageWidth * scale) / imgDims.width;
    const heightRatio = (pageHeight * scale) / imgDims.height;
    const bestRatio = Math.min(widthRatio, heightRatio);
    
    const finalWidth = imgDims.width * bestRatio;
    const finalHeight = imgDims.height * bestRatio;
    
    // Center the image
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;
    
    page.drawImage(image, {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
    });
    
    onProgress(Math.round(((i + 1) / files.length) * 100));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
