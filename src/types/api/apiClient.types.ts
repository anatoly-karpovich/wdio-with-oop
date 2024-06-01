export type IRequestOptions<Data = object> = {
  method: Method;
  baseURL: string;
  url: string;
  params?: Record<string, string | readonly string[]>;
  headers: Record<string, string>;
  data?: Data;
  timeout?: number;
};

type Method = "post" | "get" | "put" | "patch" | "delete";

export interface IResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, unknown>;
}

interface RequestParams<T> {
  data?: T;
}

export interface DashboardRequestParams<T> extends RequestParams<T> {
  projectName: string;
  dashboardId?: number;
}

export type Id = { _id: string };

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}
