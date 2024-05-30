import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';

const concurrentRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, '24 h'), // only 1 concurrent request
});

const dailyRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '24 h'), // 2 total successful requests per 24 hours
});

export const withRateLimiter = (handler: (req: Request) => Promise<Response>) => async (request: NextRequest): Promise<Response> => {
  const ip = request.ip ?? '127.0.0.1';
  const json = await request.json();
  request.json = () => json;
  const walletAddress = json?.walletAddress?.toLowerCase() ?? '';

  const limits = await Promise.all([
    concurrentRateLimit.limit(`concurrent:${ip}`).then(({ success }) => success),
    concurrentRateLimit.limit(`concurrent:${walletAddress}`).then(({ success }) => success),
    dailyRateLimit.getRemaining(`daily:${ip}`).then((remaining) => remaining > 0),
    dailyRateLimit.getRemaining(`daily:${walletAddress}`).then((remaining) => remaining > 0),
  ]);

  const rateLimitUpdates: Promise<any>[] = [];

  try {
    if (limits.some((success) => !success))
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const response = await handler(request);

    if (response.status === 200) {
      rateLimitUpdates.push(
          dailyRateLimit.limit(`daily:${ip}`),
          dailyRateLimit.limit(`daily:${walletAddress}`),
      );
    }

    return response;

  } finally {
    rateLimitUpdates.push(
        concurrentRateLimit.resetUsedTokens(`concurrent:${ip}`),
        concurrentRateLimit.resetUsedTokens(`concurrent:${walletAddress}`),
    );

    await Promise.all(rateLimitUpdates);
  }
}
