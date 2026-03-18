import sendEmail from "../helpers/email.js";
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../helpers/token.js";
import UserModel from "../models/user.model.js";

export const signup = async(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ success: true, message: "All fields are required" });
  };

  const existingUser = await UserModel.findOne({ mobile });
  if (existingUser) {
    return res.status(409).json({ success: true, message: "User already exists" });
  };

  const user = await UserModel.create({
    name,
    email,
    mobile,
    password,
    fcmToken,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(201).json({
    success: true,
    message: "Signup success",
    accessToken,
    data: {
      _id: user?._id,
      name,
      email,
      mobile,
      fcmToken,
    },
  });
});

export const login = async (req, res) => {
  const user = await UserModel.findOne({ mobile: req.body.mobile });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  }).json({
    success: true,
    message: "Login success",
    accessToken,
  });
};

export const logout = async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  user.refreshToken = null;
  await user.save();

  res.clearCookie("refreshToken");

  return res.json({ success: true, message: "Logout successfully" });
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ success: true, message: "Refresh token is missing" });
  };

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);

    const user = await UserModel.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    };

    const newAccessToken = generateAccessToken(user);

    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  };

  return res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    };

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    };

    const { resetToken, hashedToken } = generateResetToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
    <h2>Password Reset</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link expires in 10 minutes.</p>
  `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return res.status(500).json({ success: false, message: "Email sending failed" })
  };
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  };

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Reset password token is invalid");
  };

  user.password = password;
  user.passwordResetToken = null
  user.passwordResetExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});