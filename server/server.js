import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import errorHandler from "./src/middlewares/errorHandler.middleware.js";
import { globalLimiter } from "./src/middlewares/rateLimit.middleware.js";

import corsOptions from "./src/config/cors.js";
import startServer from "./src/config/startServer.js";

import healthRoutes from "./src/routes/health.route.js";
import { morganMiddleware } from "./src/middlewares/morgon.middleware.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 8080;
const mode = process.env.NODE_ENV || "development";

// Init express app
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(globalLimiter);

// Logger
app.use(morganMiddleware);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(compression());

// API routes
app.use("/api/v1", healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Start server
startServer(app, port, mode);

