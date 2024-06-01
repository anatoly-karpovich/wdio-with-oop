import _ from "lodash";
import { ProductsApiService } from "../../api/services/product.service.js";
import { Id } from "../../types/api/apiClient.types.js";
import { IProduct, IProductFromResponse } from "../../types/products/product.types.js";
import { SignInService } from "../../ui/pages/signIn/sign-in-service/signIn.service.js";
import { HTTP_STATUS_CODES } from "../http/statusCodes.js";
import { generateNewProduct } from "./productGeneration.js";

const productApiSservice = new ProductsApiService();
const signInService = new SignInService();

export class Product {
  private constructor(private settings: IProductFromResponse, private service = new ProductsApiService()) {
    this.setSettings(settings);
  }

  setSettings(productSettings: IProductFromResponse) {
    this.settings = productSettings;
  }

  getSettings() {
    return this.settings;
  }

  getProductFieldsFromSettings() {
    return _.omit(this.settings, ["_id", "createdOn"]);
  }

  /**
   * Creates new generated product.
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

  static async create(customProductData?: Partial<IProduct>) {
    const productData = generateNewProduct(customProductData);
    const token = await signInService.getToken();
    const response = await productApiSservice.create(productData, token);
    if (response.status !== HTTP_STATUS_CODES.CREATED) throw new Error(`Product was not created`);
    return new Product(response.data.Product);
  }

  async delete() {
    const token = await signInService.getToken();
    const response = await this.service.delete(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.DELETED) throw new Error(`Product was not deleted with provided id ${this.settings._id}`);
  }

  async edit(newProductSettings: IProduct & Id) {
    const token = await signInService.getToken();
    const response = await this.service.update(newProductSettings, token);
    if (response.status !== HTTP_STATUS_CODES.OK) throw new Error(`Product was not updated with provided id ${this.settings._id}`);
    this.setSettings(response.data.Product);
  }

  async getLatest() {
    const token = await signInService.getToken();
    const response = await productApiSservice.getById(this.settings._id, token);
    if (response.status !== HTTP_STATUS_CODES.OK) throw new Error(`Product was not found with provided id ${this.settings._id}`);
    this.setSettings(response.data.Product);
  }
}
