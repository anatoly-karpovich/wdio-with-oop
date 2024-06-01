import productService from "../../api/services/product.service.js";
import signInService from "../../api/services/signIn.service.js";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../config/environment.js";
import { generateNewProduct } from "../../data/products/productGeneration.js";

describe("Product Api tests", () => {
  let token: string;
  let id: string;
  beforeEach(async () => {
    token = `Bearer ${(await signInService.login({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })).data.token}`;
  });

  it("Should create product", async () => {
    const productData = generateNewProduct();
    const productResponse = await productService.create(productData, token);
    console.log(productResponse);
    id = productResponse.data.Product._id;
  });

  afterEach(async () => {
    await productService.delete(id, token);
  });
});
