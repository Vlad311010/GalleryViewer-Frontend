import './ErrorDisplay.css';

export function ErrorDisplay(error : ErrorDetails) {
  const status = error.status;
  const message = error.message;
  const details = error.detail ?? "";

  return (
    <main className="error-page">
      <div className="error-page-content">
        <div className="error-page-status">
          {status ? `Error code: ${status}`  : "Error"}
        </div>

        <h1>{message}</h1>

        {details && (
          <p className="error-page-detail">
            {details}
          </p>
        )}

        <button
          className="error-page-back"
          onClick={() => window.history.back()}
        >
          Go back
        </button>
      </div>
    </main>
  );
}

type ErrorDetails = {
  status?: number;
  message: string;
  detail?: string;
};

