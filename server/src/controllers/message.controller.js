import ConversationModel from "../models/conversation.model.js";
import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/apiError.js";
import MessageModel from "../models/message.model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text, messageType, mediaUrl } = req.body;
  const senderId = req.user.id;

  if (!conversationId) {
    throw new ApiError(400, "Conversation ID is required");
  };

  const message = await MessageModel.create({
    conversationId,
    sender: senderId,
    text,
    messageType: messageType || "text",
    mediaUrl,
  });

  const io = req.app.get("io");

  io.to(conversationId).emit("receiveMessage", message);

  await ConversationModel.findByIdAndUpdate(conversationId, {
    lastMessage: {
      text,
      sender: senderId,
      createdAt: new Date(),
    },
  });

  return res.status(201).json({
    success: true,
    message: "Message fetched successfully",
    data: message,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 0;
  const limit = 20;

  const messages = await MessageModel.find({ conversationId })
    .populate("sender", "name profileImage")
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  await MessageModel.updateMany(
    {
      conversationId,
      sender: { $ne: userId },
      status: { $ne: "seen" },
    },
    {
      $set: { status: "seen" },
      $push: {
        seenBy: {
          user: userId,
          seenAt: new Date(),
        },
      },
    }
  );

  return res.status(200).json({
    success: true,
    message: "Message fetched successfully",
    data: messages,
  });
});