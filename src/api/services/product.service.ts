import { IRequestOptions } from "../../types/api/apiClient.types.js";
import type { IProduct, IProductResponse } from "../../types/products/product.types.js";
import { apiConfig } from "../../api/config/apiConfig.js";
import { logStep } from "../../utils/reporter/decorators.js";
import { ApiClientFactory } from "../apiClients/apiClientFactory.js";

const apiClient = ApiClientFactory.getClient();

class ProductsService {
  @logStep("Get product via API")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Product By Id"](id),
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<IProductResponse>(options);
  }

  @logStep("Get all products via API")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<IProductResponse>(options);
  }

  @logStep("Create product via API")
  async create(data: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IProductResponse>(options);
  }

  @logStep("Update product via API")
  async update(data: IProduct & { _id: string }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IProductResponse>(options);
  }

  @logStep("Delete product via API")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Product By Id"](id),
      method: "delete",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return apiClient.sendRequest<null>(options);
  }
}

export default new ProductsService();
