import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["private", "group"],
    required: [true, "Conversation type is required"],
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  groupName: {
    type: String,
    trim: true,
    default: null,
  },
  groupImage: {
    type: String,
    default: null,
  },
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  lastMessage: {
    text: {
      type: String,
      trim: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
    },
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel;