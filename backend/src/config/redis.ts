import redis from "redis"

export const client = redis.createClient();


client.on("err", (err) => console.error("Reids client error",err));
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