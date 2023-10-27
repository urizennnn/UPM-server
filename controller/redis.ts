import * as redis from "redis";
export async function connectRedis(): Promise<any> {
  const client = redis.createClient({
    password: "zmXQIrfLF1iFANq2pBwlEsr4QSLaJCtb",
    socket: {
      host: "redis-17103.c90.us-east-1-3.ec2.cloud.redislabs.com",
      port: 17103,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
}
