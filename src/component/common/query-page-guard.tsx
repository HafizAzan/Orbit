/**
 * Wrap React Query pages: skeleton on first load (`isPending`), `QueryErrorState` on failure.
 * Pass static skeletons only — do not add custom loading state for API data; use the query object.
 */
import type { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import QueryErrorState from "./query-error-state";
type QueryPageGuardProps<TData> = {
  query: Pick<UseQueryResult<TData, Error>, "isPending" | "isError" | "error" | "refetch" | "isFetching">;
  loading: React.ReactNode;
  errorTitle?: string;
  errorDescription?: string;
  homePath?: string;
  homeLabel?: string;
  children: React.ReactNode;
};

function QueryPageGuard<TData>({
  query,
  loading,
  errorTitle,
  errorDescription,
  homePath,
  homeLabel,
  children,
}: QueryPageGuardProps<TData>) {
  if (query.isPending) {
    return <>{loading}</>;
  }

  if (query.isError) {
    return (
      <QueryErrorState
        error={query.error}
        title={errorTitle}
        description={errorDescription}
        onRetry={() => {
          void query.refetch();
        }}
        isRetrying={query.isFetching}
        homePath={homePath}
        homeLabel={homeLabel}
      />
    );
  }

  return <>{children}</>;
}

export default React.memo(QueryPageGuard) as typeof QueryPageGuard;
