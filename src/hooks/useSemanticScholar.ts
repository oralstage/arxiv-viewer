import { useState, useEffect } from 'react';
import type { ArxivPaper } from '../types';
import { fetchS2PaperIds } from '../services/semanticScholarApi';

export function useSemanticScholar(papers: ArxivPaper[]) {
  const [paperIdMap, setPaperIdMap] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (papers.length === 0) {
      setPaperIdMap(new Map());
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const arxivIds = papers.map((p) => p.id);
    fetchS2PaperIds(arxivIds)
      .then((data) => {
        if (!cancelled) setPaperIdMap(data);
      })
      .catch(() => {
        if (!cancelled) setPaperIdMap(new Map());
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [papers]);

  return { paperIdMap, isLoading };
}
