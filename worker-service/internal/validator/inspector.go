package validator

import (
	"bytes"
	"errors"
	"image"
	_ "image/jpeg"
	_ "image/png"
)

var ErrDecompressionBomb = errors.New("image exceeds 50 megapixel limit")

// Sniff parses the image header from a byte chunk without full decompression.
func Sniff(headerBytes []byte) error {
	config, _, err := image.DecodeConfig(bytes.NewReader(headerBytes))
	if err != nil {
		// It's possible the chunk wasn't large enough to decode the header,
		// but 64KB is generally plenty for JPG/PNG.
		return err
	}

	pixels := int64(config.Width) * int64(config.Height)
	
	// 50 MP limit = 50,000,000 pixels
	if pixels > 50_000_000 {
		return ErrDecompressionBomb
	}

	return nil
}
