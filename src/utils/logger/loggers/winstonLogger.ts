import * as winston from "winston";
import _ from "lodash";
import { Logger } from "./baseLogger.js";
import ReporterService from "../../reporter/reporter.js";
import ENVIRONMENT from "../../../config/environment.js";

type logLevels = "info" | "error";

class WinstonLogger extends Logger {
  private logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [new winston.transports.Console()],
  });

  log(message: string, level: logLevels = "info") {
    const logEntry = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}`;
    this.logArray.push(logEntry);
    if (ENVIRONMENT.DEBUG === "true") {
      this.logger.log({ level, message });
    }
  }

  logApiRequest(requestInfo: string) {
    this.log(`API Request: ${requestInfo}`);
  }

  logApiResponse(responseInfo: string, level: logLevels = "info") {
    this.log(`API Response: ${responseInfo}`);
  }

  sendLogsToReport() {
    const log = this.logArray.join("\n");
    this.ReporterServise.attachLog(log);
    this.clearLog();
  }

  clearLog() {
    _.remove(this.logArray);
  }
}

export default new WinstonLogger(ReporterService);
