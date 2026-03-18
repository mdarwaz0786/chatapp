import morgan from "morgan";
import logger from "../config/logger.js";

const stream = {
  write: (message) => logger.info(message.trim()),
};

export const morganMiddleware = morgan("combined", { stream });