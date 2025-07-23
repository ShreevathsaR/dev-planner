import Redis from "ioredis";
import { env } from "../env";
export const redis = new Redis(process.env.UPSTASH_REDIS_URL || '');
