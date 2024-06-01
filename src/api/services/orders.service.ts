import { apiConfig } from "../../api/config/apiConfig.js";
import { IRequestOptions, Id } from "../../types/api/apiClient.types.js";
import type { IAddCommentRequest, IDelivery, IOrderData, IOrderDataWithId, IOrderResponse, IOrderStatus, IOrdersResponse } from "../../types/orders/order.types.js";
import { logStep } from "../../utils/reporter/decorators.js";
import { ApiClientFactory } from "../apiClients/apiClientFactory.js";

const apiClient = ApiClientFactory.getClient();

class OrdersService {
  @logStep("Get order via API")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order By Id"](id),
      method: "get",
      headers: { Authorization: token },
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Get orders via API")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Orders"],
      method: "get",
      headers: { Authorization: token },
    };
    return apiClient.sendRequest<IOrdersResponse>(options);
  }

  @logStep("Create order via API")
  async create(data: IOrderData, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Orders"],
      method: "post",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Update order via API")
  async update(data: IOrderDataWithId, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order By Id"](data._id),
      method: "put",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Update order status via API")
  async updateStatus(data: IOrderStatus, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order Status"],
      method: "put",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Add or update delivery for order via API")
  async addDelivery(data: Id & { delivery: IDelivery }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order Delivery"],
      method: "post",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Receive orders for order via API")
  async receiveProducts(data: Id & { products: string[] }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order Receive"],
      method: "post",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Add comment for order via API")
  async addComment(data: IAddCommentRequest, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order Comments"],
      method: "post",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Delete comment from order via API")
  async deleteComment(data: Id & { comments: Id }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order Comments"],
      method: "put",
      headers: { Authorization: token },
      data: data,
    };
    return apiClient.sendRequest<IOrderResponse>(options);
  }

  @logStep("Delete order via API")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints["Order By Id"](id),
      method: "delete",
      headers: { Authorization: token },
    };
    return apiClient.sendRequest<null>(options);
  }
}

export default new OrdersService();
