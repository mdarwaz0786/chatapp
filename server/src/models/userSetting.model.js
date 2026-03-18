const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  lastSeenVisibility: {
    type: String,
    enum: ["everyone", "contacts", "nobody"],
    default: "everyone",
  },
  profilePhotoVisibility: {
    type: String,
    enum: ["everyone", "contacts", "nobody"],
    default: "everyone",
  },
}, { timestamps: true });

export default mongoose.model("UserSettings", userSettingsSchema);