"use client";

import { Component, ReactNode } from "react";
import { getUserFriendlyError } from "@/lib/errors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorMessage: getUserFriendlyError(error)
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 max-w-md text-center">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
            <p className="text-shit-medium mb-4">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-shit-darker text-cream px-6 py-2 rounded-lg hover:bg-shit-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error display component for forms
 */
export function ErrorDisplay({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-800">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-shit-brown"></div>
      <span className="text-shit-medium">{message}</span>
    </div>
  );
}
