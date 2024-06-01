import Logger from "../../utils/logger/logger.js";
import { logStep } from "../../utils/reporter/decoratorsOld.js";

const TIMEOUT_5_SECS = 5000;

export class BasePage {
  async findElement(selector: string): Promise<WebdriverIO.Element> {
    return $(selector);
  }

  async waitForElement(selector: string, reverse = false, timeout = TIMEOUT_5_SECS) {
    const element = await this.findElement(selector);
    element.waitForDisplayed({ timeout, reverse });
    return element;
  }

  async waitForElementAndScroll(selector: string, timeout = TIMEOUT_5_SECS) {
    try {
      const element = await this.waitForElement(selector, false, timeout);
      await element.waitForExist({ timeout });
      await element.scrollIntoView({ block: "center" });
      Logger.log(`Successfully scrolled to element with selector ${selector}`);
      return element;
    } catch (error) {
      Logger.log(`Failed to scroll to element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logStep("Click on element with selector ${selector}")
  async click(selector: string, timeout?: number) {
    try {
      const element = await this.waitForElementAndScroll(selector, timeout);
      if (element) {
        await element.click();
        Logger.log(`Successfully clicked on element with selector ${selector}`);
      }
    } catch (error) {
      Logger.log(`Failed to click on element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logStep("Set {text} into element with selector {selector}")
  async setValue(selector: string, text: string, timeout?: number) {
    try {
      const element = await this.waitForElementAndScroll(selector, timeout);
      if (element) {
        await element.setValue(text);
        Logger.log(`Successfully set "${text}" into element with selector ${selector}`);
      }
    } catch (error) {
      Logger.log(`Failed to set "${text}" into element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logStep("Add {text} into element with selector {selector}")
  async addValue(selector: string, text: string, timeout?: number) {
    try {
      const element = await this.waitForElementAndScroll(selector, timeout);
      if (element) {
        await element.addValue(text);
        Logger.log(`Successfully added "${text}" into element with selector ${selector}`);
      }
    } catch (error) {
      Logger.log(`Failed to add "${text}" into element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logStep("Clear value from element with selector {selector}")
  async clear(selector: string, timeout?: number) {
    try {
      const element = await this.waitForElementAndScroll(selector, timeout);
      if (element) {
        await element.clearValue();
        Logger.log(`Successfully cleared value from element with selector ${selector}`);
      }
    } catch (error) {
      Logger.log(`Failed to clear value from element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logStep("Open URL {selector}")
  async openPage(url: string) {
    try {
      await browser.url(url);
      Logger.log(`Successfully opened url: ${url}`);
    } catch (error) {
      Logger.log(`Failed to opened url: ${url}`, "error");
      throw error;
    }
  }
}
