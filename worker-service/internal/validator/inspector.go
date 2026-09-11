package validator

import (
	"bytes"
	"errors"
	"image"
	_ "image/jpeg"
	_ "image/png"
)

var (
	ErrDecompressionBomb  = errors.New("image exceeds 50 megapixel limit")
	ErrInvalidImageHeader = errors.New("invalid or corrupt image header")
)

// Sniff parses the image header from a byte chunk without full decompression.
func Sniff(headerBytes []byte) (string, error) {
	if len(headerBytes) < 16 {
		return "", ErrInvalidImageHeader
	}

	// Magic byte checks
	isJPEG := headerBytes[0] == 0xFF && headerBytes[1] == 0xD8 && headerBytes[2] == 0xFF
	isPNG := headerBytes[0] == 0x89 && headerBytes[1] == 0x50 && headerBytes[2] == 0x4E && headerBytes[3] == 0x47 &&
		headerBytes[4] == 0x0D && headerBytes[5] == 0x0A && headerBytes[6] == 0x1A && headerBytes[7] == 0x0A
	isWebP := headerBytes[0] == 0x52 && headerBytes[1] == 0x49 && headerBytes[2] == 0x46 && headerBytes[3] == 0x46 &&
		headerBytes[8] == 0x57 && headerBytes[9] == 0x45 && headerBytes[10] == 0x42 && headerBytes[11] == 0x50

	if !isJPEG && !isPNG && !isWebP {
		return "", ErrInvalidImageHeader
	}

	config, format, err := image.DecodeConfig(bytes.NewReader(headerBytes))
	if err != nil {
		// It's possible the chunk wasn't large enough to decode the header,
		// but 64KB is generally plenty for JPG/PNG.
		return "", ErrInvalidImageHeader
	}

	pixels := int64(config.Width) * int64(config.Height)
	
	// 50 MP limit = 50,000,000 pixels
	if pixels > 50_000_000 {
		return "", ErrDecompressionBomb
	}

	return format, nil
}
