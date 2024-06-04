import { HTTP_STATUS_CODES } from "../../data/http/statusCodes.js";
import { BaseApiClient } from "./baseApiClient.js";

export class FetchApiClient extends BaseApiClient {
  protected async transformErrorResponse(): Promise<void> {
    if (this.error instanceof Response) {
      const transformedResponse = {
        status: this.error.status,
        headers: {},
        data: this.error.status !== HTTP_STATUS_CODES.DELETED ? await this.response.json() : null,
      };
      this.error.headers.forEach((value: string, name: string) => {
        transformedResponse.headers[name] = value;
      });
      this.response = transformedResponse;
    }
  }
  protected transformRequestOptions() {
    //ok for JSON
  }

  protected async transformResponse(): Promise<void> {
    const transformedResponse = {
      status: this.response.status,
      headers: {},
      data: this.response.status !== 204 ? await this.response.json() : null,
    };
    this.response.headers.forEach((value: string, name: string) => {
      transformedResponse.headers[name] = value;
    });
    this.response = transformedResponse;
  }

  protected async send() {
    let url = this.options?.baseURL + this.options?.url!;
    const response = await fetch(url, {
      body: JSON.stringify(this.options?.data),
      headers: this.options?.headers,
      method: this.options?.method,
    });
    this.response = response;
    if (!response.ok) throw response;
  }

  protected logError(): void {
    console.log("Error: ", this.error instanceof Response ? `Request failed with status code ${this.error.status}` : this.error);
    console.log("Request URL:", this.options?.method, this.options?.url);
  }
}
