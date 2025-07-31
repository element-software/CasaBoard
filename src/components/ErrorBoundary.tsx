"use client";
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return (
        <Fallback 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-8 bg-gray-900">
      <div className="text-white text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Dashboard Error</h1>
        <p className="text-gray-400 mb-4">
          Something went wrong while loading the dashboard.
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error Details
            </summary>
            <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto text-red-400">
              {error.message}
            </pre>
          </details>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/config"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Configure Dashboard
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </main>
  );
}
