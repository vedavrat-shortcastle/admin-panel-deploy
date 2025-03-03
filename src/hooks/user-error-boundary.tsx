import { useState, useCallback } from 'react';

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    // You can add error logging service calls here
    console.error('Caught error:', error);
  }, []);

  return {
    error,
    handleError,
  };
};
