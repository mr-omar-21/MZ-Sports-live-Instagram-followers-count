import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

const API_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
  'X-IG-App-ID': '936619743392459',
  'X-ASBD-ID': '129477',
  'X-Requested-With': 'XMLHttpRequest',
};

const OG_DESCRIPTION_RE =
  /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/;
const FOLLOWER_RE = /([\d,]+)\s*Followers/i;

async function scrapeOG(username: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: BROWSER_HEADERS,
    });
    if (!res.ok) return null;
    const html = await res.text();
    const ogMatch = html.match(OG_DESCRIPTION_RE);
    if (!ogMatch) return null;
    const followerMatch = ogMatch[1].match(FOLLOWER_RE);
    if (!followerMatch) return null;
    return parseInt(followerMatch[1].replace(/,/g, ''), 10);
  } catch {
    return null;
  }
}

async function fetchGraphQL(username: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { headers: API_HEADERS }
    );
    if (!res.ok) return null;
    const json = await res.json();
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

  let count = await fetchGraphQL(username);

  if (count === null) {
    count = await scrapeOG(username);
  }

  if (count === null) {
    return NextResponse.json(
      { error: 'Could not fetch follower count' },
      { status: 502 }
    );
  }

  return NextResponse.json({ count, username });
}
