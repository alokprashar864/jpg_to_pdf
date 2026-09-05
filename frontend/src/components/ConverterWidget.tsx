'use client';

import { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useConversion, JobStatus } from '@/hooks/useConversion';
import { uploadFileToS3 } from '@/lib/uploader';
import { generateLocalPdf } from '@/lib/localConverter';
import { API_BASE_URL } from '@/lib/api';
import { PrivacyTimer } from '@/components/PrivacyTimer';
import { UploadCloud, GripVertical, X, FileImage, Settings, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export function ConverterWidget() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState({ pageSize: 'A4', orientation: 'PORTRAIT', margins: 'NONE', dpi: 150, engine: 'cloud' });

  const { status, setStatus, progress, setProgress, message, setMessage, downloadUrl, setDownloadUrl, jobId, triggerJobAndListen, cleanupSSE } = useConversion();

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
      cleanupSSE();
    };
  }, [images, cleanupSSE]);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (status !== 'IDLE' && status !== 'ERROR') return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
      f.type === 'image/jpeg' || f.type === 'image/png'
    );

    const newImages = droppedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [status]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const startConversion = async () => {
    if (images.length === 0) return;

    try {
      setStatus('UPLOADING');
      setProgress(0);

      if (settings.engine === 'local') {
        setMessage('Generating PDF locally in your browser...');
        const url = await generateLocalPdf(
          images.map(img => img.file),
          settings,
          (percent) => setProgress(percent)
        );
        setMessage('Local conversion complete!');
        setDownloadUrl(url); // Set download directly, skipping SSE
        setStatus('READY');
        return;
      }

      setMessage('Requesting upload URLs...');

      const payload = {
        settings,
        files: images.map(img => ({
          fileName: img.file.name,
          mimeType: img.file.type,
          sizeBytes: img.file.size
        }))
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to initiate conversion. Ensure the backend is running.');
      const data = await res.json();

      setMessage('Uploading images securely to storage...');

      let completedUploads = 0;

      const uploadPromises = images.map((img, i) => {
        const target = data.uploadTargets.find((t: any) => t.sequenceOrder === i);
        if (!target) throw new Error('Missing upload target for sequence ' + i);

        return uploadFileToS3(img.file, target.presignedPutUrl, (percent) => {
          // Track progress
        }).then(() => {
          completedUploads++;
          setProgress((completedUploads / images.length) * 100);
        });
      });

      await Promise.all(uploadPromises);

      await triggerJobAndListen(data.jobId);

    } catch (err: any) {
      setStatus('ERROR');
      setMessage(err.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-4xl w-full space-y-8">
      {/* Status Banner */}
        {status !== 'IDLE' && (
          <div className={clsx(
            "p-6 rounded-2xl border text-center space-y-4",
            status === 'ERROR' ? "bg-red-950/30 border-red-900/50 text-red-400" :
              status === 'READY' ? "bg-green-950/30 border-green-900/50 text-green-400" :
                "bg-blue-950/30 border-blue-900/50 text-blue-400"
          )}>
            <div className="font-medium text-lg flex items-center justify-center">
              {(status === 'UPLOADING' || status === 'PROCESSING') && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
              {message}
            </div>

            {(status === 'UPLOADING' || status === 'PROCESSING') && (
              <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden border border-neutral-800">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {status === 'READY' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="converted.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition shadow-lg shadow-green-900/20"
                  >
                    Download PDF
                  </a>
                )}
                <button
                  onClick={() => {
                    setImages([]);
                    setStatus('IDLE');
                  }}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white font-medium transition"
                >
                  Convert Another
                </button>
              </div>
            )}

            {status === 'READY' && jobId && (
              <PrivacyTimer
                jobId={jobId}
                onDelete={() => {
                  setStatus('IDLE');
                  setImages([]);
                  setMessage('Files successfully deleted from server.');
                }}
              />
            )}

            {status === 'ERROR' && (
              <button
                onClick={() => setStatus('IDLE')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Main Workspace */}
        {(status === 'IDLE' || status === 'ERROR') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Left: Dropzone */}
            <div
              onDragOver={onDragOver}
              onDrop={onDrop}
              className="md:col-span-2 border-2 border-dashed border-neutral-800 hover:border-blue-500/50 bg-neutral-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-h-[300px]"
            >
              <UploadCloud className="w-12 h-12 text-neutral-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Drag & Drop images here</h3>
              <p className="text-neutral-500 mb-6">Supports .JPG, .JPEG, .PNG up to 50 Megapixels</p>

              <label className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition cursor-pointer shadow-xl shadow-white/5">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const newImages = Array.from(e.target.files).map(file => ({
                      id: crypto.randomUUID(),
                      file,
                      previewUrl: URL.createObjectURL(file)
                    }));
                    setImages(prev => [...prev, ...newImages]);
                  }}
                />
              </label>
            </div>

            {/* Right: Settings */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-neutral-300 mb-6">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-medium">Document Settings</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                    <p className="text-sm font-medium text-neutral-300">Processing Engine</p>
                    <div className="flex bg-neutral-900 rounded-lg p-1">
                      <button
                        onClick={() => setSettings({ ...settings, engine: 'cloud' })}
                        className={clsx(
                          "flex-1 py-1.5 text-xs font-medium rounded-md transition",
                          settings.engine === 'cloud' ? "bg-blue-600 text-white shadow-md" : "text-neutral-400 hover:text-white"
                        )}
                      >
                        Cloud Fast
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, engine: 'local' })}
                        className={clsx(
                          "flex-1 py-1.5 text-xs font-medium rounded-md transition",
                          settings.engine === 'local' ? "bg-purple-600 text-white shadow-md" : "text-neutral-400 hover:text-white"
                        )}
                      >
                        Local Private
                      </button>
                    </div>
                  </div>

                  <label className="block text-sm text-neutral-400">
                    Page Size
                    <select
                      value={settings.pageSize}
                      onChange={(e) => setSettings({ ...settings, pageSize: e.target.value })}
                      className="mt-1 block w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="A4">A4</option>
                      <option value="LETTER">Letter</option>
                      <option value="FIT_TO_IMAGE">Fit to Image</option>
                    </select>
                  </label>

                  <label className="block text-sm text-neutral-400">
                    Orientation
                    <select
                      value={settings.orientation}
                      onChange={(e) => setSettings({ ...settings, orientation: e.target.value })}
                      className="mt-1 block w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="PORTRAIT">Portrait</option>
                      <option value="LANDSCAPE">Landscape</option>
                      <option value="AUTO">Auto</option>
                    </select>
                  </label>

                  <label className="block text-sm text-neutral-400">
                    Margins
                    <select
                      value={settings.margins}
                      onChange={(e) => setSettings({ ...settings, margins: e.target.value })}
                      className="mt-1 block w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="NONE">None</option>
                      <option value="SMALL">Small</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LARGE">Large</option>
                    </select>
                  </label>
                </div>
              </div>

              <button
                onClick={startConversion}
                disabled={images.length === 0}
                className="w-full mt-8 py-3 bg-blue-600 disabled:bg-neutral-800 disabled:text-neutral-500 hover:bg-blue-500 text-white font-medium rounded-lg transition"
              >
                Convert to PDF
              </button>
            </div>
          </div>
        )}

        {/* Sortable Grid */}
        {(status === 'IDLE' || status === 'ERROR') && images.length > 0 && (
          <div className="pt-8">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <FileImage className="w-5 h-5 mr-2 text-blue-400" />
              Reorder Pages
            </h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4"
                  >
                    {images.map((img, index) => (
                      <Draggable key={img.id} draggableId={img.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={clsx(
                              "relative group w-32 h-40 rounded-xl overflow-hidden border-2",
                              snapshot.isDragging ? "border-blue-500 shadow-xl shadow-blue-500/20" : "border-neutral-800"
                            )}
                          >
                            <img src={img.previewUrl} alt={img.file.name} className="w-full h-full object-cover opacity-80" />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                              <button
                                onClick={() => removeImage(img.id)}
                                className="self-end bg-red-500/80 p-1 rounded hover:bg-red-500 text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>

                              <div {...provided.dragHandleProps} className="self-center p-2 cursor-grab active:cursor-grabbing text-white">
                                <GripVertical className="w-6 h-6" />
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 text-[10px] text-center py-1 truncate px-2 font-medium">
                              {index + 1}. {img.file.name}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

      </div>
  );
}
