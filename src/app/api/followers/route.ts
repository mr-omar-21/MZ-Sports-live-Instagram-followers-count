import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function httpsGet(url: string): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
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
        },
        timeout: 15000,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, data }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

async function scrapeOG(username: string): Promise<number | null> {
  try {
    const { data } = await httpsGet(`https://www.instagram.com/${username}/`);
    const ogMatch = data.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/
    );
    if (!ogMatch) return null;
    const fMatch = ogMatch[1].match(/([\d,]+)\s*Followers/i);
    if (!fMatch) return null;
    return parseInt(fMatch[1].replace(/,/g, ''), 10);
  } catch {
    return null;
  }
}

async function fetchGraphQL(username: string): Promise<number | null> {
  try {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const { data } = await new Promise<{ status: number; data: string }>(
      (resolve, reject) => {
        const req = https.get(
          url,
          {
            headers: {
              'User-Agent': USER_AGENT,
              Accept: 'application/json',
              'X-IG-App-ID': '936619743392459',
              'X-ASBD-ID': '129477',
              'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 10000,
          },
          (res) => {
            let d = '';
            res.on('data', (c) => (d += c));
            res.on('end', () =>
              resolve({ status: res.statusCode ?? 0, data: d })
            );
          }
        );
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      }
    );
    if (!data) return null;
    const json = JSON.parse(data);
    return json?.data?.user?.edge_followed_by?.count ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  let errorMsg = '';
  let count: number | null = null;

  try {
    count = await fetchGraphQL(username);
    if (count === null) errorMsg = 'GraphQL failed';
  } catch (e) {
    errorMsg = `GraphQL error: ${e instanceof Error ? e.message : '?'}`;
  }

  if (count === null) {
    try {
      count = await scrapeOG(username);
      if (count === null) errorMsg += ' | OG scrape failed';
    } catch (e) {
      errorMsg += ` | OG error: ${e instanceof Error ? e.message : '?'}`;
    }
  }

  if (count === null) {
    return NextResponse.json({ error: errorMsg || 'Unknown error' }, { status: 502 });
  }

  return NextResponse.json({ count, username });
}
