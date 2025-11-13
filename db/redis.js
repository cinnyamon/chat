const { createClient } = require("redis");

let client;

async function connectRedis() {
  if (client) return client; // reuse existing connection

  client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
  });

  await client.connect();
  console.log("[Redis] Connected");

  return client;
}

function redis() {
  if (!client)
    throw new Error("Redis not initialized. Call connectRedis() first.");
  return client;
}

module.exports = { connectRedis, redis };
