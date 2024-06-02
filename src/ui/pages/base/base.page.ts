import Logger from "../../../utils/logger/logger.js";
import { logAction } from "../../../utils/reporter/decorators.js";
import { hideSecretData } from "../../../utils/string/secretData.js";

const TIMEOUT_5_SECS = 5000;

type ActionContext = {
  isSecretValue?: boolean;
  timeout?: number;
};

type SelectorOrElement = string | WebdriverIO.Element;

export function isStringSelector(selectorOrElement: SelectorOrElement): selectorOrElement is string {
  return typeof selectorOrElement === "string";
}

export class BasePage {
  async findElement(selector: SelectorOrElement): Promise<WebdriverIO.Element> {
    return isStringSelector(selector) ? await $(selector) : selector;
  }

  async findElementArray(selector: string): Promise<WebdriverIO.ElementArray> {
    return $$(selector);
  }

  async waitForElement(selector: SelectorOrElement, reverse = false, timeout = TIMEOUT_5_SECS) {
    const element = await this.findElement(selector);
    element.waitForDisplayed({ timeout, reverse });
    return element;
  }

  async waitForElementAndScroll(selector: SelectorOrElement, timeout = TIMEOUT_5_SECS) {
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

  @logAction("Click on element with selector ${selector}")
  async click(selector: SelectorOrElement, timeout?: number) {
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

  @logAction("Set {text} into element with selector {selector}")
  async setValue(selector: SelectorOrElement, text: string, context?: ActionContext) {
    try {
      const element = await this.waitForElementAndScroll(selector, context?.timeout);
      if (element) {
        await element.setValue(text);
        Logger.log(`Successfully set "${context?.isSecretValue ? hideSecretData(text) : text}" into element with selector ${selector}`);
      }
    } catch (error) {
      Logger.log(`Failed to set "${context?.isSecretValue ? hideSecretData(text) : text}" into element with selector ${selector}`, "error");
      throw error;
    }
  }

  @logAction("Add {text} into element with selector {selector}")
  async addValue(selector: SelectorOrElement, text: string, timeout?: number) {
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

  @logAction("Clear value from element with selector {selector}")
  async clear(selector: SelectorOrElement, timeout?: number) {
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

  async getText(selector: SelectorOrElement, timeout?: number) {
    try {
      const element = await this.waitForElementAndScroll(selector, timeout);
      return await element.getText();
    } catch (error) {
      throw error;
    }
  }

  @logAction("Open URL {selector}")
  async openPage(url: string) {
    try {
      await browser.url(url);
      Logger.log(`Successfully opened url: ${url}`);
    } catch (error) {
      Logger.log(`Failed to opened url: ${url}`, "error");
      throw error;
    }
  }

  @logAction("Select dropdown value from {selector}")
  async selectDropdownValue(dropdown: SelectorOrElement, options: string, value: string) {
    await this.click(dropdown);
    const containerElements = await this.findElementArray(options);
    let foundElement: WebdriverIO.Element | undefined = undefined;
    for (const option of containerElements) {
      const text = await this.getText(option);
      if (text === value) {
        foundElement = option;
      }
    }
    if (foundElement) {
      await this.click(foundElement);
    }
  }
}
