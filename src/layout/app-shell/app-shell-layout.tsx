import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppThemedConfigProvider from "../../component/common/app-themed-config-provider";

type AppShellLayoutProps = {
  sidebar: React.ReactNode;
  mobileSidebar: (onNavigate: () => void) => React.ReactNode;
  header: React.ReactNode;
};

function AppShellLayout({ sidebar, mobileSidebar, header }: AppShellLayoutProps) {
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
    <AppThemedConfigProvider>
      <div className="flex min-h-screen bg-background font-roboto [&_.font-sans]:font-roboto">
        {sidebar}

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
          {mobileSidebar(() => setMobileOpen(false))}
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col">
          {React.isValidElement(header)
            ? React.cloneElement(header as React.ReactElement<{ onMenuOpen?: () => void }>, {
                onMenuOpen: () => setMobileOpen(true),
              })
            : header}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AppThemedConfigProvider>
  );
}

export default React.memo(AppShellLayout);
