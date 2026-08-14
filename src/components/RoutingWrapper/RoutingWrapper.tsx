import { usePage } from "@/hooks/usePage";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

type RoutePageProps<TIdentifier> = {
  identifier: TIdentifier;
  page: number;
};

type RouteWrapperProps<TIdentifier> = {
  Component: React.ComponentType<RoutePageProps<TIdentifier>>;
  parseIdentifier: (value: string) => TIdentifier;
};

export function RoutingWrapper<TIdentifier>({
  Component,
  parseIdentifier,
}: RouteWrapperProps<TIdentifier>) {
  const { identifier } = useParams<{ identifier: string }>();
  const [searchParams] = useSearchParams();

  const pageIdx = usePage();

  if (!identifier) {
    return <div>Resource identifier isn't specified</div>
  }

  return (
    <Component
      identifier={parseIdentifier(identifier)}
      page={pageIdx}
    />
  );
}