import { LogoutOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../component/logo";
import { ConfirmModal } from "../../component/ui/modal";
import ADMIN_NAV_ITEMS from "../../data/admin-nav-items";
import { useAdminActivity } from "../../context/admin-activity-context";
import { useAppContext } from "../../context/app-context";
import { toast } from "../../lib/toast";
import { ADMIN_ROUTES } from "../../router/admin-routes";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import { cn } from "../../lib/utils";

type AdminSidebarContentProps = {
  className?: string;
  onNavigate?: () => void;
};

function AdminSidebarContent({ className, onNavigate }: AdminSidebarContentProps) {
  const navigate = useNavigate();
  const app = useAppContext();
  const { flaggedCount } = useAdminActivity();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    app?.setUser(null);
    toast.success("Logged out successfully");
    setLogoutOpen(false);
    onNavigate?.();
    navigate(UN_AUTH_ROUTES.LOGIN);
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <div className={cn("flex h-full flex-col px-4 py-6", className)}>
      <div className="mb-8 px-2">
        <Link
          to={ADMIN_ROUTES.DASHBOARD}
          onClick={handleNavClick}
          className="inline-flex transition-opacity duration-300 hover:opacity-90"
        >
          <Logo />
        </Link>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">Platform Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV_ITEMS.map(({ key, label, path, icon: Icon, badgeKey }) => {
          const badgeCount = badgeKey === "activityReview" ? flaggedCount : 0;

          return (
            <NavLink
              key={key}
              to={path}
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-feature-sync text-primary"
                    : "text-muted hover:bg-background hover:text-foreground",
                )
              }
            >
              <Icon className="text-base" />
              <span className="flex-1">{label}</span>
              {badgeCount > 0 ? (
                <Badge count={badgeCount} size="small" className="[&_.ant-badge-count]:bg-amber-500!" />
              ) : null}
            </NavLink>
          );
        })}
      </nav>

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
        description="Are you sure you want to logout? You will need to sign in again to access the admin panel."
        confirmText="Logout"
        confirmDanger
        icon={<LogoutOutlined />}
      />
    </div>
  );
}

function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card nav:flex">
      <AdminSidebarContent />
    </aside>
  );
}

export { AdminSidebarContent };
export default React.memo(AdminSidebar);
