const { getFromSQL } = require("./chat.SQL");
const { connectRedis, redis } = require("../db/redis");
const { decryptMessages, setGetData } = require("./setGetData");

const useSockets = async (socket, io) => {
  await connectRedis();
  const client = redis();

  console.log("hi");

  const lastIds = await client.lRange("chat:order", 0, 9);
  let oldMsgs = await Promise.all(
    lastIds.map((id) => client.hGetAll(`chat:messages:${id}`))
  );

  if (oldMsgs.length < 10) {
    const SQLMsgs = await getFromSQL();
    oldMsgs = SQLMsgs.reduce((acc, item) => {
      acc.push(decryptMessages(item));
      return acc;
    }, []);
  } else {
    oldMsgs = oldMsgs
      .map((m) => JSON.parse(m.data))
      .reduce((acc, item) => {
        acc.push(decryptMessages(item));
        return acc;
      }, []);
  }

  socket.emit("oldMessages", oldMsgs);

  socket.on("chatMessage", async (msg) => {
    const messages = await setGetData(msg);
    io.emit("chatMessage", {
      socket_id: socket.id,
      data: messages,
    });
  });

  socket.on("disconnect", () => {
    io.emit("userDisconnect", {
      socket_id: socket.id,
      message: "Disconnected.",
    });
  });
};

module.exports = useSockets;
