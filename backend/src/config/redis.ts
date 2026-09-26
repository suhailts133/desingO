import { createClient } from "redis";

const redisUri = process.env.NODE_ENV === "production" ? process.env.REDIS_UPSTASH_URI : process.env.REDIS__URI;

if (!redisUri) {
  throw new Error("Redis connection string is not defined");
}

export const client = createClient({ url: redisUri });

client.on("error", (err) => console.error("Redis client error", err));
client.on("connect", () => console.log("connecting to Redis..."));
client.on("ready", () => console.log("connected to Redis"));

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (err) {
    console.error("Could not establish connection with Redis:", err);
  }
};

export default connectRedis;
