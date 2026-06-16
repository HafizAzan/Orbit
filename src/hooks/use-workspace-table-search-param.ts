import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WORKSPACE_TABLE_SEARCH_PARAM } from "../lib/workspace-global-search";

function useWorkspaceTableSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(WORKSPACE_TABLE_SEARCH_PARAM) ?? "";
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
            next.set(WORKSPACE_TABLE_SEARCH_PARAM, trimmed);
          } else {
            next.delete(WORKSPACE_TABLE_SEARCH_PARAM);
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

export default useWorkspaceTableSearchParam;
