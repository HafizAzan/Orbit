import { ConfigProvider, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminActivityProvider } from "../../context/admin-activity-context";
import { AdminProfileProvider } from "../../context/admin-profile-context";
import AdminHeader from "./header";
import AdminSidebar, { AdminSidebarContent } from "./sidebar";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 880px)");

    const handleChange = () => {
      if (media.matches) setMobileOpen(false);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 10,
          controlHeight: 40,
          fontFamily: '"Roboto", ui-sans-serif, system-ui, sans-serif',
        },
      }}
    >
      <AdminActivityProvider>
        <div className="flex min-h-screen bg-background font-roboto [&_.font-sans]:font-roboto">
          <AdminSidebar />

          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            placement="left"
            width={256}
            closable
            destroyOnClose={false}
            classNames={{
              header: "hidden!",
              body: "p-0!",
            }}
            styles={{
              body: { padding: 0 },
            }}
          >
            <AdminSidebarContent onNavigate={() => setMobileOpen(false)} />
          </Drawer>

          <AdminProfileProvider>
            <div className="flex min-w-0 flex-1 flex-col">
              <AdminHeader onMenuOpen={() => setMobileOpen(true)} />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
              </main>
            </div>
          </AdminProfileProvider>
        </div>
      </AdminActivityProvider>
    </ConfigProvider>
  );
}

export default React.memo(AdminLayout);
