import { BaseApiClient } from "./baseApiClient.js";

export class FetchApiClient extends BaseApiClient {
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

  protected async send(): Promise<object> {
    let url = this.options?.baseURL + this.options?.url!;
    const response = await fetch(url, {
      body: JSON.stringify(this.options?.data),
      headers: this.options?.headers,
      method: this.options?.method,
    });
    return response;
  }

  protected logError(error: any): void {
    console.log("Error: ", error.message);
    console.log("Request URL:", this.options?.method, this.options?.url);
  }
}
