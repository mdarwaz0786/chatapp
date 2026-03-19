// Modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Middlewares
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
import { globalLimiter } from "./src/middlewares/rateLimit.middleware.js";
import { morganMiddleware } from "./src/middlewares/morgon.middleware.js";

// Config
import corsOptions from "./src/config/cors.js";
import startServer from "./src/config/startServer.js";

// Routes
import healthRoute from "./src/routes/health.route.js";
import messageRoute from "./src/routes/message.route.js";
import conversationRoute from "./src/routes/conversation.route.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 8080;
const mode = process.env.NODE_ENV || "development";

// Init express app
const app = express();

// Security
app.use(helmet());
app.use(cors(corsOptions));

// Rate Limit
app.use(globalLimiter);

// Logger
app.use(morganMiddleware);

// Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Compress response
app.use(compression());

// API routes
app.use("/api/v1", healthRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/conversation", conversationRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Start server
startServer(app, port, mode);

