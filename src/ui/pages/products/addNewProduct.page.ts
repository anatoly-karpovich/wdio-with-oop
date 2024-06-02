import { SubmitProductPage } from "./submitProduct.page.js";

class AddNewProductPage extends SubmitProductPage {
  readonly "Save New Product button" = "#save-new-product";
  readonly "Clear all button" = "#clear-inputs";

  async clickOnSaveNewProductButton() {
    await this.click(this["Save New Product button"]);
  }
}

export default new AddNewProductPage();
