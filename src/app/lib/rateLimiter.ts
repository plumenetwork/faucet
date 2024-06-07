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

function passBasicAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (auth) {
    const [username, password] = atob(auth.split(' ')[1]).split(':');
    return (
      username == process.env.BASIC_USERNAME &&
      password == process.env.BASIC_PASSWORD
    );
  }
  return false;
}

export const withRateLimiter =
  ({
    limiterKeys,
    handler,
  }: {
    limiterKeys: (request: NextRequest) => Promise<string[]>;
    handler: (req: Request) => Promise<Response>;
  }) =>
  async (request: NextRequest): Promise<Response> => {
    // If rate limiter bypass is enabled for testing and request passes basic auth, continue
    if (process.env.ENABLE_RATE_LIMITER_BYPASS && passBasicAuth(request)) {
      return handler(request);
    }

    // Read the request body stream and cache it, because `request.json()` can only be read once.
    // Caching it allows `limiterKeys` and the route handler to call `await request.json()` later on.
    const json = await request.json();
    request.json = () => json;

    if (typeof limiterKeys !== 'function')
      throw new Error('limiterKeys must be a function');

    const keys = await limiterKeys(request);

    const limits = await Promise.all([
      ...keys.map((key) =>
        concurrentRateLimit
          .limit(`concurrent:${key}`)
          .then(({ success }) => success)
      ),
      ...keys.map((key) =>
        dailyRateLimit
          .getRemaining(`daily:${key}`)
          .then((remaining) => remaining > 0)
      ),
    ]);

    const rateLimitUpdates: Promise<any>[] = [];

    try {
      if (limits.some((success) => !success))
        return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

      const response = await handler(request);

      if (response.status === 200) {
        rateLimitUpdates.push(
          ...keys.map((key) => dailyRateLimit.limit(`daily:${key}`))
        );
      }

      return response;
    } finally {
      rateLimitUpdates.push(
        ...keys.map((key) =>
          concurrentRateLimit.resetUsedTokens(`concurrent:${key}`)
        )
      );

      await Promise.all(rateLimitUpdates);
    }
  };
