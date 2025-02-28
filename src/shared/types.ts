export type APIErrorResult = {
  errorMessages: FieldError[]
}

export type FieldError = {
  message: string;
  field: string;
}
