import axios, { AxiosRequestConfig } from "axios";
import { BaseApiClient } from "./baseApiClient.js";

export class AxiosApiClient extends BaseApiClient {
  protected createRequestInstance() {}

  protected async send() {
    const request = axios.create();
    return await request(this.options as AxiosRequestConfig);
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
    console.log("Error: ", error.isAxiosError ? error.message : error);
    console.log("Request URL:", this.options?.method, this.options?.url);
  }
}
