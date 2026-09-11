package processor

import (
	"encoding/base64"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"github.com/h2non/bimg"
)

// A standard 1x1 transparent PNG base64 string
const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

func TestProcessImage(t *testing.T) {
	// Only run this test if libvips is present, as bimg requires CGO and libvips
	if bimg.VipsVersion == "" {
		t.Skip("libvips not available, skipping test")
	}

	tempDir, err := ioutil.TempDir("", "process_image_test")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	pngBytes, _ := base64.StdEncoding.DecodeString(transparentPngBase64)
	inputPath := filepath.Join(tempDir, "transparent.png")
	err = ioutil.WriteFile(inputPath, pngBytes, 0644)
	if err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name             string
		transparencyMode string
		expectedFormat   string
		expectAlpha      bool
	}{
		{
			name:             "Keep Transparent",
			transparencyMode: "keep_transparent",
			expectedFormat:   "png",
			expectAlpha:      true,
		},
		{
			name:             "Flatten White",
			transparencyMode: "flatten_white",
			expectedFormat:   "jpeg",
			expectAlpha:      false,
		},
		{
			name:             "Flatten Black",
			transparencyMode: "flatten_black",
			expectedFormat:   "jpeg",
			expectAlpha:      false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			outPath, err := ProcessImage(inputPath, "png", tt.transparencyMode)
			if err != nil {
				t.Fatalf("ProcessImage failed: %v", err)
			}

			outBytes, err := ioutil.ReadFile(outPath)
			if err != nil {
				t.Fatalf("Failed to read output: %v", err)
			}

			img := bimg.NewImage(outBytes)
			meta, err := img.Metadata()
			if err != nil {
				t.Fatalf("Failed to read metadata: %v", err)
			}

			if meta.Type != tt.expectedFormat {
				t.Errorf("Expected format %s, got %s", tt.expectedFormat, meta.Type)
			}

			if meta.Alpha != tt.expectAlpha {
				t.Errorf("Expected alpha channel presence to be %v, got %v", tt.expectAlpha, meta.Alpha)
			}
		})
	}
}
