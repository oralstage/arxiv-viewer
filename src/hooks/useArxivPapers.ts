import { useState, useEffect, useCallback, useRef } from 'react';
import type { ArxivPaper } from '../types';
import { fetchArxivPapers } from '../services/arxivApi';

export function useArxivPapers(categories: string[]) {
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categoriesKey = categories.sort().join(',');
  const abortRef = useRef<AbortController | null>(null);

  const fetchPapers = useCallback(async () => {
    if (categories.length === 0) {
      setPapers([]);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchArxivPapers(categories);
      if (!controller.signal.aborted) {
        setPapers(result);
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(e instanceof Error ? e.message : 'Failed to fetch papers');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [categoriesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPapers();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPapers]);

  return { papers, isLoading, error, refetch: fetchPapers };
}
