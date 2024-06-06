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

  it("Should create smoke product", async () => {
    productPagesService = new ProductPagesService();
    await productPagesService.openProductsListPage();
    await productPagesService.openAddNewProductPage();
    await productPagesService.populateProduct();
    const details = await productPagesService.getDetails();
    expect(details).toMatchObject({ ...productPagesService.getProduct().getProductDataTransformedToDetails() });
  });

  it("Should edit smoke product", async () => {
    const product = await Product.create();
    productPagesService = new ProductPagesService(product);
    await productPagesService.openProductsListPage();
    await productPagesService.openEditProductPage();
    await productPagesService.populateEditProduct();
    const details = await productPagesService.getDetails();
    expect(details).toMatchObject({ ...productPagesService.getProduct().getProductDataTransformedToDetails() });
  });

  afterEach(async () => {
    await productPagesService.removeProduct();
    await signInService.signOut();
  });
});
