import { ApiError } from "./apiError";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

type HttpClientAuthRuntime = {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<boolean>;
  onAuthFailure: () => void;
};

let authRuntime: HttpClientAuthRuntime | null = null;

export function configureHttpClientAuth(runtime: HttpClientAuthRuntime | null) {
  authRuntime = runtime;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText || "Error en la solicitud";
    let data: any = null;

    try {
      data = await response.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      } else if (data && typeof data.message === "string") {
        message = data.message;
      } else if (data && typeof data.title === "string") {
        message = data.title;
      }
    } catch {
      // ignore json parsing failures and fallback to status text
    }

    throw new ApiError(response.status, response.statusText, message, data);
  }

  // If response has no content, return empty object (or null)
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function isAuthEndpoint(endpoint: string): boolean {
  const normalized = endpoint.toLowerCase();
  return normalized.includes("/api/v1/auth/login")
    || normalized.includes("/api/v1/auth/refresh")
    || normalized.includes("/api/v1/auth/logout");
}

async function doFetch(url: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.method !== "GET" && options.method !== "DELETE") {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = authRuntime?.getAccessToken();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(url, { ...options, headers });
}

async function request<T>(endpoint: string, options: RequestInit = {}, canRetryUnauthorized = true): Promise<T> {
  // endpoint should start with a slash
  const url = `${apiBaseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  let response = await doFetch(url, options);

  if (
    response.status === 401
    && canRetryUnauthorized
    && authRuntime
    && !isAuthEndpoint(endpoint)
  ) {
    const refreshed = await authRuntime.refreshSession();
    if (refreshed) {
      response = await doFetch(url, options);
    } else {
      authRuntime.onAuthFailure();
    }
  }

  return parseResponse<T>(response);
}

export const httpClient = {
  get: <T>(endpoint: string, options?: Omit<RequestInit, "method">) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: Omit<RequestInit, "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
