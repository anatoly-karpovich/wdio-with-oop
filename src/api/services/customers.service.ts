import { ApiClientFactory } from "../apiClients/apiClientFactory.js";
import { apiConfig } from "../../api/config/apiConfig.js";
import { IRequestOptions, Id } from "../../types/api/apiClient.types.js";
import type { ICustomer, ICustomerResponse, ICustomersResponse } from "../../types/customers/customers.types.js";
import { logStep } from "../../utils/reporter/decorators.js";
import { BaseApiClient } from "../apiClients/baseApiClient.js";

export class CustomersApiService {
  private apiClient: BaseApiClient;
  constructor() {
    this.apiClient = ApiClientFactory.getClient();
  }

  @logStep("Get customer via API")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints["Customer By Id"](id),
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Get all customers via API")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints.Customers,

      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<ICustomersResponse>(options);
  }

  @logStep("Create customer via API")
  async create(data: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints.Customers,
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return this.apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Update customer via API")
  async update(data: ICustomer & Id, token: string) {
    const options: IRequestOptions<ICustomer> = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints.Customers,
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return this.apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Delete customer via API")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints["Customer By Id"](id),
      method: "delete",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<null>(options);
  }
}
