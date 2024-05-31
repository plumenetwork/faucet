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

export const withRateLimiter = ({ limiterKeys, handler }: {
  limiterKeys: (request: NextRequest) => Promise<string[]>,
  handler: (req: Request) => Promise<Response>
}) =>
    async (request: NextRequest): Promise<Response> => {
      // Read the request body stream and cache it
      const json = await request.json();
      request.json = () => json;

      const ip = request.ip ?? '127.0.0.1';

      const keys = limiterKeys ? await limiterKeys(request) || [ip] : [ip];

      const limits = await Promise.all([
        ...keys.map((key) => concurrentRateLimit.limit(`concurrent:${key}`).then(({ success }) => success)),
        ...keys.map((key) => dailyRateLimit.getRemaining(`daily:${key}`).then((remaining) => remaining > 0)),
      ]);

      const rateLimitUpdates: Promise<any>[] = [];

      try {
        if (limits.some((success) => !success))
          return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

        const response = await handler(request);

        if (response.status === 200) {
          rateLimitUpdates.push(
              ...keys.map((key) => concurrentRateLimit.limit(`daily:${key}`)),
          );
        }

        return response;

      } finally {
        rateLimitUpdates.push(
            ...keys.map((key) => dailyRateLimit.resetUsedTokens(`concurrent:${key}`)),
        );

        await Promise.all(rateLimitUpdates);
      }
    }
