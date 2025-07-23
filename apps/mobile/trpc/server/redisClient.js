import Redis from "ioredis";
export const redis = global.redis ?? new Redis(process.env.UPSTASH_REDIS_URL);
if (process.env.NODE_ENV !== "production")
    global.redis = redis;
