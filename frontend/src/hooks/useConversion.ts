import { useState, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../lib/api';

export type JobStatus = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'READY' | 'ERROR';

export function useConversion() {
  const [status, setStatus] = useState<JobStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
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
      setJobId(jobId);

      const res = await fetch(`${API_BASE_URL}/api/v1/conversions/${jobId}/start`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to start conversion job');

      // Clean up any existing connection
      cleanupSSE();

      // Initiate SSE connection
      const es = new EventSource(`${API_BASE_URL}/api/v1/conversions/${jobId}/events`);
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

      es.addEventListener('error', (e: Event) => {
        // Sometimes the backend sends an explicit error event payload, otherwise it's a generic connection error
        let errorMsg = 'Connection to server lost or job failed.';
        try {
          if ('data' in e && typeof (e as MessageEvent).data === 'string') {
            const data = JSON.parse((e as MessageEvent).data);
            errorMsg = data.message || errorMsg;
          }
        } catch { }

        setMessage(errorMsg);
        setStatus('ERROR');
        cleanupSSE();
      });

    } catch (err: unknown) {
      setStatus('ERROR');
      setMessage(err instanceof Error ? err.message : 'An unknown error occurred');
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
    setDownloadUrl,
    jobId,
    setJobId,
    triggerJobAndListen,
    cleanupSSE
  };
}
