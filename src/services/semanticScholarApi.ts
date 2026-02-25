const S2_BATCH_ENDPOINT = 'https://api.semanticscholar.org/graph/v1/paper/batch';

interface S2BatchResult {
  paperId: string;
  externalIds?: { ArXiv?: string };
}

export async function fetchS2PaperIds(
  arxivIds: string[],
): Promise<Map<string, string>> {
  if (arxivIds.length === 0) return new Map();

  const ids = arxivIds.map((id) => `ARXIV:${id}`);

  try {
    const response = await fetch(`${S2_BATCH_ENDPOINT}?fields=paperId,externalIds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      console.warn(`S2 batch request failed: ${response.status}`);
      return new Map();
    }

    const data: (S2BatchResult | null)[] = await response.json();
    const result = new Map<string, string>();

    data.forEach((paper, index) => {
      if (paper?.paperId) {
        result.set(arxivIds[index], paper.paperId);
      }
    });

    return result;
  } catch (e) {
    console.warn('S2 batch request error:', e);
    return new Map();
  }
}

export function getS2FigureUrl(paperId: string, page: number): string {
  return `https://figures.semanticscholar.org/${paperId}/500px/${page}-Figure1-1.png`;
}
