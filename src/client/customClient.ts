export type ApiErrorBody = {
  title?: string;
  detail?: string;
  status?: number;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body?: ApiErrorBody;

  constructor(
    status: number,
    body?: ApiErrorBody,
    message?: string,
  ) {
    super(message ?? `Request failed with status ${status}`);

    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type CustomRequestInit = RequestInit & {
  url: string;
};

export const customClient = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    let body: ApiErrorBody | undefined;

    try {
      body = await response.json();
    } catch {
      // Error response wasn't JSON.
    }

    throw new ApiError(response.status, body);
  }

  return parseResponse<T>(response);
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  if (contentType.startsWith("text/")) {
    return response.text() as Promise<T>;
  }

  return response.blob() as Promise<T>;
}