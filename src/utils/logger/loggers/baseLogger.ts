import _ from "lodash";
import { BaseReporter } from "../../reporter/baseReporter.js";

export abstract class Logger {
  protected logArray: string[] = [];
  private static instance: Logger;
  constructor(protected ReporterServise: BaseReporter) {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  abstract log(message: string, logLevel?: logLevels): void;
  abstract sendLogsToReport(): void;
  abstract logApiRequest(requestInfo: string): void;
  abstract logApiResponse(responseInfo: string, level?: logLevels): void;
  abstract clearLog(): void;
}

type logLevels = "info" | "error" | "warn";
