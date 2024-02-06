export interface CustomErrorInterface extends Error {
  message: string;
  status: number;
}

export class ErrorHandler extends Error implements CustomErrorInterface {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}
