# Requirements: Expanding to PNG: The Transparency Challenge

## 1. Transparency & Alpha Channel Controls
- **Transparency Modes**:
  - `FLATTEN_WHITE`: Composite transparent pixels against solid white `#FFFFFF` (default, recommended for standard printing).
  - `FLATTEN_BLACK`: Composite transparent pixels against solid black `#000000` (for high-contrast/light artwork).
  - `KEEP_TRANSPARENT`: Retain raw 32-bit RGBA alpha channel inside the PDF output (for digital presentations and overlays).
- **Dual-Engine Execution**:
  - **Client-Side WASM Engine**: Execute alpha compositing on HTML5 `OffscreenCanvas` / 2D Canvas context before encoding with `pdf-lib`.
  - **Go Cloud Worker**: Execute alpha flattening or transparency preservation in Go worker before `pdfcpu` assembly.

## 2. Color Profile Normalization
- **sRGB Conversion**: Explicitly convert indexed-color (palette PNG-8) and grayscale-alpha PNGs into standard sRGB 24-bit/32-bit color space to prevent color distortion across PDF viewers (Adobe Acrobat, Preview, Chrome PDF).

## 3. Enterprise Reliability & Dual-Engine Safeguards
- **WASM Memory Bounding**:
  - Implement sequential chunked rendering (process $N=1$ image canvas buffer at a time) rather than unconstrained `Promise.all()` to prevent browser tab memory exhaustion.
  - Revoke object URLs and dereference image bitmaps immediately after page embedding.
- **Auto-Fallback Routing**:
  - Automatically evaluate total payload and image count (threshold $\le 20$ files and $\le 50\text{ MB}$, or fallback on memory pressure) to smoothly transfer to the Go worker pipeline without user intervention.
- **Binary Header Pre-check & Sanitization**:
  - Validate magic bytes (`\x89PNG\r\n\x1a\n` for PNG, `\xFF\xD8\xFF` for JPEG) on upload.
  - Reject corrupted or truncated image files before enqueuing to Redis Streams or passing to `pdfcpu`.

## 4. UI & Frontend Modernization (`frontend/`)
- **Transparency Settings Control**:
  - Clean segmented control alongside existing Page Size and Margins settings:
    - `Flatten (White)`
    - `Flatten (Black)`
    - `Keep Transparent`
- **Engine State Indicator Badge**:
  - Dynamic visual badge indicating current active engine:
    - ⚡ *Processing Locally (Zero-Trust)*
    - ☁️ *Cloud Batch Mode*
- **Checkerboard Previews**:
  - CSS checkerboard background on drag-and-drop thumbnail cards to ensure transparent white logos are clearly visible against the glassmorphic dark/light UI.
- **Accepted File Extensions**:
  - Accept `.png`, `.jpg`, `.jpeg`, `.webp` in dropzones and file dialogs.
