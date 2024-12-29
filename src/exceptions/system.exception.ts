import { HttpException } from "./http.exception";

export class SystemException extends HttpException {
  constructor(message: string = "Internal Server Error") {
    super(500, "System Error", { systemMessage: message });
  }
}
