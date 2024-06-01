import { Product } from "../../data/products/product.js";
import { generateNewProduct } from "../../data/products/productGeneration.js";
// import productService from "../services/product.service.js";

describe("Product Api tests", () => {
  let product: Product;
  beforeEach(async () => {});

  it("Should create product", async () => {
    const productData = generateNewProduct();
    product = await Product.create(productData);
    expect(product.getProductFieldsFromSettings()).toMatchObject({ ...productData });
  });

  afterEach(async () => {
    await product.delete();
  });
});
