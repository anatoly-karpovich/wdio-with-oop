import { Product } from "../../../../data/products/product.js";
import { ProductPagesService } from "../../../pages/services/productPages.service.js";
import { SignInService } from "../../../../data/signIn/sign-in-service/signIn.service.js";

describe("[Products] [Smoke]", () => {
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
    const isProductDeleted = await productPagesService.getProduct().checkProductExists();
    expect(isProductDeleted).toBe(true);
  });

  it("Should delete smoke product on Edit Product page", async () => {
    const product = await Product.create();
    productPagesService = new ProductPagesService(product);
    await productPagesService.openProductsListPage();
    await productPagesService.openEditProductPage();
    await productPagesService.deleteProduct();
    const isProductDeleted = await productPagesService.getProduct().checkProductExists();
    expect(isProductDeleted).toBe(true);
  });

  afterEach(async () => {
    await signInService.signOut();
  });
});
