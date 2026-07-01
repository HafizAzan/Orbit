import { MenuOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import AdminGlobalSearch from "../../component/admin/layout/admin-global-search";
import AdminNotificationsDropdown from "../../component/admin/layout/admin-notifications-dropdown";
import AppUiThemeDropdown from "../../component/common/app-ui-theme-dropdown";
import { PLATFORM_ADMIN_ROLE_LABEL } from "../../data/admin-profile";
import { getAdminDisplayName } from "../../lib/admin-profile";
import { ADMIN_ROUTES } from "../../router/admin-routes";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import useAdminProfile from "../../hooks/use-admin-profile";
import { Text } from "../../component/ui/typography";

type AdminHeaderProps = {
  onMenuOpen: () => void;
};

function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const { profile } = useAdminProfile();

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
        <AdminGlobalSearch />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <AppUiThemeDropdown />
        <AdminNotificationsDropdown />

        <Link
          to={UN_AUTH_ROUTES.HELP}
          aria-label="Help"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground sm:flex"
        >
          <QuestionCircleOutlined className="text-lg" />
        </Link>

        <Link
          to={ADMIN_ROUTES.PROFILE}
          aria-label="Open profile"
          className="ml-1 flex items-center gap-3 rounded-xl border-l border-border pl-3 transition-colors hover:bg-background/80 sm:pl-4"
        >
          <div className="hidden text-right sm:block">
            <Text as="p" size="sm" weight="semibold">{getAdminDisplayName(profile)}</Text>
            <Text as="p" className="text-[10px] font-semibold tracking-wider text-primary uppercase">{PLATFORM_ADMIN_ROLE_LABEL}</Text>
          </div>
          <Avatar
            size={40}
            className="shrink-0 bg-primary/10! text-primary! font-semibold!"
            src={profile.avatarUrl}
          />
        </Link>
      </div>
    </header>
  );
}

export default React.memo(AdminHeader);
