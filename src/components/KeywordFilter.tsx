import type { FilterMode } from '../types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  mode: FilterMode;
  onModeChange: (mode: FilterMode) => void;
  totalCount: number;
  filteredCount: number;
  hasKeywords: boolean;
}

export function KeywordFilter({ value, onChange, mode, onModeChange, totalCount, filteredCount, hasKeywords }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Filter by keywords (comma or space separated)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-arxiv-red/50 focus:border-arxiv-red"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
            <button
              onClick={() => onModeChange('highlight')}
              className={`px-3 py-2 ${mode === 'highlight' ? 'bg-arxiv-red text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Highlight
            </button>
            <button
              onClick={() => onModeChange('filter')}
              className={`px-3 py-2 ${mode === 'filter' ? 'bg-arxiv-red text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
      {hasKeywords && (
        <p className="text-xs text-gray-500 mt-2">
          {mode === 'filter'
            ? `Showing ${filteredCount} of ${totalCount} papers`
            : `${filteredCount} papers match your keywords`}
        </p>
      )}
    </div>
  );
}
