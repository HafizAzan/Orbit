import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import NAV_ITEMS from "../../../data/nav-items";
import { cn, isSectionActive, scrollToSection } from "../../../lib/utils";
import { UN_AUTH_ROUTES } from "../../../router/constant";

type MobileMenuProps = {
  open: boolean;
  headerHeight: number;
  onClose: () => void;
};

function MobileMenu({ open, headerHeight, onClose }: MobileMenuProps) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    scrollToSection(sectionId, headerHeight);
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "nav:hidden fixed inset-x-0 bottom-0 z-40 bg-black/20 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ top: headerHeight }}
        onClick={onClose}
      />

      <div
        aria-hidden={!open}
        className={cn(
          "nav:hidden fixed inset-x-0 z-50 overflow-hidden border-b border-border bg-card shadow-lg transition-[max-height,opacity] duration-300 ease-in-out",
          open ? "max-h-[calc(100vh-4rem)] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
        style={{ top: headerHeight }}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isSectionActive(item.sectionId, pathname, hash);

            return (
              <li key={item.sectionId}>
                <a
                  href={`#${item.sectionId}`}
                  onClick={(event) => handleSectionClick(event, item.sectionId)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-3 text-[15px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground hover:text-primary",
                  )}
                >
                  <Icon className="text-lg text-muted" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-4 border-t border-border px-6 py-6">
          <Link
            to={UN_AUTH_ROUTES.LOGIN}
            onClick={onClose}
            className="text-center text-[15px] font-medium text-foreground transition-colors hover:text-primary"
          >
            Sign In
          </Link>
          <Link
            to={UN_AUTH_ROUTES.REGISTER}
            onClick={onClose}
            className="block rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default React.memo(MobileMenu);
