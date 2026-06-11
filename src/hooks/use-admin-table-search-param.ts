import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ADMIN_TABLE_SEARCH_PARAM } from "../lib/admin-global-search";

function useAdminTableSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(ADMIN_TABLE_SEARCH_PARAM) ?? "";
  const [search, setSearchState] = useState(paramValue);

  useEffect(() => {
    setSearchState(paramValue);
  }, [paramValue]);

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);

      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          const trimmed = value.trim();

          if (trimmed) {
            next.set(ADMIN_TABLE_SEARCH_PARAM, trimmed);
          } else {
            next.delete(ADMIN_TABLE_SEARCH_PARAM);
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { search, setSearch };
}

export default useAdminTableSearchParam;
