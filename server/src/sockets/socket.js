import MessageModel from "../models/message.model.js";
import User from "../models/user.model.js";

const onlineUsers = new Map(); // userId -> socketId

export default (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // ✅ 1. Register user
    socket.on("join", async (userId) => {
      onlineUsers.set(userId, socket.id);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        socketId: socket.id,
      });

      console.log(`✅ User ${userId} is online`);

      // Broadcast online status
      socket.broadcast.emit("userOnline", userId);
    });

    // ✅ 2. Join conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`📩 Joined room: ${conversationId}`);
    });

    // ✅ 3. Send message (real-time)
    socket.on("sendMessage", async (data) => {
      const { conversationId, receiverId, messageId } = data;

      // Emit message
      io.to(conversationId).emit("receiveMessage", data);

      // Mark as delivered
      await MessageModel.findByIdAndUpdate(messageId, {
        status: "delivered",
      });

      // Notify sender
      const senderSocketId = onlineUsers.get(data.senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          messageId,
        });
      }
    });

    // ✅ 4. Typing indicator
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing", userId);
    });

    // ✅ 5. Mark  seen
    socket.on("markSeen", async ({ conversationId, userId }) => {
      const messages = await MessageModel.find({
        conversationId,
        status: { $ne: "seen" },
      });

      for (let msg of messages) {
        // Avoid duplicate seen
        const alreadySeen = msg.seenBy.find(
          (u) => u.user.toString() === userId
        );

        if (!alreadySeen) {
          msg.seenBy.push({
            user: userId,
            seenAt: new Date(),
          });

          msg.status = "seen";
          await msg.save();

          // Notify sender
          io.to(conversationId).emit("messageSeen", {
            messageId: msg._id,
            userId,
          });
        }
      }
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("stopTyping", userId);
    });

    // ❌ Disconnect
    socket.on("disconnect", async () => {
      console.log("❌ User disconnected:", socket.id);

      let disconnectedUserId = null;

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, {
          isOnline: false,
          lastSeen: new Date(),
          socketId: null,
        });

        socket.broadcast.emit("userOffline", disconnectedUserId);
      }
    });
  });
};