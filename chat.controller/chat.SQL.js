const pool = require("../db/pool");

async function storeInSQL(data) {
  try {
    const { message_id, text, timestamp, metadata } = data;

    const newTimestamp = new Date(timestamp);
    const CHAT_INSERT =
      "INSERT INTO chat_messages (message_id, text, timestamp, metadata) VALUES ($1, $2, $3, $4) RETURNING *;";

    const SQLData = await pool.query(CHAT_INSERT, [
      message_id,
      text,
      newTimestamp,
      metadata,
    ]);

    return SQLData.rows;
  } catch (error) {
    console.error(error);
  }
}

async function getFromSQL() {
  const CHAT_SELECT =
    "SELECT * FROM chat_messages ORDER BY timestamp ASC LIMIT 10;";

  const SQLData = await pool.query(CHAT_SELECT);
  return SQLData.rows;
}

module.exports = { storeInSQL, getFromSQL };
