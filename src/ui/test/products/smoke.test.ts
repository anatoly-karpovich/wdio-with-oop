import { Product } from "../../../data/products/product.js";
import { ProductPagesService } from "../../pages/services/productPages.service.js";
import { SignInService } from "../../pages/signIn/sign-in-service/signIn.service.js";

describe("Products", () => {
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
    await productPagesService.openDetailsModal();
    const details = await productPagesService.getDetailsData();
    expect(details).toMatchObject({ ...productPagesService.getProduct().getProductDataTransformedToDetails() });
    await productPagesService.closeDetailsModal();
  });

  it("Should edit smoke product", async () => {
    const product = await Product.create();
    productPagesService = new ProductPagesService(product);
    await productPagesService.openProductsListPage();
    await productPagesService.openEditProductPage();
    await productPagesService.populateEditProduct();
    await productPagesService.openDetailsModal();
    const details = await productPagesService.getDetailsData();
    expect(details).toMatchObject({ ...productPagesService.getProduct().getProductDataTransformedToDetails() });
    await productPagesService.closeDetailsModal();
  });

  afterEach(async () => {
    await productPagesService.getProduct().delete();
    await signInService.signOut();
  });
});
