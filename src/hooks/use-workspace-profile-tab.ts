import { useMemo } from "react";
import type { RegisterAs } from "../types/auth.types";
import {
  DEFAULT_WORKSPACE_PROFILE_TAB,
  WORKSPACE_PROFILE_TABS,
  WORKSPACE_PROFILE_TAB_SLUGS,
  type WorkspaceProfileTab,
} from "../data/workspace-profile";
import useUrlTab from "./use-url-tab";

function useWorkspaceProfileTab(role: RegisterAs) {
  const allowedKeys = useMemo(
    () => WORKSPACE_PROFILE_TABS.filter((tab) => tab.roles.includes(role)).map((tab) => tab.key),
    [role],
  );

  const defaultKey = allowedKeys[0] ?? DEFAULT_WORKSPACE_PROFILE_TAB;

  return useUrlTab<WorkspaceProfileTab>({
    slugToKey: WORKSPACE_PROFILE_TAB_SLUGS,
    defaultKey,
    allowedKeys,
  });
}

export default useWorkspaceProfileTab;
