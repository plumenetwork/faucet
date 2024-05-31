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
  const token = json?.token ?? 'ETH';

  const limits = await Promise.all([
    concurrentRateLimit.limit(`concurrent:${token}:${ip}`).then(({ success }) => success),
    concurrentRateLimit.limit(`concurrent:${token}:${walletAddress}`).then(({ success }) => success),
    dailyRateLimit.getRemaining(`daily:${token}:${ip}`).then((remaining) => remaining > 0),
    dailyRateLimit.getRemaining(`daily:${token}:${walletAddress}`).then((remaining) => remaining > 0),
  ]);

  const rateLimitUpdates: Promise<any>[] = [];

  try {
    if (limits.some((success) => !success))
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const response = await handler(request);

    if (response.status === 200) {
      rateLimitUpdates.push(
          dailyRateLimit.limit(`daily:${token}:${ip}`),
          dailyRateLimit.limit(`daily:${token}:${walletAddress}`),
      );
    }

    return response;

  } finally {
    rateLimitUpdates.push(
        concurrentRateLimit.resetUsedTokens(`concurrent:${token}:${ip}`),
        concurrentRateLimit.resetUsedTokens(`concurrent:${token}:${walletAddress}`),
    );

    await Promise.all(rateLimitUpdates);
  }
}
