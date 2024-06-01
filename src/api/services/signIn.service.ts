import { IRequestOptions } from "../../types/api/apiClient.types.js";
import type { ILoginResponse, IUserCredentials } from "../../types/user/user.types.js";
import { apiConfig } from "../../api/config/apiConfig.js";
import { logStep } from "../../utils/reporter/decorators.js";
import { ApiClientFactory } from "../apiClients/apiClientFactory.js";
import { BaseApiClient } from "../apiClients/baseApiClient.js";

export class SignInApiService {
  private apiClient: BaseApiClient;
  constructor() {
    this.apiClient = ApiClientFactory.getClient();
  }
  @logStep("Sign in via API")
  async login(credentials: IUserCredentials) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Login,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: credentials,
    };
    return this.apiClient.sendRequest<ILoginResponse>(options);
  }
}
