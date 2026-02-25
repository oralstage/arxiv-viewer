export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  primaryCategory: string;
  published: string;
  updated: string;
  arxivUrl: string;
  pdfUrl: string;
}

export interface PaperWithS2 extends ArxivPaper {
  s2PaperId: string | null;
  matchesKeyword: boolean;
}

export type FilterMode = 'highlight' | 'filter';

export interface CategoryGroup {
  label: string;
  categories: CategoryInfo[];
}

export interface CategoryInfo {
  id: string;
  name: string;
}
