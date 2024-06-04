import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BaseApiClient } from "./baseApiClient.js";

export class AxiosApiClient extends BaseApiClient {
  protected transformErrorResponse(): void {
    if (isAxiosError(this.error)) {
      const transformedResponse = {
        data: this.error.response?.data,
        status: this.error.response?.status,
        headers: this.error.response?.headers,
      };
      this.response = transformedResponse;
    }
  }

  protected async send() {
    const request = axios.create();
    const reponse = await request(this.options as AxiosRequestConfig);
    this.response = reponse;
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

  protected logError() {
    console.log("Error: ", isAxiosError(this.error) ? this.error.message : this.error);
    console.log("Request URL:", this.options?.method, this.options?.url);
  }
}

export function isAxiosError(err: any): err is AxiosError {
  return err.isAxiosError;
}
