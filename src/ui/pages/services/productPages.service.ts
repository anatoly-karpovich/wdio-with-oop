import { NOTIFICATION_MESSAGES } from "../../../data/notifications.js";
import { Product } from "../../../data/products/product.js";
import { generateNewProduct } from "../../../data/products/productGeneration.js";
import { IProduct } from "../../../types/products/product.types.js";
import { logStep } from "../../../utils/reporter/decorators.js";
import homePage from "../home.page.js";
import addNewProductPage from "../products/addNewProduct.page.js";
import editProductPage from "../products/editProduct.page.js";
import productDetailsModal from "../products/modals/productDetails.modal.js";
import productsListPage from "../products/productsList.page.js";

enum PRODUCTS_PAGES_NAMES {
  ADD = "Add New Product",
  EDIT = "Edit Product",
  LIST = "Product List",
  DETAILS = "Details",
}

export class ProductPagesService {
  private homePage = homePage;
  private productsListPage = productsListPage;
  private addNewProductPage = addNewProductPage;
  private editProductPage = editProductPage;
  private detailsModal = productDetailsModal;

  currentPage: PRODUCTS_PAGES_NAMES;
  constructor(private product?: Product) {
    this.currentPage = PRODUCTS_PAGES_NAMES.LIST;
    if (product) {
      this.product = product;
    }
    console.log(`Products pages service started`);
  }

  async setProduct(product: Product) {
    this.product = product;
  }

  getProduct() {
    if (!this.product) throw new Error("No created product yes");
    return this.product;
  }

  @logStep("Open Products List page")
  async openProductsListPage() {
    await this.homePage.openModulePage("Products");
    await this.productsListPage.waitForPageIsLoaded();
    this.currentPage = PRODUCTS_PAGES_NAMES.LIST;
  }

  @logStep("Open Add New Product page")
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.productsListPage.waitForPageIsLoaded();
    this.currentPage = PRODUCTS_PAGES_NAMES.ADD;
  }

  @logStep("Submit new product")
  async populateProduct(productData?: IProduct) {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.ADD) throw new Error(`Unable to create product on ${this.currentPage} page`);
      const data = generateNewProduct(productData);
      await this.addNewProductPage.fillProductInputs(data);
      await this.addNewProductPage.clickOnSaveNewProductButton();
      await this.addNewProductPage.waitForPageIsLoaded();
      await this.addNewProductPage.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_CREATED);
      const createdProduct = await Product.createFromExisting({ name: data.name });
      this.setProduct(createdProduct);
    } catch (error) {
      throw new Error(`Failed to submit new product: ${(error as Error).message}`);
    }
  }

  @logStep("Submit product updates")
  async populateEditProduct(productData?: IProduct) {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.EDIT) throw new Error(`Unable to edit product on ${this.currentPage} page`);
      const data = generateNewProduct(productData);
      await this.editProductPage.fillProductInputs(data);
      await this.editProductPage.clickOnSaveChangesButton();
      await this.editProductPage.waitForPageIsLoaded();
      await this.addNewProductPage.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_UPDATED);
      if (!this.product) throw new Error("Unable to update not exist product");
      await this.product.getLatest();
    } catch (error) {
      throw new Error(`Failed to edit product: ${(error as Error).message}`);
    }
  }

  @logStep("Open product details modal")
  async openDetailsModal() {
    if (!this.product) throw new Error("Unable to open Product Details modal without a Product");
    await this.productsListPage.openProductDetails(this.product?.getSettings().name);
    this.currentPage = PRODUCTS_PAGES_NAMES.DETAILS;
  }

  async closeDetailsModal() {
    await this.detailsModal.close();
  }

  async getDetailsData() {
    if (this.currentPage !== PRODUCTS_PAGES_NAMES.DETAILS) throw new Error(`Failed: Product Details modal is not opened`);
    return await this.detailsModal.getDetails();
  }

  async openEditProductPage() {
    if (!this.product) throw new Error("Unable to open Edit Product Page without a Product");
    await this.productsListPage.openEditProductPage(this.product?.getSettings().name);
    this.currentPage = PRODUCTS_PAGES_NAMES.EDIT;
  }
}
