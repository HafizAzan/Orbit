import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/app-context";
import { useProjectsForSelect } from "../../../hooks/use-workspace-projects";
import { useTeamMembers } from "../../../hooks/use-workspace-team";
import { useMyTasks, useTasks } from "../../../hooks/use-workspace-tasks";
import {
  groupWorkspaceSearchResults,
  searchMemberWorkspaceGlobal,
  searchWorkspaceGlobal,
  type WorkspaceGlobalSearchResult,
} from "../../../lib/workspace-global-search";
import { createWorkspaceNavState } from "../../../lib/workspace-navigation";

function WorkspaceGlobalSearch() {
  const navigate = useNavigate();
  const app = useAppContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: projects = [] } = useProjectsForSelect();
  const { data: allTasks = [] } = useTasks();
  const { data: myTasks = [] } = useMyTasks();
  const { data: teamMembers = [] } = useTeamMembers();

  const isMember = app?.user?.role === "member";
  const tasks = isMember ? myTasks : allTasks;
  const memberProjects = useMemo(() => {
    const projectIds = new Set(tasks.map((task) => task.projectId));
    return projects.filter((project) => projectIds.has(project.id));
  }, [projects, tasks]);

  const results = useMemo(() => {
    if (isMember) {
      return searchMemberWorkspaceGlobal(query, {
        projects: memberProjects,
        tasks,
        teamMembers: [],
      });
    }

    return searchWorkspaceGlobal(query, {
      projects,
      tasks,
      teamMembers,
    });
  }, [isMember, memberProjects, projects, query, tasks, teamMembers]);

  const resultMap = useMemo(() => new Map(results.map((result) => [result.id, result])), [results]);
  const groupedOptions = useMemo(() => groupWorkspaceSearchResults(results), [results]);

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
      <span className="truncate text-sm font-medium text-foreground">{result.title}</span>
      <span className="truncate text-xs text-muted">{result.subtitle}</span>
    </div>
  );

  const options = groupedOptions.map((group) => ({
    label: <span className="text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</span>,
    options: group.options.map((option) => ({
      value: option.value,
      label: renderOption(option.result),
    })),
  }));

  const showDropdown = open && query.trim().length >= 2;

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
        placeholder="Search projects, tasks, or team..."
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
