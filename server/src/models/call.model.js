import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Caller is required"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"],
  },
  callType: {
    type: String,
    enum: ["audio", "video"],
    required: [true, "Call type is required"],
  },
  status: {
    type: String,
    enum: ["missed", "rejected", "accepted", "ended"],
    default: "missed",
  },
  startedAt: {
    type: Date,
    default: null,
  },
  endedAt: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("Call", callSchema);