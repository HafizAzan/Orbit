import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  applyOrganizationFiltersToSearchParams,
  DEFAULT_ORGANIZATION_FILTERS,
  parseOrganizationFilters,
  type OrganizationFilters,
} from "../lib/organization-filters";

function useOrganizationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseOrganizationFilters(searchParams), [searchParams]);
  const [draftFilters, setDraftFilters] = useState<OrganizationFilters>(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const setFilters = useCallback(
    (nextFilters: OrganizationFilters) => {
      setSearchParams((current) => applyOrganizationFiltersToSearchParams(nextFilters, current), { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_ORGANIZATION_FILTERS);
  }, [setFilters]);

  return {
    filters,
    draftFilters,
    setDraftFilters,
    setFilters,
    clearFilters,
  };
}

export default useOrganizationFilters;
