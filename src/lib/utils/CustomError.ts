// Error codes
export const ERROR_CODES = {
  /** General error */
  GENERAL: 420,
} as const;

export class CustomError extends Error {
  private _name = 'CustomError';
  private _code: number;

  constructor(message: string, code = ERROR_CODES.GENERAL) {
    // Pass the message to the parent Error class
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
