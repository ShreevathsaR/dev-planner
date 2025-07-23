import Redis from "ioredis";
declare global {
    var redis: Redis | undefined;
}
export declare const redis: Redis;
