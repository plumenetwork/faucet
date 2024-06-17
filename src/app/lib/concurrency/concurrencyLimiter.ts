import Redis from 'ioredis';
import { nanoid } from 'nanoid';
import { concurrencyScript } from './concurrency.script';


type AnyFunction = (...args: any[]) => Promise<unknown>;


export function withConcurrencyLimiter(keyPrefix: string = 'concurrency:', limit: number = 10) {
  if (!process.env.REDIS_HOST) {
    console.warn('Redis host is not provided. Concurrency limiter is disabled.');
    return (fn: AnyFunction) => fn;
  }

  const redisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || '',
    keyPrefix,
  };

  const redis = new Redis(redisConfig);
  const redisSub = new Redis(redisConfig);

  const serverId = nanoid();
  const channel = `${keyPrefix}channel:${serverId}`;

  redis.function('LOAD', 'REPLACE', concurrencyScript);
  redis.get('limit').then((value) => {
    if (!value)
      redis.set('limit', limit);
  });

  // add server to the list of servers with expiration of 2 seconds
  // keep adding the server to the list of servers every second
  // if the server is expired, its requests will be cancelled
  setInterval(() => {
    redis.setex(`servers:${serverId}`, 2, 1);
  }, 1000);

  redisSub.subscribe(channel, (err) => {
    if (err) {
      console.error(`Redis: failed to subscribe to ${channel}`, err.message);
    }
  });

  return function wrapWithConcurrency<T extends AnyFunction>(fn: T): T {
    return concurrencyWrapper(redis, redisSub, serverId, fn);
  };
}


function concurrencyWrapper<T extends AnyFunction>(
  redis: Redis,
  redisSub: Redis,
  serverId: string,
  fn: T
): T {
  const pendingRequests: Record<string, (value?: unknown) => void> = {};

  redisSub.on('message', (_channel, requestId) => {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId]();
      delete pendingRequests[requestId];
    } else {
      redis.fcall('complete_request', 1, '', requestId).catch(console.error);
    }
  });

  return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const requestId = `${serverId}:${nanoid()}`;

    const waitForQueue = new Promise((resolveRequest) => {
      pendingRequests[requestId] = resolveRequest;
    });
    const processImmediately = await redis.fcall('add_request', 1, '', requestId);

    if (processImmediately) {
      delete pendingRequests[requestId];
    } else {
      await waitForQueue;
    }

    try {
      return await fn.apply(this, args) as ReturnType<T>;
    } catch (error) {
      throw error;
    } finally {
      redis.fcall('complete_request', 1, '', requestId).catch(console.error);
    }
  } as T;
}
