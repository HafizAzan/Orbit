import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  applySubscriptionFiltersToSearchParams,
  DEFAULT_SUBSCRIPTION_FILTERS,
  parseSubscriptionFilters,
  type SubscriptionFilters,
} from "../lib/subscription-filters";

function useSubscriptionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseSubscriptionFilters(searchParams), [searchParams]);
  const [draftFilters, setDraftFilters] = useState<SubscriptionFilters>(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const setFilters = useCallback(
    (nextFilters: SubscriptionFilters) => {
      setSearchParams((current) => applySubscriptionFiltersToSearchParams(nextFilters, current), { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_SUBSCRIPTION_FILTERS);
  }, [setFilters]);

  return {
    filters,
    draftFilters,
    setDraftFilters,
    setFilters,
    clearFilters,
  };
}

export default useSubscriptionFilters;
