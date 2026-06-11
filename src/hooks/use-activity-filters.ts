import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  applyActivityFiltersToSearchParams,
  DEFAULT_ACTIVITY_FILTERS,
  parseActivityFilters,
  type ActivityFilters,
} from "../lib/activity-filters";

function useActivityFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseActivityFilters(searchParams), [searchParams]);
  const [draftFilters, setDraftFilters] = useState<ActivityFilters>(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const setFilters = useCallback(
    (nextFilters: ActivityFilters) => {
      setSearchParams((current) => applyActivityFiltersToSearchParams(nextFilters, current), { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_ACTIVITY_FILTERS);
  }, [setFilters]);

  return {
    filters,
    draftFilters,
    setDraftFilters,
    setFilters,
    clearFilters,
  };
}

export default useActivityFilters;
