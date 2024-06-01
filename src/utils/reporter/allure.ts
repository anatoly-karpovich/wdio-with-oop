import { BaseReporter } from "./baseReporter.js";
import allure from "@wdio/allure-reporter";
import { Status } from "allure-js-commons";

class AllureReporter extends BaseReporter {
  protected reportApiRequestData(): void {
    allure.startStep(`Request: ${this.requestOptions?.method?.toUpperCase()} ${this.requestOptions?.url}`);
    allure.addAttachment("Request Headers", JSON.stringify(this.requestOptions?.headers, null, 2), "application/json");
    allure.addAttachment("Request Body", this.requestOptions?.data ? JSON.stringify(this.requestOptions?.data, null, 2) : {}, "application/json");
    allure.endStep();
  }

  protected reportApiResponseData() {
    allure.startStep(`Response: ${this.response?.status} ${this.requestOptions?.url}`);
    allure.addAttachment("Response Headers", JSON.stringify(this.response?.headers, null, 2), "application/json");
    allure.addAttachment("Response Body", JSON.stringify(this.response?.data, null, 2), "application/json");
    allure.endStep(this.response && this.response.status >= 400 ? Status.FAILED : Status.PASSED);
  }

  attachLog(log: string) {
    allure.addAttachment("Test Log", log, "text/plain");
  }
}

export default new AllureReporter();