import connectDatabase from "../database/connectDatabase.js";
import http from "http";
import { Server } from "socket.io";
import logger from "../config/logger.js";
import initSocket from "../sockets/socket.js";

const startServer = async (app, port, mode) => {
  await connectDatabase();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.set("io", io);

  initSocket(io);

  server.listen(port, () => {
    logger.info(`Server running on port ${port} in ${mode} mode`);
  });
};

export default startServer;