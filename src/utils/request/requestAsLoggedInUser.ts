import CommonSteps from "../../ui/steps/common.steps.js";
import type { RequestParams } from "../../types/request/requestTypes.js";

export async function requestAsLoggedInUser<T>(action: Function, params: RequestParams<T>) {
  params.token = await CommonSteps.getAuthorizationToken();
  const response = await action(params);
  return response;
}
