import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '600 s'),
});

export const config = {
  matcher: '/api/faucet/',
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  return success
    ? NextResponse.next()
    : NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
