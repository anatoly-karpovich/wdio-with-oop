export interface ErrorResponseCause extends StatusCause {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export interface StatusCause {
  status: number;
}
