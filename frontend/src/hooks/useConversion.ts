import { useState, useRef, useCallback } from 'react';

export type JobStatus = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'READY' | 'ERROR';

export function useConversion() {
  const [status, setStatus] = useState<JobStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const cleanupSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const triggerJobAndListen = async (jobId: string) => {
    try {
      setStatus('PROCESSING');
      setProgress(0);
      setMessage('Triggering conversion worker...');

      const res = await fetch(`http://localhost:3000/api/v1/conversions/${jobId}/start`, {
        method: 'POST',
      });
      
      if (!res.ok) throw new Error('Failed to start conversion job');

      // Clean up any existing connection
      cleanupSSE();

      // Initiate SSE connection
      const es = new EventSource(`http://localhost:3000/api/v1/conversions/${jobId}/events`);
      eventSourceRef.current = es;

      es.addEventListener('status', (e) => {
        const data = JSON.parse(e.data);
        setProgress(data.progress);
        setMessage(data.message);
      });

      es.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        setProgress(100);
        setMessage('Conversion complete!');
        setDownloadUrl(data.downloadUrl || data.data?.downloadUrl);
        setStatus('READY');
        cleanupSSE();
      });

      es.addEventListener('error', (e) => {
        // Sometimes the backend sends an explicit error event payload, otherwise it's a generic connection error
        let errorMsg = 'Connection to server lost or job failed.';
        try {
          if ((e as any).data) {
            const data = JSON.parse((e as any).data);
            errorMsg = data.message || errorMsg;
          }
        } catch {}

        setMessage(errorMsg);
        setStatus('ERROR');
        cleanupSSE();
      });

    } catch (err: any) {
      setStatus('ERROR');
      setMessage(err.message);
    }
  };

  return {
    status,
    setStatus,
    progress,
    setProgress,
    message,
    setMessage,
    downloadUrl,
    triggerJobAndListen,
    cleanupSSE
  };
}
