import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getTabSlug, isValidTabSlug, resolveTabFromSlug, setSearchParamValue } from "../lib/url-tab";

type UseUrlTabOptions<T extends string> = {
  paramKey?: string;
  slugToKey: Record<T, string>;
  defaultKey: T;
  allowedKeys?: readonly T[];
};

function useUrlTab<T extends string>({
  paramKey = "tab",
  slugToKey,
  defaultKey,
  allowedKeys,
}: UseUrlTabOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get(paramKey);

  const resolvedTab = useMemo(
    () => resolveTabFromSlug(tabParam, slugToKey, defaultKey),
    [defaultKey, slugToKey, tabParam],
  );

  const activeTab = useMemo(() => {
    if (allowedKeys && allowedKeys.length > 0 && !allowedKeys.includes(resolvedTab)) {
      return allowedKeys[0];
    }

    return resolvedTab;
  }, [allowedKeys, defaultKey, resolvedTab]);

  const setActiveTab = useCallback(
    (key: T) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, paramKey, getTabSlug(slugToKey, key));
          return next;
        },
        { replace: true },
      );
    },
    [paramKey, setSearchParams, slugToKey],
  );

  useEffect(() => {
    const expectedSlug = getTabSlug(slugToKey, activeTab);
    const isParamValid = isValidTabSlug(tabParam, slugToKey);
    const isParamAllowed =
      !allowedKeys ||
      allowedKeys.length === 0 ||
      (tabParam !== null && allowedKeys.some((key) => getTabSlug(slugToKey, key) === tabParam));

    if (!tabParam || !isParamValid || !isParamAllowed || tabParam !== expectedSlug) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, paramKey, expectedSlug);
          return next;
        },
        { replace: true },
      );
    }
  }, [activeTab, allowedKeys, paramKey, setSearchParams, slugToKey, tabParam]);

  return { activeTab, setActiveTab };
}

export default useUrlTab;
