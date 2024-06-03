import { Product } from "../../data/products/product.js";
import { generateNewProduct } from "../../data/products/productGeneration.js";

describe("Product Api tests", () => {
  let product: Product | null;
  beforeEach(async () => {});

  it("Should create product", async () => {
    const productData = generateNewProduct();
    product = await Product.create(productData);
    expect(product.getProductFieldsFromSettings()).toMatchObject({ ...productData });
  });

  it("Should update product", async () => {
    const productData = generateNewProduct();
    product = await Product.create(productData);
    await product.edit({ ...productData, _id: product.getSettings()._id });
    expect(product.getProductFieldsFromSettings()).toMatchObject({ ...productData });
  });

  afterEach(async () => {
    if (product) {
      await product.delete();
    }
    product = null;
  });
});
