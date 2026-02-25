import { useState } from 'react';

interface Props {
  abstract: string;
}

export function AbstractToggle({ abstract }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        {isExpanded ? 'Hide abstract' : 'Show abstract'}
        <svg
          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
          {abstract}
        </p>
      )}
    </div>
  );
}
