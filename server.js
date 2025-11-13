require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const useSockets = require("./chat.controller/chat.useSockets");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => await useSockets(socket, io));

server.listen(3510, () => {
  console.log("server running at port 3510");
});
