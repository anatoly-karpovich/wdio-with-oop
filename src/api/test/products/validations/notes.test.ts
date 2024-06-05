import { faker } from "@faker-js/faker";
import { Product } from "../../../../data/products/product.js";
import { generateNewProduct } from "../../../../data/products/productGeneration.js";
import { ResponseError } from "../../../../utils/errors/errors.js";

describe("[Products] [Validations] [Notes]", () => {
  let product: Product | null;

  it("Should create product with max length notes", async () => {
    const productData = generateNewProduct({ notes: faker.string.alphanumeric({ length: 250 }) });
    product = await Product.create(productData);
  });

  it("Should create product with min length notes", async () => {
    const productData = generateNewProduct({ notes: faker.string.alphanumeric({ length: 1 }) });
    product = await Product.create(productData);
  });

  it("Should not create product with '<>' in notes", async () => {
    const productData = generateNewProduct({ notes: "<>" });
    try {
      product = await Product.create(productData);
    } catch (error) {
      if (error instanceof ResponseError) {
        expect(error.message.includes("IsSuccess: false")).toBe(true);
        expect(error.message.includes("ErrorMessage: Incorrect request body")).toBe(true);
        expect(error.message.includes("Status code: 400")).toBe(true);
      } else {
        throw error;
      }
    }
  });

  afterEach(async () => {
    if (product) {
      await product.delete();
    }
    product = null;
  });
});
