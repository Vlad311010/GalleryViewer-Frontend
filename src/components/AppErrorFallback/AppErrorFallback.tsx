import { ApiError } from "@/client/customClient";
import type { FallbackProps } from "react-error-boundary";
import { ErrorDisplay } from "../ErrorDisplay/ErrorDisplay";

export function AppErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  if (error instanceof ApiError) {
    return (<ErrorDisplay 
        status={error.status}
        message={error.message}
        detail={error.body?.detail}
      />);
  }

  let message;
  if (error instanceof Error) {
    message = error.message
  }

  return (
    <ErrorDisplay 
      status={0}
      message={message ?? "An unexpected error occurred"}
    />
  );
}