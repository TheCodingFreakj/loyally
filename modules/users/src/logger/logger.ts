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

let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: "[LOGGER]",
  }),
  winston.format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(
    (debug: any) => ` ${debug.message}`
    // (debug: { label: any; timestamp: any; level: any; message: any }) =>
    //   ` ${debug.label}  ${debug.timestamp}  ${debug.level} : ${debug.message}`
  )
);

export const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
});
// export const logger = winston.createLogger({
// //   levels: logLevels,
//   level: process.env.LOG_LEVEL || "info",
//   format: combine(
//     // colorize({ all: true }),
//     timestamp({
//       format: "YYYY-MM-DD hh:mm:ss.SSS A",
//     }),
//     align(),
//     printf(
//       (info: { timestamp: any; level: any; message: any }) =>
//         `[${info.timestamp}] ${info.level}: ${info.message}`
//     )
//   ),
//   transports: [new winston.transports.Console()],
// });
