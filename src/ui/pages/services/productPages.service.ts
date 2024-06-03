import { NOTIFICATION_MESSAGES } from "../../../data/notifications.js";
import { Product } from "../../../data/products/product.js";
import { generateNewProduct } from "../../../data/products/productGeneration.js";
import { IProduct } from "../../../types/products/product.types.js";
import { logStep } from "../../../utils/reporter/decorators.js";
import homePage from "../home.page.js";
import deleteModal from "../modals/delete.modal.js";
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
  private product: Product | null = null;
  private homePage = homePage;
  private productsListPage = productsListPage;
  private addNewProductPage = addNewProductPage;
  private editProductPage = editProductPage;
  private detailsModal = productDetailsModal;
  private deleteModal = deleteModal;

  constructor(product?: Product, private currentPage: PRODUCTS_PAGES_NAMES = PRODUCTS_PAGES_NAMES.LIST) {
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
    this.setCurrentPage(PRODUCTS_PAGES_NAMES.LIST);
  }

  @logStep("Open Add New Product page")
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.productsListPage.waitForPageIsLoaded();
    this.setCurrentPage(PRODUCTS_PAGES_NAMES.ADD);
  }

  @logStep("Submit new product")
  async populateProduct(productData?: IProduct) {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.ADD) throw new Error(`Current page is ${this.currentPage}, not Add Product page`);
      const data = generateNewProduct(productData);
      await this.fillInputs(data);
      await this.addNewProductPage.clickOnSaveNewProductButton();
      await this.addNewProductPage.waitForPageIsLoaded();
      await this.addNewProductPage.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_CREATED);
      const createdProduct = await Product.createFromExisting({ name: data.name });
      this.setProduct(createdProduct);
      this.setCurrentPage(PRODUCTS_PAGES_NAMES.LIST);
    } catch (error) {
      throw new Error(`Failed to submit new product: ${(error as Error).message}`);
    }
  }

  @logStep("Submit product updates")
  async populateEditProduct(productData?: IProduct) {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.EDIT) throw new Error(`Current page is ${this.currentPage}, not Edit Product page`);
      const data = generateNewProduct(productData);
      await this.fillInputs(data);
      await this.editProductPage.clickOnSaveChangesButton();
      await this.editProductPage.waitForPageIsLoaded();
      await this.addNewProductPage.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_UPDATED);
      if (!this.product) throw new Error("Unable to update not exist product");
      await this.product.getLatest();
      this.setCurrentPage(PRODUCTS_PAGES_NAMES.LIST);
    } catch (error) {
      throw new Error(`Failed to edit product: ${(error as Error).message}`);
    }
  }

  async fillInputs(data: IProduct) {
    if (this.currentPage === PRODUCTS_PAGES_NAMES.ADD) {
      await this.addNewProductPage.fillProductInputs(data);
    } else if (this.currentPage === PRODUCTS_PAGES_NAMES.EDIT) {
      await this.editProductPage.fillProductInputs(data);
    } else {
      throw new Error(`Current page is ${this.currentPage}`);
    }
  }

  @logStep("Open product details modal")
  async openDetailsModal() {
    try {
      if (!this.product) throw new Error("No product");
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.LIST) throw new Error(`Current page is ${this.currentPage}, not Product Details Modal`);
      await this.productsListPage.openProductDetails(this.product.getSettings().name);
      this.setCurrentPage(PRODUCTS_PAGES_NAMES.DETAILS);
    } catch (error) {
      throw new Error(`Failed to open Product Details modal: ${(error as Error).message}`);
    }
  }

  @logStep("Close product details modal")
  async closeDetailsModal() {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.DETAILS) throw new Error(`Product Details modal is not opened`);
      await this.detailsModal.close();
      this.setCurrentPage(PRODUCTS_PAGES_NAMES.LIST);
    } catch (error) {
      throw new Error(`Failed to close Product Details modal: ${(error as Error).message}`);
    }
  }

  async getDetails() {
    try {
      await this.openDetailsModal();
      const data = await this.getDetailsData();
      await this.closeDetailsModal();
      return data;
    } catch (error) {
      throw new Error(`Failed to get Product Details data: ${(error as Error).message}`);
    }
  }

  async getDetailsData() {
    try {
      if (this.currentPage !== PRODUCTS_PAGES_NAMES.DETAILS) throw new Error(`Product Details modal is not opened`);
      return await this.detailsModal.getDetails();
    } catch (error) {
      throw new Error(`Failed to get Product Details data: ${(error as Error).message}`);
    }
  }

  @logStep("Open Edit Product page")
  async openEditProductPage() {
    try {
      if (!this.product) throw new Error("No product");
      await this.productsListPage.openEditProductPage(this.product.getSettings().name);
      this.setCurrentPage(PRODUCTS_PAGES_NAMES.EDIT);
    } catch (error) {
      throw new Error(`Failed to open Edit product page: ${(error as Error).message}`);
    }
  }

  @logStep("Delete product via UI")
  async deleteProduct() {
    try {
      if (!this.product) throw new Error("No product");

      if (this.currentPage === PRODUCTS_PAGES_NAMES.LIST) {
        await this.productsListPage.openDeleteProduct(this.product.getSettings().name);
        await this.deleteModal.delete();
        await this.deleteModal.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_DELETED);
      } else if (this.currentPage === PRODUCTS_PAGES_NAMES.EDIT) {
        await this.editProductPage.clickOnDeleteButton();
        await this.deleteModal.delete();
        await this.deleteModal.validateNotification(NOTIFICATION_MESSAGES.PRODUCT_DELETED);
      }
    } catch (error) {
      throw new Error(`Failed to delete product: ${(error as Error).message}`);
    }
  }

  async removeProduct() {
    try {
      if (!this.product) throw new Error("Unable to remove product: no product");
      await this.product.delete();
    } catch (error) {
      throw new Error(`Failed to remove product: ${(error as Error).message}`);
    }
  }

  private setCurrentPage(page: PRODUCTS_PAGES_NAMES) {
    this.currentPage = page;
  }
}
