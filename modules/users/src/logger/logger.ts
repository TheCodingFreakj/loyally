const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
export const logger = winston.createLogger({
//   levels: logLevels,
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf(
      (info: { timestamp: any; level: any; message: any }) =>
        `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});
