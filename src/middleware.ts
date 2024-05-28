import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '24 h'),
});

export const config = {
  matcher: '/api/faucet/',
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { walletAddress } = await request.json()

  let { success: ipLimitSuccess } = await ratelimit.limit(ip);
  if (!ipLimitSuccess) return NextResponse.json({ error: 'Rate limit exceeded' },{ status: 429 });

  let { success: walletLimitSuccess } = await ratelimit.limit(walletAddress);
  if (!walletLimitSuccess) return NextResponse.json({ error: 'Rate limit exceeded' },{ status: 429 });

  return NextResponse.next();
}
