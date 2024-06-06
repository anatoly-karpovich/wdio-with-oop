import _ from "lodash";

import { IDelivery, IOrderResponse, ORDER_STATUSES, OrderSettings } from "../../types/orders/order.types.js";
import { Customer } from "../customers/customer.js";
import { Product } from "../products/product.js";
import { OrdersApiService } from "../../api/services/orders.service.js";
import { SignInService } from "../signIn/sign-in-service/signIn.service.js";
import { IResponse } from "../../types/api/apiClient.types.js";
import { HTTP_STATUS_CODES } from "../http/statusCodes.js";
import { DeleteResponseError, ResponseError } from "../../utils/errors/errors.js";
import { generateDelivery } from "./deliveryGeneration.js";

const signInService = new SignInService();
const orderService = new OrdersApiService();

export class Order {
  private constructor(private settings: OrderSettings, private service = new OrdersApiService()) {}

  getSettings() {
    return this.settings;
  }

  static async create(): Promise<Order>;
  static async create(data: { customer: Customer }): Promise<Order>;
  static async create(data: { products: Product[] }): Promise<Order>;
  static async create(data: { customer: Customer; products: Product[] }): Promise<Order>;
  static async create(data?: { customer?: Customer; products?: Product[] }): Promise<Order> {
    let orderResponse: IResponse<IOrderResponse>;
    const products: Product[] = [];
    let customer: Customer;
    const token = await signInService.getToken();
    if (data) {
      if (data.customer && data.products) {
        customer = data.customer;
        products.push(...data.products);
        orderResponse = await orderService.create({ customer: data.customer.getSettings()._id, products: data.products.map((p) => p.getSettings()._id) }, token);
      } else if (data.customer && !data.products) {
        customer = data.customer;
        products.push(await Product.create());
        orderResponse = await orderService.create({ customer: data.customer.getSettings()._id, products: [products[0].getSettings()._id] }, token);
      } else if (!data.customer && data.products) {
        customer = await Customer.create();
        orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: data.products.map((p) => p.getSettings()._id) }, token);
      } else {
        products.push(await Product.create());
        customer = await Customer.create();
        orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: [products[0].getSettings()._id] }, token);
      }
    } else {
      products.push(await Product.create());
      customer = await Customer.create();
      orderResponse = await orderService.create({ customer: customer.getSettings()._id, products: [products[0].getSettings()._id] }, token);
    }

    if (orderResponse.status !== HTTP_STATUS_CODES.CREATED || !orderResponse.data.IsSuccess || orderResponse.data.ErrorMessage) {
      throw new ResponseError(`Failed to create order`, { status: orderResponse.status, IsSuccess: orderResponse.data.IsSuccess, ErrorMessage: orderResponse.data.ErrorMessage });
    }
    const orderSettings: OrderSettings = { ...orderResponse.data.Order, customer, products };
    return new Order(orderSettings);
  }

  static async createFromExisting(id: string) {
    const token = await signInService.getToken();
    const orderResponse = await orderService.getById(id, token);
    if (orderResponse.status !== HTTP_STATUS_CODES.OK || !orderResponse.data.IsSuccess || orderResponse.data.ErrorMessage) {
      throw new ResponseError(`Failed to get order`, { status: orderResponse.status, IsSuccess: orderResponse.data.IsSuccess, ErrorMessage: orderResponse.data.ErrorMessage });
    }
    const orderSettings: OrderSettings = {
      ...orderResponse.data.Order,
      customer: await Customer.createFromExisting({ id: orderResponse.data.Order.customer._id }),
      products: await Promise.all(orderResponse.data.Order.products.map((p) => Product.createFromExisting({ id: p._id }))),
    };
    return new Order(orderSettings);
  }

  async addDelivery(delivery?: IDelivery) {
    const token = await signInService.getToken();
    const deliveryData = delivery ?? generateDelivery();
    const orderResponse = await this.service.addDelivery({ _id: this.settings._id, delivery: deliveryData }, token);
    if (orderResponse.status !== HTTP_STATUS_CODES.OK || !orderResponse.data.IsSuccess || orderResponse.data.ErrorMessage || !orderResponse.data.Order.delivery) {
      throw new ResponseError(`Failed to get order`, { status: orderResponse.status, IsSuccess: orderResponse.data.IsSuccess, ErrorMessage: orderResponse.data.ErrorMessage });
    }
    this.setDeliveryToSettings(orderResponse.data.Order.delivery);
  }

  private setDeliveryToSettings(delivery: IDelivery) {
    this.settings.delivery = delivery;
  }

  async delete() {
    const token = await signInService.getToken();
    const orderResponse = await this.service.delete(this.settings._id, token);
    if (orderResponse.status !== HTTP_STATUS_CODES.DELETED) {
      throw new DeleteResponseError(`Failed to delete order`, { status: orderResponse.status });
    }
  }

  async processOrder() {
    const token = await signInService.getToken();
    const orderResponse = await this.service.updateStatus({ _id: this.settings._id, status: ORDER_STATUSES.IN_PROCESS }, token);
    if (orderResponse.status !== HTTP_STATUS_CODES.OK || !orderResponse.data.IsSuccess || orderResponse.data.ErrorMessage) {
      throw new ResponseError(`Failed to update order`, { status: orderResponse.status, IsSuccess: orderResponse.data.IsSuccess, ErrorMessage: orderResponse.data.ErrorMessage });
    }
    this.settings.status = orderResponse.data.Order.status;
  }
}
