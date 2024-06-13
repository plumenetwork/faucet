import { NextRequest } from "next/server";
import Redis from 'ioredis';
import { nanoid } from 'nanoid'
import { concurrencyScript } from './concurrency.script';

const keyPrefix = 'faucet:concurrency:';
const redisConfig = {
  host: 'redis-15505.c99.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 15505,
  password: 'wOZa8qqcNjg5jzoTdLeTQppkfMi78Rte',
  keyPrefix,
}

const redis = new Redis(redisConfig);
const redisSub = new Redis(redisConfig);

const serverId = nanoid();
const channel = `${keyPrefix}channel:${serverId}`;

redis.function('LOAD', 'REPLACE', concurrencyScript);

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

export function withConcurrencyLimiter(handler: (req: NextRequest) => Promise<Response>) {
  const pendingRequests: Record<string, (value?: unknown) => void> = {};

  redisSub.on("message", (_channel, requestId) => {
    if (pendingRequests[requestId]) {
      pendingRequests[requestId]();
      delete pendingRequests[requestId];
    } else {
      redis.fcall('complete_request', 1, '').catch(console.error)
    }
  });

  return async (req: NextRequest): Promise<Response> => {
    const requestId = `${serverId}:${nanoid()}`;

    const processImmediately = await redis.fcall('add_request', 1, '', requestId);

    if (!processImmediately) {
      await new Promise((resolve) => {
        pendingRequests[requestId] = resolve;
      });
    }

    const res = await handler(req);

    redis.fcall('complete_request', 1, '').catch(console.error);

    return res;
  };
}