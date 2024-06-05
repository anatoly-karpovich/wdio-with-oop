import moment from "moment";
import _ from "lodash";

import { ICustomer, ICustomerFromResponse } from "../../types/customers/customers.types.js";
import { CustomersApiService } from "../../api/services/customers.service.js";
import { DeleteResponseError, ResponseError } from "../../utils/errors/errors.js";
import { HTTP_STATUS_CODES } from "../http/statusCodes.js";
import { SignInService } from "../../ui/pages/signIn/sign-in-service/signIn.service.js";
import { generateNewCustomer } from "./customerGeneration.js";
import { Id } from "../../types/api/apiClient.types.js";

const signInService = new SignInService();
const customerApiSservice = new CustomersApiService();

export class Customer {
  private constructor(private settings: ICustomerFromResponse, private service = new CustomersApiService()) {}

  setSettings(customerSettings: ICustomerFromResponse) {
    this.settings = customerSettings;
  }

  getSettings() {
    return this.settings;
  }

  getCustomerFieldsFromSettings() {
    return _.omit(this.settings, ["_id", "createdOn"]);
  }

  getCustomerDataTransformedToDetails() {
    return {
      email: this.settings.email,
      name: this.settings.name,
      city: this.settings.city,
      flat: String(this.settings.flat),
      country: this.settings.country,
      house: String(this.settings.house),
      phone: this.settings.phone,
      street: this.settings.street,
      createdOn: moment(this.settings.createdOn).format("LLL"),
      notes: this.settings.notes,
    };
  }

  /**
   * Creates new generated customer from existing.
   *
   * @return {Promise<Customer>} A promise that resolves with the customer
   */
  static async createFromExisting({ email }: { email: string }): Promise<Customer>;
  static async createFromExisting({ id }: { id: string }): Promise<Customer>;
  static async createFromExisting(params: Record<"id" | "email", string>) {
    let customerData: ICustomerFromResponse;
    const token = await signInService.getToken();
    if (params.id) {
      const response = await customerApiSservice.getById(params.id, token);
      if (response.status !== HTTP_STATUS_CODES.OK) throw new Error(`Customer was not found with provided id ${params.id}`);
      customerData = response.data.Customer;
    } else {
      const response = await customerApiSservice.getAll(token);
      const foundCustomer = response.data.Customers.find((p: ICustomerFromResponse) => p.name === params.email);
      if (!foundCustomer) throw new Error(`Customer was not found with provided email ${params.email}`);
      customerData = foundCustomer;
    }
    return new Customer(customerData);
  }

  /**
   * Creates new generated customer.
   *
   * @return {Promise<Customer>} A promise that resolves with the customer
   */
  static async create(customCustomerData?: Partial<ICustomer>) {
    const customerData = generateNewCustomer(customCustomerData);
    const token = await signInService.getToken();
    const response = await customerApiSservice.create(customerData, token);
    if (response.status !== HTTP_STATUS_CODES.CREATED) {
      throw new ResponseError(`Failed to create customer`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    return new Customer(response.data.Customer);
  }

  async delete() {
    const token = await signInService.getToken();
    const response = await this.service.delete(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.DELETED) {
      throw new DeleteResponseError(`Failed to create customer`, { status: response.status });
    }
  }

  async edit(newCustomerSettings: ICustomer & Id) {
    const token = await signInService.getToken();
    const response = await this.service.update(newCustomerSettings, token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to create customer`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    this.setSettings(response.data.Customer);
  }

  async getLatest() {
    const token = await signInService.getToken();
    const response = await customerApiSservice.getById(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to get customer`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    this.setSettings(response.data.Customer);
    return response;
  }

  async checkCustomerExists() {
    const createCustomers = await this.getAllCustomers();
    const deletedCustomer = createCustomers.data.Customers.find((el) => el._id === this.getSettings()._id);
    return deletedCustomer === undefined;
  }

  async getAllCustomers() {
    const token = await signInService.getToken();
    const response = await customerApiSservice.getAll(token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to get customers`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    return response;
  }
}
