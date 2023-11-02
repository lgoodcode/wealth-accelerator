// Define the valid error codes as a TypeScript type
export type ErrorCode =
  | 'GENERAL'
  | 'NO_WAA_ACCOUNT' // CCF - If there is no WAA bank account link - to display a warning message
  | 'MULTIPLE_WAA_ACCOUNTS' // CCF - Cannot have multiple WAA bank account linked
  | 'DUPLICATE_ACCOUNT_NAME'; // Banking - Cannot have duplicate account names

export class CustomError extends Error {
  private _name = 'CustomError';
  private _code: ErrorCode;

  constructor(error: Error | string | { message: string }, code: ErrorCode = 'GENERAL') {
    // Pass the message to the parent Error class
    const message = typeof error === 'string' ? error : error.message;
    super(message);
    // Ensure the instanceof check works properly
    Object.setPrototypeOf(this, CustomError.prototype);
    // Custom error codes
    this._code = code;
    // Maintain a proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  public get name() {
    return this._name;
  }

  public get code() {
    return this._code;
  }
}
