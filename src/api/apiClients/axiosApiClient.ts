import axios, { AxiosRequestConfig } from "axios";
import { BaseApiClient } from "./baseApiClient.js";
// import ReporterService from "../../utils/reporter/reporter.js";
// import LoggerService from "../../utils/logger/logger.js";

class AxiosApiClient extends BaseApiClient {
  protected createRequestInstance() {
    this.request = axios.create();
  }

  protected async send() {
    return this.request(this.options as AxiosRequestConfig);
  }

  protected transformRequestOptions() {
    // options are ok for axios
  }

  protected transformResponse() {
    const transformedResponse = {
      data: this.response.data,
      status: this.response.status,
      headers: this.response.headers,
    };
    this.response = transformedResponse;
  }

  protected logError(error: any) {
    console.log("Error", error.isAxiosError ? error.message : error);
    console.log("Request URL:", this.options?.method, this.options?.url);
  }
}

export default new AxiosApiClient();
