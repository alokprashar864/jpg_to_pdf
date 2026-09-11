package processor

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/h2non/bimg"
)

// ProcessImage applies alpha flattening and sRGB normalization if necessary.
// It returns the path to the processed image and an error.
func ProcessImage(inputPath string, format string, transparencyMode string) (string, error) {
	// Disable libvips caching for flat memory profile
	bimg.VipsCacheSetMax(0)
	bimg.VipsCacheSetMaxMem(0)

	buffer, err := ioutil.ReadFile(inputPath)
	if err != nil {
		return "", err
	}

	image := bimg.NewImage(buffer)

	// Keep Transparent handling
	if transparencyMode == "KEEP_TRANSPARENT" && format == "png" {
		meta, err := image.Metadata()
		if err == nil && meta.Alpha {
			// Direct passthrough to avoid color inversion or premultiplied alpha bugs
			return inputPath, nil
		}
	}

	var bg bimg.Color
	if transparencyMode == "FLATTEN_BLACK" {
		bg = bimg.Color{R: 0, G: 0, B: 0}
	} else {
		// Default: FLATTEN_WHITE
		bg = bimg.Color{R: 255, G: 255, B: 255}
	}

	options := bimg.Options{
		Type:           bimg.JPEG,
		Quality:        92,
		Background:     bg,
		Interpretation: bimg.InterpretationSRGB,
		NoProfile:      false,
		StripMetadata:  true,
	}

	newImage, err := image.Process(options)
	if err != nil {
		return "", fmt.Errorf("bimg processing failed: %v", err)
	}

	outputPath := inputPath + "_processed.jpg"
	if err := ioutil.WriteFile(outputPath, newImage, 0644); err != nil {
		return "", err
	}

	return outputPath, nil
}
