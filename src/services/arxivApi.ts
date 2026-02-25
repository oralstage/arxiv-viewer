import type { ArxivPaper } from '../types';

const ATOM_NS = 'http://www.w3.org/2005/Atom';
const ARXIV_NS = 'http://arxiv.org/schemas/atom';

// In dev: Vite proxy at /arxiv-api rewrites to https://export.arxiv.org/api
// In prod: CORS proxy (Cloudflare Worker) at VITE_ARXIV_PROXY_URL
const ARXIV_ENDPOINT = import.meta.env.VITE_ARXIV_PROXY_URL || '/arxiv-api/query';

function extractArxivId(url: string): string {
  const match = url.match(/arxiv\.org\/abs\/(.+?)(?:v\d+)?$/);
  return match ? match[1] : url;
}

function getTextNS(parent: Element, ns: string, tag: string): string {
  const el = parent.getElementsByTagNameNS(ns, tag)[0];
  return el?.textContent?.trim() ?? '';
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function parseArxivXml(xmlString: string): ArxivPaper[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const entries = doc.getElementsByTagNameNS(ATOM_NS, 'entry');

  return Array.from(entries).map((entry) => {
    const rawId = getTextNS(entry, ATOM_NS, 'id');
    const title = normalizeWhitespace(getTextNS(entry, ATOM_NS, 'title'));
    const abstract = normalizeWhitespace(getTextNS(entry, ATOM_NS, 'summary'));
    const published = getTextNS(entry, ATOM_NS, 'published');
    const updated = getTextNS(entry, ATOM_NS, 'updated');

    const authors = Array.from(entry.getElementsByTagNameNS(ATOM_NS, 'author'))
      .map((a) => getTextNS(a, ATOM_NS, 'name'));

    const categories = Array.from(entry.getElementsByTagNameNS(ATOM_NS, 'category'))
      .map((c) => c.getAttribute('term') ?? '')
      .filter(Boolean);

    const primaryCategory =
      entry.getElementsByTagNameNS(ARXIV_NS, 'primary_category')[0]?.getAttribute('term') ??
      categories[0] ??
      '';

    const links = Array.from(entry.getElementsByTagNameNS(ATOM_NS, 'link'));
    const arxivUrl =
      links.find((l) => l.getAttribute('rel') === 'alternate')?.getAttribute('href') ?? '';
    const pdfUrl =
      links.find((l) => l.getAttribute('title') === 'pdf')?.getAttribute('href') ?? '';

    return {
      id: extractArxivId(rawId),
      title,
      authors,
      abstract,
      categories,
      primaryCategory,
      published,
      updated,
      arxivUrl,
      pdfUrl,
    };
  });
}

export async function fetchArxivPapers(
  categories: string[],
  maxResults: number = 50,
): Promise<ArxivPaper[]> {
  if (categories.length === 0) return [];

  const searchQuery = categories.map((c) => `cat:${c}`).join('+OR+');
  const url = `${ARXIV_ENDPOINT}?search_query=${searchQuery}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`arXiv API request failed: ${response.status}`);
  }

  const xmlText = await response.text();
  const papers = parseArxivXml(xmlText);

  // Deduplicate by arXiv ID
  const seen = new Set<string>();
  return papers.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
