package converter

import (
	"context"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

// GeneratePDF takes a list of downloaded image file paths and merges them into a PDF.
// Using physical files is preferred for memory constraints.
func GeneratePDF(ctx context.Context, imagePaths []string, outPath string) error {
	imp, _ := api.Import("form:A4, pos:c, sc:1.0", model.RELOAD)
	
	err := api.ImportImagesFile(imagePaths, outPath, imp, nil)
	return err
}
