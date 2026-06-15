import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../component/logo";
import { ConfirmModal } from "../../component/ui/modal";
import { useAppContext } from "../../context/app-context";
import { useLogout } from "../../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { clearAuthSession } from "../../lib/auth-session";
import { cn } from "../../lib/utils";
import { UN_AUTH_ROUTES } from "../../router/public-routes";

export type AppNavItem = {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

type AppSidebarContentProps = {
  navItems: AppNavItem[];
  bottomNavItems?: AppNavItem[];
  brandSubtitle: string;
  homePath: string;
  className?: string;
  onNavigate?: () => void;
};

function AppSidebarContent({
  navItems,
  bottomNavItems = [],
  brandSubtitle,
  homePath,
  className,
  onNavigate,
}: AppSidebarContentProps) {
  const navigate = useNavigate();
  const app = useAppContext();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { mutateAsync: logout } = useLogout();

  const handleLogoutConfirm = async () => {
    let logoutMessage: string | null = null;

    try {
      const result = await logout();
      logoutMessage = result.message;
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      clearAuthSession();
      app?.setUser(null);
      showApiSuccessToast(logoutMessage);
      setLogoutOpen(false);
      onNavigate?.();
      navigate(UN_AUTH_ROUTES.LOGIN);
    }
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  const renderNavLink = (item: AppNavItem) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.key}
        to={item.path}
        end={item.end ?? true}
        onClick={handleNavClick}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive ? "bg-feature-sync text-primary" : "text-muted hover:bg-background hover:text-foreground",
          )
        }
      >
        <Icon className="text-base" />
        <span className="flex-1">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className={cn("flex h-full flex-col px-4 py-6", className)}>
      <div className="mb-8 px-2">
        <Link to={homePath} onClick={handleNavClick} className="inline-flex transition-opacity duration-300 hover:opacity-90">
          <Logo />
        </Link>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">{brandSubtitle}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">{navItems.map(renderNavLink)}</nav>

      {bottomNavItems.length > 0 ? (
        <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">{bottomNavItems.map(renderNavLink)}</div>
      ) : null}

      <div className="mt-auto border-t border-border pt-4">
        <Button
          type="primary"
          danger
          block
          icon={<LogoutOutlined />}
          onClick={() => setLogoutOpen(true)}
          className="h-11! justify-start! px-3! font-semibold!"
        >
          Logout
        </Button>
      </div>

      <ConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your workspace."
        confirmText="Logout"
        confirmDanger
        icon={<LogoutOutlined />}
      />
    </div>
  );
}

export default React.memo(AppSidebarContent);
