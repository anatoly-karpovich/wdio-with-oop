import type { IProductResponse } from "../../types/products/product.types.js";

export class CreatedProducts {
  private static instance: CreatedProducts;
  private products: IProductResponse[] = [];

  constructor() {
    if (CreatedProducts.instance) {
      return CreatedProducts.instance;
    }
    CreatedProducts.instance = this;
  }

  addProduct(product: IProductResponse) {
    const productIndex = this.products.findIndex((p) => p._id === product._id);
    if (productIndex !== -1) {
      this.updateProduct(product, productIndex);
    } else {
      this.products.push(product);
    }
  }

  updateProduct(product: IProductResponse, productIndex: number = this.products.length - 1) {
    this.products[productIndex] = product;
  }

  getProduct(productIndex: number = this.products.length - 1) {
    return this.products[productIndex];
  }

  getAllCreatedProducts() {
    return this.products;
  }

  removeProduct(productIndex: number = this.products.length - 1) {
    return this.products.splice(productIndex, 1);
  }
}
