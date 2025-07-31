"use client";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="h-full bg-gray-900">
        <main className="flex h-screen flex-col items-center justify-center p-8">
          <div className="text-white text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Application Error</h1>
            <p className="text-gray-400 mb-6">
              A critical error occurred while loading the dashboard application.
            </p>
            
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                Error Details
              </summary>
              <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto text-red-400 whitespace-pre-wrap">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>

            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/config'}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
              >
                Configure Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Reload
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
