import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildAdminSearchUrl,
  groupAdminSearchResults,
  searchAdminGlobal,
  type AdminGlobalSearchResult,
} from "../../../lib/admin-global-search";
import { Paragraph, Text } from "../../ui/typography";

function AdminGlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => searchAdminGlobal(query), [query]);
  const resultMap = useMemo(() => new Map(results.map((result) => [result.id, result])), [results]);
  const groupedOptions = useMemo(() => groupAdminSearchResults(results), [results]);

  const handleSelect = (value: string) => {
    const result = resultMap.get(value);
    if (!result) return;

    navigate(buildAdminSearchUrl(result.route, query));
    setQuery("");
    setOpen(false);
  };

  const renderOption = (result: AdminGlobalSearchResult) => (
    <div className="flex min-w-0 flex-col py-0.5">
      <Text as="span" size="sm" weight="medium" className="truncate">{result.title}</Text>
      <Text as="span" size="xs" color="muted" className="truncate">{result.subtitle}</Text>
    </div>
  );

  const options = groupedOptions.map((group) => ({
    label: <Text as="span" size="xs" color="muted" weight="semibold" className="tracking-wide uppercase">{group.label}</Text>,
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
          <Paragraph size="sm" className="px-3 py-2 mb-0!">No results for &ldquo;{query.trim()}&rdquo;</Paragraph>
        ) : (
          <Paragraph size="sm" className="px-3 py-2 mb-0!">Type at least 2 characters to search</Paragraph>
        )
      }
      className="w-full max-w-md [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background! [&_.ant-select-selector]:px-0!"
      popupMatchSelectWidth={360}
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
          setOpen(false);
        }}
      />
    </AutoComplete>
  );
}

export default React.memo(AdminGlobalSearch);
