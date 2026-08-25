type LoaderProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

export function Loader({
  width = "100%",
  height = "100%",
  className,
}: LoaderProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loader-spinner" />
    </div>
  );
}