export const healthController = async (req, res) => {
  try {
    const io = req.app.get("io");
    console.log("req", req.query);
    return res.status(200).json({ success: true, message: "Server is running" });
  } catch (error) {
    return res.status(200).json({ success: false, message: "Server error" });
  };
};