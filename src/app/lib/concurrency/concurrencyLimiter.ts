import Redis from 'ioredis';
import { nanoid } from 'nanoid';
import { concurrencyScript } from './concurrency.script';


type AnyFunction = (...args: any[]) => Promise<unknown>;
type FunctionWithRedis = {
  redis?: Redis;
  <T extends AnyFunction>(fn: T): T;
};


export function withConcurrencyLimiter({
  keyPrefix = 'concurrency:',
  limit = 10,
  perServer = false
} = {}): FunctionWithRedis {
  if (!process.env.REDIS_HOST) {
    console.warn('Redis host is not provided. Concurrency limiter is disabled.');

    return function noWrap<T extends AnyFunction>(fn: T): T {
      return fn;
    };
  }

  // REDIS CONFIGURATION

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

  // REQUEST HANDLING

  const pendingRequests: Record<string, { resolve: (value?: unknown) => void, reject: (value?: unknown) => void }> = {};

  function waitForRequest(requestId: string) {
    const waitForQueue = new Promise((resolve, reject) => {
      pendingRequests[requestId] = { resolve, reject };
    });

    return redis.fcall('add_request', 1, '', requestId, ...(perServer ? [serverId] : []))
      .then((processImmediately) => {
        if (processImmediately) {
          pendingRequests[requestId].resolve();
          delete pendingRequests[requestId];
        } else {
          return waitForQueue;
        }
      });
  }

  function completeRequest(requestId: string) {
    redis.fcall('complete_request', 1, '', requestId, ...(perServer ? [serverId] : []))
      .catch(console.error);
    delete pendingRequests[requestId];
  }

  function abortRequest(requestId: string) {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId].reject(`Concurrency aborted on client disconnect: ${requestId}`);
      completeRequest(requestId);
    }
  }

  redisSub.on('message', (_channel: string, requestId: string) => {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId].resolve();
    } else {
      completeRequest(requestId);
    }
  });

  // WRAP ORIGINAL FUNCTION

  function wrapWithConcurrency<T extends AnyFunction>(fn: T): T {
    return concurrencyWrapper(serverId, waitForRequest, completeRequest, abortRequest, fn) as T;
  }

  wrapWithConcurrency.redis = redis;
  return wrapWithConcurrency;
}

function concurrencyWrapper<T extends AnyFunction>(
  serverId: string,
  waitForRequest: (requestId: string) => Promise<unknown>,
  completeRequest: (requestId: string) => void,
  abortRequest: (requestId: string) => void,
  fn: T
): T {
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const request = args[0];
    let requestId = `${serverId}:${nanoid()}`;

    if (request?.url)
      requestId += `~~${request.url}`;

    // Cancel request if the connection is closed by the client
    request?.on?.('close', () => abortRequest(requestId));
    request?.on?.('end', () => abortRequest(requestId));
    request?.signal?.addEventListener?.('abort', () => abortRequest(requestId));

    return waitForRequest(requestId)
      .then(() => (fn.apply(this, args)))
      .finally(() => {
        completeRequest(requestId);
      }) as Promise<ReturnType<T>>;
  } as T;
}
