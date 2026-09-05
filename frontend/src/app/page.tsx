import { ConverterWidget } from '@/components/ConverterWidget';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            JPG to PDF
          </h1>
          <p className="text-neutral-400">Secure, client-side direct uploads. Blazing fast conversion.</p>
        </div>

        <ConverterWidget />
      </div>
    </div>
  );
}
