import type { PaperWithS2 } from '../types';
import { S2FigureThumbnail } from './S2FigureThumbnail';
import { AbstractToggle } from './AbstractToggle';

interface Props {
  paper: PaperWithS2;
  s2Loading: boolean;
}

export function PaperCard({ paper, s2Loading }: Props) {
  return (
    <article
      className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
        paper.matchesKeyword ? 'ring-2 ring-amber-400 border-amber-300' : 'border-gray-200'
      }`}
    >
      <S2FigureThumbnail
        s2PaperId={paper.s2PaperId}
        primaryCategory={paper.primaryCategory}
        s2Loading={s2Loading}
      />
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {paper.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="inline-block text-xs font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
            >
              {cat}
            </span>
          ))}
          {paper.categories.length > 3 && (
            <span className="text-xs text-gray-400">+{paper.categories.length - 3}</span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 leading-snug text-sm">
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-arxiv-red"
          >
            {paper.title}
          </a>
        </h3>
        <p className="text-xs text-gray-500 mb-1">
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>
        <time className="text-xs text-gray-400">
          {new Date(paper.published).toLocaleDateString()}
        </time>
        <AbstractToggle abstract={paper.abstract} />
        <div className="mt-2 flex gap-2">
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            arXiv
          </a>
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-arxiv-red hover:underline"
            >
              PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
