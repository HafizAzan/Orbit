import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  applyUserFiltersToSearchParams,
  DEFAULT_USER_FILTERS,
  parseUserFilters,
  type UserFilters,
} from "../lib/user-filters";

function useUserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseUserFilters(searchParams), [searchParams]);
  const [draftFilters, setDraftFilters] = useState<UserFilters>(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const setFilters = useCallback(
    (nextFilters: UserFilters) => {
      setSearchParams((current) => applyUserFiltersToSearchParams(nextFilters, current), { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_USER_FILTERS);
  }, [setFilters]);

  return {
    filters,
    draftFilters,
    setDraftFilters,
    setFilters,
    clearFilters,
  };
}

export default useUserFilters;
