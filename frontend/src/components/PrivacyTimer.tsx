import { useEffect, useState } from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';

export function PrivacyTimer({ 
  jobId, 
  onDelete 
}: { 
  jobId: string; 
  onDelete: () => void; 
}) {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`http://localhost:4000/api/v1/conversions/${jobId}`, {
        method: 'DELETE',
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete job', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 border border-green-900/50 bg-green-950/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center text-green-400 mb-4 sm:mb-0">
        <ShieldCheck className="w-5 h-5 mr-2" />
        <div>
          <p className="font-medium text-sm text-green-300">Privacy Guaranteed</p>
          <p className="text-xs text-green-500/80">
            Files auto-delete in <span className="font-mono font-bold text-green-400">{formatTime(timeLeft)}</span>
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center px-4 py-2 bg-red-950/50 hover:bg-red-900/80 text-red-400 text-sm font-medium rounded-lg transition border border-red-900/50 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete Now'}
      </button>
    </div>
  );
}
