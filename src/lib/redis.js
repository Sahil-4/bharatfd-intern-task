import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  console.info("redis connected");
});

redis.on("error", (error) => {
  console.error(error.message);
});

process.on("SIGINT", () => {
  redis.quit(() => {
    console.info("redis connection closed");
    process.exit(0);
  });
});

export const get = async (key) => {
  return await redis.get(key);
};

export const set = async (key, value, ttl = 60 * 15) => {
  await redis.setex(key, ttl, value);
};

export const clear = async (key) => {
  await redis.del(key);
};

export default redis;
