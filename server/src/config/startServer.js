import connectDatabase from "../database/connectDatabase.js";
import http from "http";
import { Server } from "socket.io";
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
    console.log(`Server is running on port ${port} in ${mode} mode http://localhost:${port}`);
  });
};

export default startServer;