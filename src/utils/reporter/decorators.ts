import allure from "@wdio/allure-reporter";
import { Status } from "allure-js-commons";
import { hideSecretData } from "../string/index.js";
import _ from "lodash";
import { isStringSelector } from "../../ui/pages/base/base.page.js";

export function logStep(stepName: string): MethodDecorator {
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor?.value;
    descriptor.value = async function (...args: any[]) {
      allure.startStep(stepName);
      try {
        const result = await originalMethod.apply(this, args);
        allure.endStep();
        return result;
      } catch (error) {
        allure.endStep(Status.FAILED);
        throw error;
      }
    };
    return descriptor;
  };
}

export function logAction(stepName: string): MethodDecorator {
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor?.value;
    descriptor.value = async function (...args: any[]) {
      const selectorOrElement = args[0]; // Extract the selector from the arguments
      const selector = isStringSelector(selectorOrElement) ? selectorOrElement : (selectorOrElement as WebdriverIO.Element).selector;
      const value = args[1]; // Extract the value from the arguments
      const isSecretArgument = args.find((el) => typeof el === "object" && "isSecretValue" in el);
      const isSecretValue = isSecretArgument ? isSecretArgument.isSecretValue : false;
      let newStepName = stepName.replace("{selector}", `"${selector}"`).replace("{text}", `"${isSecretValue ? hideSecretData(value) : value}"`);
      allure.startStep(newStepName);
      try {
        const result = await originalMethod.apply(this, args);
        allure.endStep();
        return result;
      } catch (error) {
        allure.endStep(Status.FAILED);
        throw error;
      }
    };
    return descriptor;
  };
}

export function attachScreenshotToReport(screenshot: string) {
  allure.addAttachment("Screenshot", Buffer.from(screenshot, "base64"), "image/png");
}

export function attachLog(log: string) {
  allure.addAttachment("Test Log", log, "text/plain");
}
