import { SalesPortalPage } from "../base/salesPortal.page.js";

class DeleteModal extends SalesPortalPage {
  readonly "Delete button" = `div.modal-footer button.btn-danger`;
  readonly "Cancel button" = `div.modal-footer button.btn-secondary`;
  readonly "Close button" = `div.modal-header button.btn-close`;
  readonly "Modal Text" = `div.modal-body p`;
  readonly "Modal Title" = `div.modal-header h5`;

  async delete() {
    await this.waitForElementClickable(this["Delete button"]);
    await this.click(this["Delete button"]);
    await this.waitForElement(this["Cancel button"], false);
  }
}

export default new DeleteModal();
