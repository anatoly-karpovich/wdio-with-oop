import { ApiClientFactory } from "../apiClients/apiClientFactory.js";
import { apiConfig } from "../../api/config/apiConfig.js";
import { IRequestOptions } from "../../types/api/apiClient.types.js";
import type { ICustomer, ICustomerFromResponse, ICustomerResponse, ICustomersResponse } from "../../types/customers/customers.types.js";
import { logStep } from "../../utils/reporter/decorators.js";

const apiClient = ApiClientFactory.getClient();

class CustomerService {
  @logStep("Get customer via API")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints["Customer By Id"](id),
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Get all customers via API")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints.Customers,

      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<ICustomersResponse>(options);
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
    return apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Update customer via API")
  async update(data: ICustomerFromResponse, token: string) {
    const options: IRequestOptions<ICustomer> = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints.Customers,
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<ICustomerResponse>(options);
  }

  @logStep("Delete customer via API")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.baseURL + apiConfig.endpoints["Customer By Id"](id),
      method: "delete",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<null>(options);
  }
}

export default new CustomerService();
