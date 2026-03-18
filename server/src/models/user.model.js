import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  mobile: {
    type: String,
    trim: true,
    required: [true, "Mobile is required"],
    unique: [true, "This mobile number is already in use"],
    match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
  },
  profileImage: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    trim: true,
    default: "Hey there! I am using chat app.",
    maxLength: 100,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: null,
  },
  devices: [{
    deviceId: {
      type: String,
      default: null,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    platform: {
      type: String,
      default: null,
    },
    lastActive: {
      type: Date,
      default: null,
    },
  }],
  socketId: {
    type: String,
    default: null,
  },
  isInCall: {
    type: Boolean,
    default: false,
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  refreshToken: {
    type: String,
    trim: true,
    default: null,
  },
  passwordResetToken: {
    type: String,
    trim: true,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    trim: true,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;