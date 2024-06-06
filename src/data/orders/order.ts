import _ from "lodash";

import { IOrderFromResponse, IOrderResponse } from "../../types/orders/order.types.js";
import { Customer } from "../customers/customer.js";
import { Product } from "../products/product.js";
import { OrdersApiService } from "../../api/services/orders.service.js";
import { SignInService } from "../signIn/sign-in-service/signIn.service.js";
import { IResponse } from "../../types/api/apiClient.types.js";
import { HTTP_STATUS_CODES } from "../http/statusCodes.js";
import { ResponseError } from "../../utils/errors/errors.js";

const signInService = new SignInService();
const orderService = new OrdersApiService();

export class Order {
  private constructor(private settings: IOrderFromResponse) {}

  setSettings(productSettings: IOrderFromResponse) {
    this.settings = productSettings;
  }

  getSettings() {
    return this.settings;
  }

  static async create(): Promise<Order>;
  static async create(data: { customer: Customer }): Promise<Order>;
  static async create(data: { products: Product[] }): Promise<Order>;
  static async create(data: { customer: Customer; products: Product[] }): Promise<Order>;
  static async create(data?: { customer?: Customer; products?: Product[] }): Promise<Order> {
    let orderResponse: IResponse<IOrderResponse>;
    const token = await signInService.getToken();
    if (data) {
      if (data.customer && data.products) {
        orderResponse = await orderService.create({ customer: data.customer.getSettings()._id, products: data.products.map((p) => p.getSettings()._id) }, token);
      } else if (data.customer && !data.products) {
        const product = await Product.create();
        orderResponse = await orderService.create({ customer: data.customer.getSettings()._id, products: [product.getSettings()._id] }, token);
      } else if (!data.customer && data.products) {
        const customer = await Customer.create();
        orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: data.products.map((p) => p.getSettings()._id) }, token);
      } else {
        const product = await Product.create();
        const customer = await Customer.create();
        orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: [product.getSettings()._id] }, token);
      }
    } else {
      const product = await Product.create();
      const customer = await Customer.create();
      orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: [product.getSettings()._id] }, token);
    }

    if (orderResponse.status !== HTTP_STATUS_CODES.CREATED || !orderResponse.data.IsSuccess || orderResponse.data.ErrorMessage) {
      throw new ResponseError(`Failed to create product`, { status: orderResponse.status, IsSuccess: orderResponse.data.IsSuccess, ErrorMessage: orderResponse.data.ErrorMessage });
    }
    return new Order(orderResponse.data.Order);
  }
}
