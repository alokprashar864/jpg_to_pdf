export async function validateImageHeader(file: File): Promise<boolean> {
  if (file.size < 16) return false;
  
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 && // P
    bytes[2] === 0x4E && // N
    bytes[3] === 0x47 && // G
    bytes[4] === 0x0D && // \r
    bytes[5] === 0x0A && // \n
    bytes[6] === 0x1A && 
    bytes[7] === 0x0A
  ) {
    return true;
  }

  // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return true;
  }

  return false;
}
