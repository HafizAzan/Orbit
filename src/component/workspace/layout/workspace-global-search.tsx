import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/app-context";
import { useProjectsForSelect } from "../../../hooks/use-workspace-projects";
import { useTeamMembers } from "../../../hooks/use-workspace-team";
import { useBoards, useMyTasks, useTasks } from "../../../hooks/use-workspace-tasks";
import {
  buildMemberSearchProjects,
  groupMemberWorkspaceSearchResults,
  groupWorkspaceSearchResults,
  searchMemberWorkspaceGlobal,
  searchWorkspaceGlobal,
  type WorkspaceGlobalSearchResult,
} from "../../../lib/workspace-global-search";
import { createWorkspaceNavState } from "../../../lib/workspace-navigation";
import { Text } from "../../ui/typography";

const MEMBER_SEARCH_LIMIT = 200;

function WorkspaceGlobalSearch() {
  const navigate = useNavigate();
  const app = useAppContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isMember = app?.user?.role === "member";

  const { data: projects = [] } = useProjectsForSelect({ enabled: !isMember });
  const { data: allTasksPage } = useTasks({ limit: 100, enabled: !isMember });
  const { data: myTasks = [] } = useMyTasks({ limit: MEMBER_SEARCH_LIMIT, enabled: isMember });
  const { data: boards = [] } = useBoards({ enabled: isMember });
  const { data: teamMembersPage } = useTeamMembers({ limit: 100, enabled: !isMember });

  const allTasks = allTasksPage?.data ?? [];
  const teamMembers = teamMembersPage?.data ?? [];

  const memberSearchProjects = useMemo(
    () => (isMember ? buildMemberSearchProjects(boards, myTasks) : []),
    [boards, isMember, myTasks],
  );

  const results = useMemo(() => {
    if (isMember) {
      return searchMemberWorkspaceGlobal(query, {
        projects: memberSearchProjects,
        tasks: myTasks,
      });
    }

    return searchWorkspaceGlobal(query, {
      projects,
      tasks: allTasks,
      teamMembers,
    });
  }, [allTasks, isMember, memberSearchProjects, myTasks, projects, query, teamMembers]);

  const resultMap = useMemo(() => new Map(results.map((result) => [result.id, result])), [results]);
  const groupedOptions = useMemo(
    () => (isMember ? groupMemberWorkspaceSearchResults(results) : groupWorkspaceSearchResults(results)),
    [isMember, results],
  );

  const handleSelect = (value: string) => {
    const result = resultMap.get(value);
    if (!result) return;

    const navState = createWorkspaceNavState(window.location.pathname);
    navigate(result.route, navState);
    setQuery("");
    setOpen(false);
  };

  const renderOption = (result: WorkspaceGlobalSearchResult) => (
    <div className="flex min-w-0 flex-col py-0.5">
      <Text as="span" size="sm" weight="medium" className="truncate">
        {result.title}
      </Text>
      <Text as="span" size="xs" color="muted" className="truncate">
        {result.subtitle}
      </Text>
    </div>
  );

  const options = groupedOptions.map((group) => ({
    label: (
      <Text as="span" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
        {group.label}
      </Text>
    ),
    options: group.options.map((option) => ({
      value: option.value,
      label: renderOption(option.result),
    })),
  }));

  const showDropdown = open && query.trim().length >= 2;
  const placeholder = isMember
    ? "Search your tasks and projects..."
    : "Search projects, tasks, or team...";

  return (
    <AutoComplete
      value={query}
      options={options}
      open={showDropdown}
      onSelect={handleSelect}
      onSearch={(value) => {
        setQuery(value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => {
        window.setTimeout(() => setOpen(false), 150);
      }}
      notFoundContent={
        query.trim().length >= 2 ? (
          <div className="px-3 py-2 text-sm text-muted">No results for &ldquo;{query.trim()}&rdquo;</div>
        ) : (
          <div className="px-3 py-2 text-sm text-muted">Type at least 2 characters to search</div>
        )
      }
      className="w-full max-w-md [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background! [&_.ant-select-selector]:px-0!"
      popupMatchSelectWidth={360}
    >
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined className="text-muted" />}
        placeholder={placeholder}
        className="rounded-xl! bg-background! [&_.ant-input]:text-sm! sm:[&_.ant-input]:text-base!"
        onKeyDown={(event) => {
          if (event.key !== "Enter" || !results.length) return;

          event.preventDefault();
          const firstResult = results[0];
          navigate(firstResult.route, createWorkspaceNavState(window.location.pathname));
          setQuery("");
          setOpen(false);
        }}
      />
    </AutoComplete>
  );
}

export default React.memo(WorkspaceGlobalSearch);
