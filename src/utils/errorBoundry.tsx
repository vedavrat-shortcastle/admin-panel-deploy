'use client';

import { useErrorBoundary } from '@/hooks/user-error-boundary';
import { PropsWithChildren, useEffect } from 'react';

export function ErrorBoundary({ children }: PropsWithChildren) {
  const { error, handleError } = useErrorBoundary();

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      event.preventDefault();
      handleError(event.error);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      handleError(new Error(event.reason));
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, [handleError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-red-500 text-lg font-medium mb-2">
          Something went wrong
        </p>
        <p className="text-gray-600 text-sm">Please try refreshing the page</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;
