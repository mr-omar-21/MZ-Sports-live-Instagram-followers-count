import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchUrl(
  url: string,
  headers: Record<string, string>,
  timeout = 15000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (!res.statusCode || res.statusCode >= 400)
          reject(new Error(`HTTP ${res.statusCode}`));
        else resolve(data);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

function extractCount(html: string): number | null {
  const ogMatch = html.match(
    /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/
  );
  if (!ogMatch) return null;
  const fMatch = ogMatch[1].match(/([\d,]+)\s*Followers/i);
  if (!fMatch) return null;
  return parseInt(fMatch[1].replace(/,/g, ''), 10);
}

const BROWSER_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Ch-Ua':
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

const API_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json',
  'X-IG-App-ID': '936619743392459',
  'X-ASBD-ID': '129477',
  'X-Requested-With': 'XMLHttpRequest',
};

async function fetchGraphQL(username: string): Promise<number | null> {
  try {
    const data = await fetchUrl(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      API_HEADERS,
      10000
    );
    const json = JSON.parse(data);
    return json?.data?.user?.edge_followed_by?.count ?? null;
  } catch {
    return null;
  }
}

async function scrapeDirect(username: string): Promise<number | null> {
  try {
    const html = await fetchUrl(
      `https://www.instagram.com/${username}/`,
      BROWSER_HEADERS
    );
    return extractCount(html);
  } catch {
    return null;
  }
}

async function scrapeViaProxy(username: string): Promise<number | null> {
  const proxies = [
    (u: string) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `https://www.instagram.com/${u}/`
      )}`,
    (u: string) =>
      `https://corsproxy.io/?url=${encodeURIComponent(
        `https://www.instagram.com/${u}/`
      )}`,
    (u: string) =>
      `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(
        `https://www.instagram.com/${u}/`
      )}`,
  ];
  for (const buildUrl of proxies) {
    try {
      const html = await fetchUrl(
        buildUrl(username),
        { 'User-Agent': USER_AGENT },
        10000
      );
      const count = extractCount(html);
      if (count !== null) return count;
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const errors: string[] = [];
  let count: number | null = null;

  count = await fetchGraphQL(username);
  if (count === null) errors.push('API direct');

  if (count === null) {
    count = await scrapeDirect(username);
    if (count === null) errors.push('OG direct');
  }

  if (count === null) {
    count = await scrapeViaProxy(username);
    if (count === null) errors.push('OG via proxy');
  }

  if (count === null) {
    return NextResponse.json(
      { error: `All failed: ${errors.join(' | ')}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ count, username });
}
