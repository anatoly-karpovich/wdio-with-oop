import { Product } from "../../../../data/products/product.js";
import { generateNewProduct } from "../../../../data/products/productGeneration.js";
import { IProduct } from "../../../../types/products/product.types.js";
import { logStep } from "../../../../utils/reporter/decoratorsOld.js";
import homePage from "../../home.page.js";
import addNewProductPage from "../addNewProduct.page.js";
import productsListPage from "../productsList.page.js";

export class ProductPagesService {
  private homePage = homePage;
  private productsListPage = productsListPage;
  private addNewProductPage = addNewProductPage;

  currentPage: string = "";
  constructor(private product?: Product) {}

  async setProduct(product: Product) {
    this.product = product;
  }

  async getProduct() {
    if (!this.product) throw new Error("No created product yes");
    return this.product;
  }

  @logStep("Open Products List page")
  async openProductsListPage() {
    await this.homePage.openModulePage("Products");
    await this.productsListPage.waitForPageIsLoaded();
    this.currentPage = "products list";
  }

  @logStep("Open Add New Product page")
  async openAddNewProductPage() {
    await this.productsListPage.clickOnAddNewProductButton();
    await this.productsListPage.waitForPageIsLoaded();
    this.currentPage = "add new product";
  }

  @logStep("Submit new product")
  async populateProduct(productData?: IProduct) {
    if (this.currentPage !== "add new product") throw new Error(`Unable to create product on ${this.currentPage} page`);
    const data = generateNewProduct(productData);
    await this.addNewProductPage.fillProductInputs(data);
    await this.addNewProductPage.clickOnSaveNewProductButton();
    await this.addNewProductPage.waitForPageIsLoaded();
    const createdProduct = await Product.createFromExisting({ name: data.name });
    this.setProduct(createdProduct);
  }
}
