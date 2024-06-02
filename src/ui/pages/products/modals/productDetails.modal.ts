import { DetailsModal } from "./details.modal.js";

class ProductDetailsModal extends DetailsModal {
  async getDetails() {
    const [name, amount, price, manufacturer, createdOn, notes] = await Promise.all([
      this.getText(this["Row Value by Key"]("Name")),
      this.getText(this["Row Value by Key"]("Amount")),
      this.getText(this["Row Value by Key"]("Price")),
      this.getText(this["Row Value by Key"]("Manufacturer")),
      this.getText(this["Row Value by Key"]("Created On")),
      this.getText(this["Row Value by Key"]("Notes")),
    ]);
    return { name, amount, price, manufacturer, createdOn, notes };
  }
}

export default new ProductDetailsModal();
