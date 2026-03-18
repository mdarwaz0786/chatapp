import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token is missing" });
  };

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    const user = await UserModel.findById(decoded.id).select("-password -refreshToken -passwordResetToken -passwordResetExpires");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    };

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access token is invalid" });
  };
};


