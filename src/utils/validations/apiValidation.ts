import Ajv from "ajv";
import { AxiosResponse } from "axios";
import { expect } from "chai";

export function validateResponseWithSchema(response: AxiosResponse, status: number, IsSuccess: boolean, ErrorMessage: null | string, schema: object) {
  validateSchema(response, schema);
  validateResponse(response, status, IsSuccess, ErrorMessage);
}

export function validateResponse(response: AxiosResponse, status: number, IsSuccess: boolean, ErrorMessage: null | string) {
  expect(response.status).to.equal(status);
  expect(response.data.IsSuccess).to.equal(IsSuccess);
  expect(response.data.ErrorMessage).to.equal(ErrorMessage);
}

export function validateSchema(response: AxiosResponse, schema: object) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValidSchema = validate(response.data);
  expect(isValidSchema).to.be.true;
}
