export class HISApiError extends Error {
  public readonly statusCode: number;
  public readonly hisMessage: string;

  constructor(statusCode: number, message: string) {
    super(`[HIS ${statusCode}] ${message}`);
    this.name = "HISApiError";
    this.statusCode = statusCode;
    this.hisMessage = message;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }
}

export function toTRPCCode(statusCode: number): "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "TOO_MANY_REQUESTS" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" {
  switch (statusCode) {
    case 401: return "UNAUTHORIZED";
    case 403: return "FORBIDDEN";
    case 404: return "NOT_FOUND";
    case 429: return "TOO_MANY_REQUESTS";
    default: return statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST";
  }
}
