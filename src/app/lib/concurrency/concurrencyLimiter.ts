import Redis from 'ioredis';
import { nanoid } from 'nanoid';
import { concurrencyScript } from './concurrency.script';


type AnyFunction = (...args: any[]) => Promise<unknown>;


export function withConcurrencyLimiter({ keyPrefix = 'concurrency:', limit = 10, perServer = false }) {
  if (!process.env.REDIS_HOST) {
    console.warn('Redis host is not provided. Concurrency limiter is disabled.');

    return function noWrap<T extends AnyFunction>(fn: T): T {
      return fn;
    };
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
  redis.get('limit').then((value: any) => {
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
    return concurrencyWrapper(redis, redisSub, serverId, perServer, fn);
  };
}


function concurrencyWrapper<T extends AnyFunction>(
  redis: Redis,
  redisSub: Redis,
  serverId: string,
  perServer: boolean,
  fn: T
): T {
  const pendingRequests: Record<string, { resolve: (value?: unknown) => void, reject: (value?: unknown) => void }> = {};

  function addRequest(requestId: string) {
    return redis.fcall('add_request', 1, '', requestId, ...(perServer ? [serverId] : []));
  }

  function completeRequest(requestId: string) {
    redis.fcall('complete_request', 1, '', requestId, ...(perServer ? [serverId] : []))
      .catch(console.error);
  }

  redisSub.on('message', (_channel: string, requestId: string) => {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId].resolve();
      delete pendingRequests[requestId];
    } else {
      completeRequest(requestId);
    }
  });

  return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const request = args[0];
    let requestId = `${serverId}:${nanoid()}`;

    if (request?.url)
      requestId += `~~${request.url}`;

    const waitForQueue = new Promise((resolve, reject) => {
      pendingRequests[requestId] = { resolve, reject };
    });

    // Complete request if the connection is closed by the client
    const abort = () => {
      if (pendingRequests[requestId]) {
        pendingRequests[requestId].reject();
        redis.fcall('complete_request', 1, '', requestId).catch(console.error);
        delete pendingRequests[requestId];
      }
    };
    request?.on?.('close', abort);
    request?.on?.('end', abort);
    request?.signal?.addEventListener?.('abort', abort);

    const processImmediately = await addRequest(requestId);

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
      completeRequest(requestId);
    }
  } as T;
}
