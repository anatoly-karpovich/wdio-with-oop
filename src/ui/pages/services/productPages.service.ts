import { Product } from "../../../data/products/product.js";
import { generateNewProduct } from "../../../data/products/productGeneration.js";
import { IProduct } from "../../../types/products/product.types.js";
import { logStep } from "../../../utils/reporter/decorators.js";
import homePage from "../home.page.js";
import addNewProductPage from "../products/addNewProduct.page.js";
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
  private detailsModal = productDetailsModal;

  currentPage: PRODUCTS_PAGES_NAMES;
  constructor(private product?: Product) {
    this.currentPage = PRODUCTS_PAGES_NAMES.LIST;
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
    if (this.currentPage !== PRODUCTS_PAGES_NAMES.ADD) throw new Error(`Unable to create product on ${this.currentPage} page`);
    const data = generateNewProduct(productData);
    await this.addNewProductPage.fillProductInputs(data);
    await this.addNewProductPage.clickOnSaveNewProductButton();
    await this.addNewProductPage.waitForPageIsLoaded();
    const createdProduct = await Product.createFromExisting({ name: data.name });
    this.setProduct(createdProduct);
  }

  async openProductDetailsModal() {
    if (!this.product) throw new Error("Unable to open Product Details modal without a Product");
    await this.productsListPage.openProductDetails(this.product?.getSettings().name);
    this.currentPage = PRODUCTS_PAGES_NAMES.DETAILS;
  }

  async getProductDetailsData() {
    if (this.currentPage !== PRODUCTS_PAGES_NAMES.DETAILS) throw new Error(`Failed: Product Details modal is not opened`);
    return await this.detailsModal.getDetails();
  }
}
