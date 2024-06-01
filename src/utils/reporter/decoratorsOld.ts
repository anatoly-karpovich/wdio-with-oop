import allure from "@wdio/allure-reporter";
import type { RequestOptions } from "../../types/request/requestTypes.js";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Status } from "allure-js-commons";
import Logger from "../logger/logger.js";

export function logStep(stepName: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const selector = args[0]; // Extract the selector from the arguments
      const value = args[1]; // Extract the value from the arguments
      let newStepName = stepName.replace("{selector}", `"${selector}"`).replace("{text}", `"${value}"`);
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

export function attachLog(log: string) {
  allure.addAttachment("Test Log", log, "text/plain");
}

export function attachScreenshotToReport(screenshot: string) {
  allure.addAttachment("Screenshot", Buffer.from(screenshot, "base64"), "image/png");
}

export type ApiMethod = (options: RequestOptions) => AxiosResponse;

export function logApiStep(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const options: AxiosRequestConfig = args[0];
    // Start a step for the request.
    allure.startStep(`Request: ${options.method?.toUpperCase()} ${options.url}`);
    allure.addAttachment("Request Headers", JSON.stringify(options.headers, null, 2), "application/json");
    allure.addAttachment("Request Body", JSON.stringify(options.data, null, 2), "application/json");
    allure.endStep();
    Logger.logApiRequest(JSON.stringify(options));
    try {
      const response: AxiosResponse = await originalMethod.apply(this, args);

      // Start a step for the response.
      allure.startStep(`Response: ${response.status} ${response.config.url}`);
      allure.addAttachment("Response Headers", JSON.stringify(response.headers, null, 2), "application/json");
      allure.addAttachment("Response Body", JSON.stringify(response.data, null, 2), "application/json");

      // End the request step.
      allure.endStep(response.status >= 400 ? Status.FAILED : Status.PASSED);

      Logger.logApiResponse(JSON.stringify({ status: response.status, body: response.data }));

      return response;
    } catch (error) {
      // Handle any error and end the steps as needed.
      allure.endStep(Status.FAILED);
      throw error;
    }
  };

  return descriptor;
}
