export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => undefined);

    throw new ApiError(
      response.status,
      error,
    );
  }

  return response.json();
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly body?: unknown;

  constructor(status: number, body?: unknown) {
    super(`HTTP ${status}`);
    this.name = "ApiError";

    this.status = status;
    this.body = body;
  }
}