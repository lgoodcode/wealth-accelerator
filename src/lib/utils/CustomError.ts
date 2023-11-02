// Define the valid error codes as a TypeScript type
export type ErrorCode = 'GENERAL' | 'NO_WAA_ACCOUNT' | 'MULTIPLE_WAA_ACCOUNTS';

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
