// const winston = require("winston");
// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, label, printf } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

// const myLogger = () => {
//   return winston.createLogger({
//     level: "debug",
//     format: combine(
//       format.colorize(),
//       timestamp({ format: "HH:mm:ss" }),
//       myFormat
//     ),
//     transports: [
//       //
//       // - Write all logs with level `error` and below to `error.log`
//       // - Write all logs with level `info` and below to `combined.log`
//       //
//       new winston.transports.File({
//         filename: "logs/error.log",
//         level: "error",
//       }),
//       new winston.transports.File({ filename: "logs/combined.log" }),
//       new winston.transports.Console(),
//     ],
//   });
// };

// // const myLogger = () => {
// //   return winston.createLogger({
// //     level: "debug",
// //     format: winston.format.simple(), //.json()
// //     transports: [
// //       //
// //       // - Write all logs with level `error` and below to `error.log`
// //       // - Write all logs with level `info` and below to `combined.log`
// //       //
// //       new winston.transports.File({
// //         filename: "logs/error.log",
// //         level: "error",
// //       }),
// //       new winston.transports.File({ filename: "logs/combined.log" }),
// //       new winston.transports.Console(),
// //     ],
// //   });
// // };

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

// module.exports = myLogger;

const winston = require("winston");
const { format, transports } = winston;
const path = require("path");

const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);

const myLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({
      filename: "logs/logas.log",
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.json()
      ),
    }),
  ],
  exitOnError: false,
});

module.exports = myLogger;
