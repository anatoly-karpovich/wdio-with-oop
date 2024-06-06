import _ from "lodash";
import { ProductsApiService } from "../../api/services/product.service.js";
import { Id } from "../../types/api/apiClient.types.js";
import { IProduct, IProductFromResponse } from "../../types/products/product.types.js";
import { SignInService } from "../signIn/sign-in-service/signIn.service.js";
import { HTTP_STATUS_CODES } from "../http/statusCodes.js";
import { generateNewProduct } from "./productGeneration.js";
import moment from "moment";
import { DeleteResponseError, ResponseError } from "../../utils/errors/errors.js";

const productApiSservice = new ProductsApiService();
const signInService = new SignInService();

export class Product {
  private constructor(private settings: IProductFromResponse, private service = new ProductsApiService()) {}

  setSettings(productSettings: IProductFromResponse) {
    this.settings = productSettings;
  }

  getSettings() {
    return this.settings;
  }

  getProductFieldsFromSettings() {
    return _.omit(this.settings, ["_id", "createdOn"]);
  }

  getProductDataTransformedToDetails() {
    return {
      name: this.settings.name,
      amount: String(this.settings.amount),
      price: String(this.settings.price),
      createdOn: moment(this.settings.createdOn).format("LLL"),
      manufacturer: this.settings.manufacturer,
      notes: this.settings.notes,
    };
  }

  /**
   * Creates new generated product from existing.
   *
   * @return {Promise<Product>} A promise that resolves with the product
   */
  static async createFromExisting({ name }: { name: string }): Promise<Product>;
  static async createFromExisting({ id }: { id: string }): Promise<Product>;
  static async createFromExisting(params: Record<"id" | "name", string>) {
    let productData: IProductFromResponse;
    const token = await signInService.getToken();
    if (params.id) {
      const response = await productApiSservice.getById(params.id, token);
      if (response.status !== HTTP_STATUS_CODES.OK) throw new Error(`Product was not found with provided id ${params.id}`);
      productData = response.data.Product;
    } else {
      const response = await productApiSservice.getAll(token);
      const foundProduct = response.data.Products.find((p: IProductFromResponse) => p.name === params.name);
      if (!foundProduct) throw new Error(`Product was not found with provided name ${params.name}`);
      productData = foundProduct;
    }
    return new Product(productData);
  }

  /**
   * Creates new generated product.
   *
   * @return {Promise<Product>} A promise that resolves with the product
   */
  static async create(customProductData?: Partial<IProduct>) {
    const productData = generateNewProduct(customProductData);
    const token = await signInService.getToken();
    const response = await productApiSservice.create(productData, token);
    if (response.status !== HTTP_STATUS_CODES.CREATED) {
      throw new ResponseError(`Failed to create product`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    return new Product(response.data.Product);
  }

  async delete() {
    const token = await signInService.getToken();
    const response = await this.service.delete(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.DELETED) {
      throw new DeleteResponseError(`Failed to create product`, { status: response.status });
    }
  }

  async edit(newProductSettings: IProduct & Id) {
    const token = await signInService.getToken();
    const response = await this.service.update(newProductSettings, token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to create product`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    this.setSettings(response.data.Product);
  }

  async getLatest() {
    const token = await signInService.getToken();
    const response = await productApiSservice.getById(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to get product`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    this.setSettings(response.data.Product);
    return response;
  }

  async checkProductExists() {
    const createProducts = await this.getAllProducts();
    const deletedProduct = createProducts.data.Products.find((el) => el._id === this.getSettings()._id);
    return deletedProduct === undefined;
  }

  async getAllProducts() {
    const token = await signInService.getToken();
    const response = await productApiSservice.getAll(token);
    if (response.status !== HTTP_STATUS_CODES.OK) {
      throw new ResponseError(`Failed to get products`, { status: response.status, IsSuccess: response.data.IsSuccess, ErrorMessage: response.data.ErrorMessage });
    }
    return response;
  }
}
