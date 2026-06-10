import { BellOutlined, MenuOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Input } from "antd";
import React from "react";

type AdminHeaderProps = {
  onMenuOpen: () => void;
};

function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-header-border bg-header-background px-4 backdrop-blur-sm sm:gap-4 sm:px-6 lg:px-8">
      <Button
        type="text"
        aria-label="Open menu"
        icon={<MenuOutlined className="text-lg!" />}
        onClick={onMenuOpen}
        className="nav:hidden! flex! h-10! w-10! shrink-0! items-center! justify-center!"
      />

      <div className="min-w-0 flex-1">
        <Input
          size="large"
          prefix={<SearchOutlined className="text-muted" />}
          placeholder="Search organizations, users..."
          className="rounded-xl! bg-background! [&_.ant-input]:text-sm! sm:[&_.ant-input]:text-base! max-w-md"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Badge dot offset={[-2, 2]}>
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <BellOutlined className="text-lg" />
          </button>
        </Badge>

        <button
          type="button"
          aria-label="Help"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground sm:flex"
        >
          <QuestionCircleOutlined className="text-lg" />
        </button>

        <div className="ml-1 flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">Admin User</p>
            <p className="text-[10px] font-semibold tracking-wider text-primary uppercase">Super Admin</p>
          </div>
          <Avatar
            size={40}
            className="shrink-0 bg-primary/10! text-primary! font-semibold!"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          />
        </div>
      </div>
    </header>
  );
}

export default React.memo(AdminHeader);
