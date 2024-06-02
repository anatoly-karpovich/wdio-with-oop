import { ProductPagesService } from "../../pages/services/productPages.service.js";
import { SignInService } from "../../pages/signIn/sign-in-service/signIn.service.js";

const signInService = new SignInService();

describe("Products smoke test", () => {
  let productPagesService: ProductPagesService;

  beforeEach(async () => {
    productPagesService = new ProductPagesService();
    await signInService.openSalesPortal();
    await signInService.signInAsAdminUI();
  });

  it("Should create smoke product", async () => {
    await productPagesService.openProductsListPage();
    await productPagesService.openAddNewProductPage();
    await productPagesService.populateProduct();
    await productPagesService.openProductDetailsModal();
    const details = await productPagesService.getProductDetailsData();
    expect(details).toMatchObject({ ...productPagesService.getProduct().getProductDataTransformedToDetails() });
  });

  afterEach(async () => {
    await productPagesService.getProduct().delete();
  });
});
