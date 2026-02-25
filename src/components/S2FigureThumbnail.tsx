import { useState } from 'react';
import { getS2FigureUrl } from '../services/semanticScholarApi';

const MAX_PAGE = 10;

interface Props {
  s2PaperId: string | null;
  primaryCategory: string;
  s2Loading: boolean;
}

function getCategoryColor(cat: string): string {
  const colors: Record<string, string> = {
    'cond-mat': '#2563eb',
    'quant-ph': '#7c3aed',
    'physics': '#0891b2',
    'cs': '#059669',
    'math': '#d97706',
    'hep': '#dc2626',
    'astro': '#4f46e5',
    'stat': '#0d9488',
    'eess': '#6366f1',
    'q-bio': '#16a34a',
  };
  const prefix = cat.split('.')[0].split('-')[0];
  return colors[prefix] ?? '#6b7280';
}

export function S2FigureThumbnail({ s2PaperId, primaryCategory, s2Loading }: Props) {
  const [page, setPage] = useState(1);
  const [failed, setFailed] = useState(false);

  if (s2Loading) {
    return <div className="h-44 bg-gray-100 animate-pulse rounded-t-lg" />;
  }

  if (!s2PaperId || failed) {
    const color = getCategoryColor(primaryCategory);
    return (
      <div
        className="h-44 flex items-center justify-center rounded-t-lg"
        style={{ background: `linear-gradient(135deg, ${color}15, ${color}30)` }}
      >
        <div className="text-center">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-xs font-mono text-gray-500">{primaryCategory}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-44 bg-gray-50 rounded-t-lg overflow-hidden">
      <img
        src={getS2FigureUrl(s2PaperId, page)}
        alt="Figure 1"
        className="w-full h-full object-contain"
        onError={() => {
          if (page < MAX_PAGE) {
            setPage((p) => p + 1);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
