import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

function WorkspaceSearch() {
  return (
    <Input
      allowClear
      size="large"
      placeholder="Search projects, tasks, or files..."
      prefix={<SearchOutlined className="text-muted!" />}
      className="max-w-2xl rounded-xl! bg-background/80!"
    />
  );
}

export default React.memo(WorkspaceSearch);
