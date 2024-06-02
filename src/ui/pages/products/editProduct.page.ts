import { SubmitProductPage } from "./submitProduct.page.js";

class EditProductPage extends SubmitProductPage {
  readonly "Delete Product button" = "#delete-product-btn";
  readonly "Save Changes button" = "#save-product-changes";

  async clickOnSaveChangesButton() {
    await this.click(this["Save Changes button"]);
  }

  async clickOnDeleteButton() {
    await this.click(this["Delete Product button"]);
  }
}

export default new EditProductPage();
