import { SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Input } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAskPlatform } from "../../../hooks/use-ai";
import { useAdminActivityList } from "../../../hooks/use-admin-activity";
import { useOrganizations } from "../../../hooks/use-admin-organizations";
import { useSubscriptions } from "../../../hooks/use-admin-subscriptions";
import { useAdminUsers } from "../../../hooks/use-admin-users";
import { showApiErrorToast } from "../../../lib/api-error";
import {
  buildAdminSearchUrl,
  groupAdminSearchResults,
  searchAdminGlobal,
  type AdminGlobalSearchResult,
} from "../../../lib/admin-global-search";
import type { AiAskWorkspaceDraft } from "../../../types/ai.types";
import { Paragraph, Text } from "../../ui/typography";

function AdminGlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<AiAskWorkspaceDraft | null>(null);
  const { mutateAsync: askAi, isPending: asking } = useAskPlatform();

  const searchEnabled = query.trim().length >= 2;
  const { data: organizationsPage } = useOrganizations({ page: 1, limit: 100 });
  const { data: usersPage } = useAdminUsers({ page: 1, limit: 100, search: searchEnabled ? query.trim() : undefined });
  const { data: subscriptionsPage } = useSubscriptions({ page: 1, limit: 100 });
  const { data: activitiesPage } = useAdminActivityList({
    page: 1,
    limit: 50,
    search: searchEnabled ? query.trim() : undefined,
  });

  const results = useMemo(
    () =>
      searchAdminGlobal(query, {
        organizations: organizationsPage?.data ?? [],
        users: usersPage?.data ?? [],
        subscriptions: subscriptionsPage?.data ?? [],
        activities: activitiesPage?.data ?? [],
      }),
    [activitiesPage?.data, organizationsPage?.data, query, subscriptionsPage?.data, usersPage?.data],
  );

  const resultMap = useMemo(() => new Map(results.map((result) => [result.id, result])), [results]);
  const groupedOptions = useMemo(() => groupAdminSearchResults(results), [results]);

  const handleSelect = (value: string) => {
    const result = resultMap.get(value);
    if (!result) return;

    navigate(buildAdminSearchUrl(result.route, query));
    setQuery("");
    setAiAnswer(null);
    setOpen(false);
  };

  const handleAskAi = async () => {
    const question = query.trim();
    if (question.length < 2) return;

    try {
      const result = await askAi({ question });
      setAiAnswer(result.draft);
      setOpen(true);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const renderOption = (result: AdminGlobalSearchResult) => (
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
      <Text as="span" size="xs" color="muted" weight="semibold" className="tracking-wide uppercase">
        {group.label}
      </Text>
    ),
    options: group.options.map((option) => ({
      value: option.value,
      label: renderOption(option.result),
    })),
  }));

  const showDropdown = open && (query.trim().length >= 2 || Boolean(aiAnswer));

  return (
    <AutoComplete
      value={query}
      options={options}
      open={showDropdown}
      onSelect={handleSelect}
      onSearch={(value) => {
        setQuery(value);
        setAiAnswer(null);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => {
        window.setTimeout(() => setOpen(false), 150);
      }}
      notFoundContent={
        query.trim().length >= 2 ? (
          <div className="space-y-2 px-3 py-2">
            <Paragraph size="sm" className="mb-0!">
              No results for &ldquo;{query.trim()}&rdquo;
            </Paragraph>
            <Button
              type="link"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={asking}
              onClick={() => void handleAskAi()}
              className="px-0!"
            >
              Ask platform AI
            </Button>
            {aiAnswer ? (
              <div className="rounded-lg border border-border bg-background/80 p-2">
                <Paragraph size="xs" className="mb-0!">
                  {aiAnswer.answer}
                </Paragraph>
              </div>
            ) : null}
          </div>
        ) : (
          <Paragraph size="sm" className="px-3 py-2 mb-0!">
            Type at least 2 characters to search
          </Paragraph>
        )
      }
      className="w-full max-w-md [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background! [&_.ant-select-selector]:px-0!"
      popupMatchSelectWidth={360}
      popupRender={(menu) => (
        <div>
          {menu}
          {query.trim().length >= 2 ? (
            <div className="border-t border-border px-3 py-2">
              <Button
                type="link"
                size="small"
                icon={<ThunderboltOutlined />}
                loading={asking}
                onClick={() => void handleAskAi()}
                className="px-0!"
              >
                Ask platform AI about this
              </Button>
              {aiAnswer ? (
                <div className="mt-2 rounded-lg border border-border bg-background/80 p-2">
                  <Paragraph size="xs" className="mb-0!">
                    {aiAnswer.answer}
                  </Paragraph>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    >
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined className="text-muted" />}
        placeholder="Search organizations, users, subscriptions..."
        className="rounded-xl! bg-background! [&_.ant-input]:text-sm! sm:[&_.ant-input]:text-base!"
        onKeyDown={(event) => {
          if (event.key !== "Enter" || !results.length) return;

          event.preventDefault();
          const firstResult = results[0];
          navigate(buildAdminSearchUrl(firstResult.route, query));
          setQuery("");
          setAiAnswer(null);
          setOpen(false);
        }}
      />
    </AutoComplete>
  );
}

export default React.memo(AdminGlobalSearch);
