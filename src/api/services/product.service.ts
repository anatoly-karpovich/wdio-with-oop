import { IRequestOptions } from "../../types/api/apiClient.types.js";
import type { IProduct, IProductResponse, IProductsResponse } from "../../types/products/product.types.js";
import { apiConfig } from "../../api/config/apiConfig.js";
import { logStep } from "../../utils/reporter/decorators.js";
import { ApiClientFactory } from "../apiClients/apiClientFactory.js";
import { BaseApiClient } from "../apiClients/baseApiClient.js";
import { validateResponseSchema } from "../../utils/validations/apiValidation.js";
import { createdProductSchema, productWithErrorSchema, productsSchema } from "../../data/schema/product.schema.js";

export class ProductsApiService {
  private apiClient: BaseApiClient;
  constructor() {
    this.apiClient = ApiClientFactory.getClient();
  }

  @validateResponseSchema(createdProductSchema, productWithErrorSchema)
  @logStep("Get product via API")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Product By Id"](id),
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<IProductResponse>(options);
  }

  @validateResponseSchema(productsSchema, productWithErrorSchema)
  @logStep("Get all products via API")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "get",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<IProductsResponse>(options);
  }

  @validateResponseSchema(createdProductSchema, productWithErrorSchema)
  @logStep("Create product via API")
  async create(data: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return await this.apiClient.sendRequest<IProductResponse>(options);
  }

  @validateResponseSchema(createdProductSchema, productWithErrorSchema)
  @logStep("Update product via API")
  async update(data: IProduct & { _id: string }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.Products,
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      data: data,
    };
    return this.apiClient.sendRequest<IProductResponse>(options);
  }

  @logStep("Delete product via API")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Product By Id"](id),
      method: "delete",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    return this.apiClient.sendRequest<null>(options);
  }
}
