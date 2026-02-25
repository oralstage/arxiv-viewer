/**
 * Cloudflare Worker - CORS proxy for arXiv API
 *
 * Deploy: npx wrangler deploy
 * Then set VITE_ARXIV_PROXY_URL in .env.production to your worker URL + /arxiv
 * e.g. VITE_ARXIV_PROXY_URL=https://arxiv-proxy.your-subdomain.workers.dev/arxiv
 */

const ALLOWED_ORIGINS = ['*'];
const ARXIV_API = 'https://export.arxiv.org/api/query';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);

    if (!url.pathname.startsWith('/arxiv')) {
      return new Response('Not found', { status: 404 });
    }

    // Forward query params to arXiv API
    const arxivUrl = `${ARXIV_API}${url.search}`;

    try {
      const response = await fetch(arxivUrl, {
        headers: { 'User-Agent': 'arxiv-viewer/1.0' },
      });

      const body = await response.text();
      return new Response(body, {
        status: response.status,
        headers: {
          ...corsHeaders(origin),
          'Content-Type': response.headers.get('Content-Type') || 'application/xml',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (e) {
      return new Response(`Proxy error: ${e.message}`, {
        status: 502,
        headers: corsHeaders(origin),
      });
    }
  },
};
