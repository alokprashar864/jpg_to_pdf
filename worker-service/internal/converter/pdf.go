package converter

import (
	"context"
	"fmt"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/types"
)

// GetImportConfig translates layout settings into a pdfcpu configuration string
func GetImportConfig(pageSize, orientation, margins string) string {
	formSize := pageSize
	if formSize == "FIT_TO_IMAGE" || formSize == "CUSTOM" {
		formSize = "A4" // Fallback for unsupported sizes in this MVP
	}

	if orientation == "LANDSCAPE" {
		formSize += "L"
	}

	scale := "1.0"
	switch margins {
	case "SMALL":
		scale = "0.95"
	case "MEDIUM":
		scale = "0.9"
	case "LARGE":
		scale = "0.8"
	}

	return fmt.Sprintf("f:%s, pos:c, sc:%s", formSize, scale)
}

// GeneratePDF takes a list of downloaded image file paths and merges them into a PDF.
// Using physical files is preferred for memory constraints.
func GeneratePDF(ctx context.Context, imagePaths []string, outPath string, pageSize, orientation, margins string) error {
	importConfig := GetImportConfig(pageSize, orientation, margins)
	
	imp, _ := api.Import(importConfig, types.POINTS)
	
	err := api.ImportImagesFile(imagePaths, outPath, imp, nil)
	return err
}
