const { randomUUID } = require("node:crypto");
const { decryptSymmetric, encryptSymmetric } = require("../utils/cryptography");
const { redis } = require("../db/redis");
const { storeInSQL } = require("./chat.SQL");
const { decryptMessages } = require("../utils/chat.decryptMsg");

const CRYPT_KEY = process.env.CRYPT_KEY;

async function setGetData(data) {
  if (typeof data !== "string" || !data.trim()) return null;

  const client = redis();
  const { cipherText, iv, tag } = encryptSymmetric(CRYPT_KEY, data);

  const messageId = randomUUID();
  const messageData = {
    message_id: messageId,
    text: cipherText,
    timestamp: Date.now(),
    metadata: {
      iv: iv,
      tag: tag,
    },
  };

  try {
    await client.hSet(
      `chat:messages:${messageId}`,
      "data",
      JSON.stringify(messageData)
    );
    await client.lPush("chat:order", messageId);
    await storeInSQL(messageData);

    const lastId = await client.lIndex("chat:order", 0);
    const message = await client.hGetAll(`chat:messages:${lastId}`, "data");

    const parsedMsg = decryptMessages(JSON.parse(message.data));

    return [parsedMsg];
  } catch (error) {
    console.error("Fatal Redis error:", error);
    return null;
  }
}

module.exports = { setGetData };
