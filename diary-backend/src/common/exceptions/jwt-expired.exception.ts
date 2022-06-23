import { HttpException } from '@nestjs/common';

export class JwtExpiredException extends HttpException {
  /**
   * @param message — string or object describing the error condition.
   * @param status HTTP response status code.
   */
  constructor(status: number, message?: string) {
    super(message, status);
    this.name = 'JwtExpiredError';
  }
}
