import Ajv from "ajv";
import { expect } from "chai";
import { IResponse } from "../../types/api/apiClient.types";

export function validateResponseWithSchema(response: IResponse, status: number, IsSuccess: boolean, ErrorMessage: null | string, schema: object) {
  validateSchema(response, schema);
  validateResponse(response, status, IsSuccess, ErrorMessage);
}

export function validateResponse(response: IResponse, status: number, IsSuccess: boolean, ErrorMessage: null | string) {
  expect(response.status).to.equal(status);
  expect(response.data.IsSuccess).to.equal(IsSuccess);
  expect(response.data.ErrorMessage).to.equal(ErrorMessage);
}

export function validateSchema(response: IResponse, schema: object) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValidSchema = validate(response.data);
  expect(isValidSchema).to.be.true;
}

export function validateResponseSchema(...schemas: object[]): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor?.value;
    descriptor.value = async function (...args: any[]) {
      const result = (await originalMethod.apply(this, args)) as IResponse;
      const ajv = new Ajv();
      const validationResults = schemas.map((schema) => {
        const validate = ajv.compile(schema);
        return validate(result.data);
      });
      const isValid = validationResults.some(Boolean);
      if (!isValid) {
        throw new Error(`Expected response for "${String(propertyKey)}" method of "${target.constructor.name}" service to match any of related schemas`);
      }
      return result;
    };
    return descriptor;
  };
}
