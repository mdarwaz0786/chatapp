import ApiError from "../helpers/apiError.js";
import asyncHandler from "../helpers/asyncHandler.js";
import ConversationModel from "../models/conversation.model.js";

export const createOrGetConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  };

  let conversation = await ConversationModel.findOne({
    type: "private",
    participants: { $all: [currentUserId, userId], $size: 2 },
  });

  if (conversation) {
    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      data: conversation,
    });
  };

  conversation = await ConversationModel.create({
    type: "private",
    participants: [currentUserId, userId],
  });

  return res.status(201).json({
    success: true,
    message: "Conversation created successfully",
    data: conversation,
  });
});

export const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const conversations = await ConversationModel
    .find({ participants: userId })
    .populate("participants", "name profileImage isOnline")
    .sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: conversations,
  });
});