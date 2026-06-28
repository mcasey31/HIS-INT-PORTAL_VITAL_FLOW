import { ApiError } from "../shared/apiError";
import { httpClient } from "../shared/httpClient";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  username: string;
  roles: string[];
  centroId: string;
  mustChangePassword?: boolean;
};

export type LoginCentroOption = {
  id: string;
  nombre: string;
};

type LoginRequest = {
  username: string;
  password: string;
  centroId?: string;
};

type RefreshRequest = {
  refreshToken: string;
  centroId?: string;
};

type LogoutRequest = {
  refreshToken: string;
};

async function parseAuthResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof payload?.detail === "string" && payload.detail) ||
      (typeof payload?.message === "string" && payload.message) ||
      response.statusText ||
      "Error en autenticacion";

    throw new ApiError(response.status, response.statusText, message, payload);
  }

  return payload as T;
}

async function authRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${apiBaseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseAuthResponse<T>(response);
}

export const authApi = {
  getLoginCentros: async () => {
    const url = `${apiBaseUrl}/api/v1/auth/centros`;
    const response = await fetch(url, { method: "GET" });
    return parseAuthResponse<LoginCentroOption[]>(response);
  },
  login: (request: LoginRequest) => authRequest<AuthTokensResponse>("/api/v1/auth/login", request),
  refresh: (request: RefreshRequest) => authRequest<AuthTokensResponse>("/api/v1/auth/refresh", request),
  logout: (request: LogoutRequest) => authRequest<{ message?: string }>("/api/v1/auth/logout", request),
  changePassword: (request: { currentPassword: string; newPassword: string }) =>
    httpClient.post<{ message?: string }>("/api/v1/auth/change-password", request),
};
