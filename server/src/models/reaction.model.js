import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  emoji: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const ReactionModel = mongoose.model("Reaction", reactionSchema);

export default ReactionModel;