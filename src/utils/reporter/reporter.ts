import allure from "./allure.js";
import { BaseReporter } from "./baseReporter.js";

const reporterServices: Record<string, BaseReporter> = {
  wdio: allure,
};

export default reporterServices[process.env.FRAMEWORK || "wdio"];
