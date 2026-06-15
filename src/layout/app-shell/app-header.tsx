import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { getInitial } from "../../lib/helper";
import { cn } from "../../lib/utils";

type AppHeaderProps = {
  onMenuOpen?: () => void;
  search?: React.ReactNode;
  actions?: React.ReactNode;
  profileName: string;
  profileRole: string;
  profilePath: string;
  avatarUrl?: string | null;
};

function AppHeader({
  onMenuOpen,
  search,
  actions,
  profileName,
  profileRole,
  profilePath,
  avatarUrl,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-header-border bg-header-background px-4 backdrop-blur-sm sm:gap-4 sm:px-6 lg:px-8">
      <Button
        type="text"
        aria-label="Open menu"
        icon={<MenuOutlined className="text-lg!" />}
        onClick={onMenuOpen}
        className="nav:hidden! flex! h-10! w-10! shrink-0! items-center! justify-center!"
      />

      <div className="min-w-0 flex-1">{search}</div>

      <div className={cn("flex shrink-0 items-center gap-1 sm:gap-2")}>
        {actions}

        <Link
          to={profilePath}
          aria-label="Open profile"
          className="ml-1 flex items-center gap-3 rounded-xl border-l border-border pl-3 transition-colors hover:bg-background/80 sm:pl-4"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{profileName}</p>
            <p className="text-[10px] font-semibold tracking-wider text-primary uppercase">{profileRole}</p>
          </div>
          <Avatar
            size={40}
            className="shrink-0 bg-primary/10! text-primary! font-semibold!"
            src={avatarUrl ?? undefined}
          >
            {getInitial(profileName)}
          </Avatar>
        </Link>
      </div>
    </header>
  );
}

export default React.memo(AppHeader);
