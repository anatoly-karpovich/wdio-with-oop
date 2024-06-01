import { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type { RequestOptions } from "../../types/request/requestTypes.js";
import { logApiStep } from "../reporter/decoratorsOld.js";

export type Response<T = any> = Promise<AxiosResponse<T>>;

const request = axios.create();
let response: AxiosResponse;

class RequestApi {
  @logApiStep
  async sendRequest(options: RequestOptions): Response {
    options.timeout ? options.timeout : 120000;
    try {
      response = await request(options as AxiosRequestConfig);
    } catch (err: any) {
      console.log("Error", err.isAxiosError ? err.message : err);
      console.log("Request URL:", options.method, options.url);
      return err.response;
    }
    return response;
  }
}

export default new RequestApi();
