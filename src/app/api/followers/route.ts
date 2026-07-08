import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_VERSION = 'v20.0';
const GRAPH_API = 'https://graph.facebook.com';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username') || 'mzsports_tz';
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!token || !businessId) {
    return NextResponse.json(
      { error: 'Instagram API not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${GRAPH_API}/${API_VERSION}/${businessId}?fields=followers_count&access_token=${token}`
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err?.error?.message || 'Graph API error' },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      count: data.followers_count,
      username,
      source: 'graph-api',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Request failed' },
      { status: 502 }
    );
  }
}
