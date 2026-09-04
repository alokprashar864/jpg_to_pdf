export async function uploadFileToS3(
  file: File,
  url: string,
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentComplete));
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Upload failed due to network error'));
    
    xhr.open('PUT', url, true);
    
    // Critical: The Content-Type must exactly match what was requested during presigning
    xhr.setRequestHeader('Content-Type', file.type);
    
    xhr.send(file);
  });
}
