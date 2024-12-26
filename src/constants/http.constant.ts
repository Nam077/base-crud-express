export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus];

export const HttpMessage: Record<HttpStatusType, string> = {
  [HttpStatus.OK]: "Success",
  [HttpStatus.CREATED]: "Created successfully",
  [HttpStatus.NO_CONTENT]: "No content",
  [HttpStatus.BAD_REQUEST]: "Bad request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not found",
  [HttpStatus.CONFLICT]: "Conflict",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable entity",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal server error",
  [HttpStatus.SERVICE_UNAVAILABLE]: "Service unavailable",
} as const;
