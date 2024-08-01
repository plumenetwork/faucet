import Redis from 'ioredis';
import { NextRequest } from 'next/server';
import { sharedCorsHeaders } from '@/app/lib/utils';

const redisConnection = process.env.REDIS_CACHE || '';
const redisUrl = new URL(redisConnection);

const redis = new Redis({
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  password: redisUrl.password,
  keyPrefix: 'cache:faucet:',
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

export const withCaching =
  ({
    prefix = '',
    makeKeys,
    cleanseData = (data) => data,
    handler,
  }: {
    prefix?: string;
    makeKeys: (request: NextRequest) => Promise<any[]>;
    cleanseData?: (data: any) => any;
    handler: (req: NextRequest) => Promise<any>;
  }) =>
  async (request: NextRequest): Promise<Response> => {
    // If full rate limiter bypass is enabled for testing, continue
    if (process.env.DANGEROUS_ENABLE_FULL_RATE_LIMITER_BYPASS) {
      return handler(request);
    }

    // If rate limiter bypass is enabled for testing and request passes basic auth, continue
    if (process.env.ENABLE_RATE_LIMITER_BYPASS && passBasicAuth(request)) {
      return handler(request);
    }

    // Read the request body stream and cache it, because `request.json()` can only be read once.
    // Caching it allows `makeKeys` and the route handler to call `await request.json()` later on.
    const json = await request.json();
    request.json = () => json;

    if (typeof makeKeys !== 'function') {
      throw new Error('makeKeys must be a function');
    }

    const caches = await makeKeys(request);

    for (const cache of caches) {
      const { key } = cache;
      const data = await redis.get(`${prefix}${key}`);

      if (data) {
        return Response.json(JSON.parse(data), {
          status: 202,
          headers: sharedCorsHeaders,
        });
      }
    }

    const response = await handler(request);

    if (!response) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (response instanceof Response) {
      return response;
    }

    for (const cache of caches) {
      const { key, duration } = cache;
      redis.setex(
        `${prefix}${key}`,
        duration,
        JSON.stringify(cleanseData(response))
      );
    }

    return Response.json(response, { status: 202, headers: sharedCorsHeaders });
  };
