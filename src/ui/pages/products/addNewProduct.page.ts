import { IProduct } from "../../../types/products/product.types.js";
import { SalesPortalPage } from "../base/salesPortal.page.js";

class AddNewProductPage extends SalesPortalPage {
  get ["Name input"]() {
    return `#inputName`;
  }

  get ["Price input"]() {
    return `#inputPrice`;
  }

  get ["Amount input"]() {
    return `#inputAmount`;
  }

  get ["Notes input"]() {
    return `#textareaNotes`;
  }

  get ["Save New Product button"]() {
    return `#save-new-product`;
  }

  async fillProductInputs(product: IProduct) {
    await this.setValue(this["Name input"], product.name);
    //Manufacturer
    await this.setValue(this["Price input"], `${product.price}`);
    await this.setValue(this["Amount input"], `${product.amount}`);

    if (product.notes) {
      await this.setValue(this["Notes input"], product.notes);
    }
    await browser.pause(200);
  }

  async clickOnSaveNewProductButton() {
    await this.click(this["Save New Product button"]);
  }
}

export default new AddNewProductPage();
