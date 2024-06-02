import { Product } from "../../../data/products/product.js";
import { ProductPagesService } from "../../pages/services/productPages.service.js";
import { SignInService } from "../../pages/signIn/sign-in-service/signIn.service.js";

describe("[Products] [Delete]", () => {
  const signInService = new SignInService();
  let productPagesService: ProductPagesService;

  beforeEach(async () => {
    await signInService.openSalesPortal();
    await signInService.signInAsAdminUI();
  });

  it("Should delete smoke product on Products List page", async () => {
    const product = await Product.create();
    productPagesService = new ProductPagesService(product);
    await productPagesService.openProductsListPage();
    await productPagesService.deleteProduct();
  });

  it("Should delete smoke product on Edit Product page", async () => {
    const product = await Product.create();
    productPagesService = new ProductPagesService(product);
    await productPagesService.openProductsListPage();
    await productPagesService.openEditProductPage();
    await productPagesService.deleteProduct();
  });

  afterEach(async () => {
    await signInService.signOut();
  });
});
