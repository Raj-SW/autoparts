import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with loading and error states
 */
export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await asyncFunction(...args);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute, reset };
}

