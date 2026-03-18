const allowedKeys = process.env.API_KEYS
  ? process.env.API_KEYS.split(",").map((k) => k.trim())
  : [];

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !allowedKeys.includes(apiKey)) {
    return res.status(403).json({
      success: false,
      message: "Invalid API Key"
    });
  };

  next();
};

export default checkApiKey;