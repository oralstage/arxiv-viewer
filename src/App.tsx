import { useMemo } from 'react';
import type { PaperWithS2 } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useArxivPapers } from './hooks/useArxivPapers';
import { useSemanticScholar } from './hooks/useSemanticScholar';
import { useKeywordFilter } from './hooks/useKeywordFilter';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { KeywordFilter } from './components/KeywordFilter';
import { PaperList } from './components/PaperList';

function App() {
  const [selectedCategories, setSelectedCategories] = useLocalStorage<string[]>(
    'arxiv-viewer-categories',
    ['cond-mat.mes-hall'],
  );

  const { papers, isLoading: arxivLoading, isLoadingMore, error, hasMore, refetch, loadMore } = useArxivPapers(selectedCategories);
  const { paperIdMap, isLoading: s2Loading } = useSemanticScholar(papers);
  const { inputValue, setInputValue, mode, setMode, filterPapers, hasKeywords } = useKeywordFilter();

  const enrichedPapers: PaperWithS2[] = useMemo(
    () =>
      papers.map((paper) => ({
        ...paper,
        s2PaperId: paperIdMap.get(paper.id) ?? null,
        matchesKeyword: false,
      })),
    [papers, paperIdMap],
  );

  const displayPapers = useMemo(() => filterPapers(enrichedPapers), [filterPapers, enrichedPapers]);

  const matchCount = displayPapers.filter((p) => p.matchesKeyword).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <CategorySelector selected={selectedCategories} onChange={setSelectedCategories} />
        <KeywordFilter
          value={inputValue}
          onChange={setInputValue}
          mode={mode}
          onModeChange={setMode}
          totalCount={enrichedPapers.length}
          filteredCount={mode === 'filter' ? displayPapers.length : matchCount}
          hasKeywords={hasKeywords}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
            <p className="font-medium">Error loading papers</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {arxivLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-arxiv-red border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 mt-3 text-sm">Fetching papers from arXiv...</p>
            </div>
          </div>
        )}

        {!arxivLoading && !error && (
          <>
            {papers.length > 0 && (
              <p className="text-sm text-gray-500 mb-3">
                {displayPapers.length} papers
                {displayPapers.length !== papers.length && ` (of ${papers.length})`}
                {s2Loading && ' · Loading thumbnails...'}
              </p>
            )}
            <PaperList papers={displayPapers} s2Loading={s2Loading} />

            {hasMore && !isLoadingMore && (
              <div className="flex justify-center mt-6 mb-4">
                <button
                  onClick={loadMore}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-medium shadow-sm"
                >
                  Load more papers
                </button>
              </div>
            )}

            {isLoadingMore && (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-3 border-arxiv-red border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm ml-3">Loading more papers...</span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
