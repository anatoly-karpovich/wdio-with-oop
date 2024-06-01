import AxiosApiClient from "./axiosApiClient.js";
import { BaseApiClient } from "./baseApiClient.js";

export class ApiClientFactory {
  private static clients: Record<string, BaseApiClient> = {
    axios: AxiosApiClient,
  };

  static getClient(): BaseApiClient {
    const desiredApiClient = process.env.API_CLIENT || "axios";
    return this.clients[desiredApiClient];
  }
}

// export default clients[process.env.API_CLIENT || "axios"];
