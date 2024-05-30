import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

const concurrentRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, '24 h'), // 1 concurrent request per 24 minutes
});

const dailyRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '24 h'), // 2 total successful requests per 24 hours
});

export const withRateLimiter = (method: any) => async (request: NextRequest): Promise<NextResponse> => {
  const ip = request.ip ?? '127.0.0.1';
  const json = await request.json();
  request.json = () => json;
  const walletAddress = json?.walletAddress?.toLowerCase() ?? '';

  const limits = await Promise.all([
    concurrentRateLimit.limit(ip).then(({success}) => success),
    concurrentRateLimit.limit(walletAddress).then(({success}) => success),
    dailyRateLimit.getRemaining(ip).then((remaining) => remaining > 0),
    dailyRateLimit.getRemaining(walletAddress).then((remaining) => remaining > 0),
  ]);

  if (limits.some(( success ) => !success))
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const response = await method(request);

  const rateLimitUpdates: Promise<any>[] = [
    concurrentRateLimit.resetUsedTokens(ip),
    concurrentRateLimit.resetUsedTokens(walletAddress),
  ];

  if (response.status === 200) {
    rateLimitUpdates.push(dailyRateLimit.limit(ip), dailyRateLimit.limit(walletAddress));
  }

  await Promise.all(rateLimitUpdates);

  return response;
}
