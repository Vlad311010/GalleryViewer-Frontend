import { useSearchParams } from "react-router-dom";

export function usePage() {
  const [searchParams] = useSearchParams();

  const value = Number(searchParams.get("page") ?? 1);

  return Number.isInteger(value) && value > 0 ? value : 1;
}