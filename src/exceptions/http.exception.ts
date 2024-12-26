import { HttpError } from "routing-controllers";
import {
  HttpStatus,
  HttpMessage,
  HttpStatusType,
} from "../constants/http.constant";

export class HttpException extends HttpError {
  public status: number;
  public message: string;
  public errors?: any;

  constructor(status: number, message?: string, errors?: any) {
    super(status);
    this.status = status;
    this.message = message || HttpMessage[status as HttpStatusType];
    this.errors = errors;
    this.name = "HttpException";
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string, errors?: any) {
    super(
      HttpStatus.BAD_REQUEST,
      message || HttpMessage[HttpStatus.BAD_REQUEST],
      errors
    );
    this.name = "BadRequestException";
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(
      HttpStatus.UNAUTHORIZED,
      message || HttpMessage[HttpStatus.UNAUTHORIZED]
    );
    this.name = "UnauthorizedException";
  }
}

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.NOT_FOUND, message || HttpMessage[HttpStatus.NOT_FOUND]);
    this.name = "NotFoundException";
  }
}

export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(HttpStatus.CONFLICT, message || HttpMessage[HttpStatus.CONFLICT]);
    this.name = "ConflictException";
  }
}
