import { AxiosApiClient } from "./axiosApiClient.js";
import { BaseApiClient } from "./baseApiClient.js";
import ReporterService from "../../utils/reporter/reporter.js";
import LoggerService from "../../utils/logger/logger.js";
import { API_CLIENT } from "../../config/environment.js";

export class ApiClientFactory {
  private static clients = {
    axios: AxiosApiClient,
  };

  static getClient(): BaseApiClient {
    const desiredApiClient = API_CLIENT || "axios";
    return new this.clients[desiredApiClient](ReporterService, LoggerService);
  }
}
