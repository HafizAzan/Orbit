import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../../component/logo";
import { NAV_SECTION_IDS } from "../../../data/nav-items";
import useActiveSection from "../../../hooks/use-active-section";
import { UN_AUTH_ROUTES } from "../../../router/public-routes";
import HeaderActions from "./header-actions";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";

function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const activeSectionId = useActiveSection(NAV_SECTION_IDS, headerHeight);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-header-background">
      <header ref={headerRef} className="border-b border-header-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 nav:grid nav:grid-cols-[1fr_auto_1fr] nav:px-8 nav:py-5 lg:px-10">
          <div className="justify-self-start">
            <Link to={UN_AUTH_ROUTES.HOME} className="inline-flex transition-opacity duration-300 hover:opacity-90">
              <Logo />
            </Link>
          </div>

          <nav className="hidden nav:block nav:justify-self-center">
            <NavLinks
              className="flex items-center gap-10"
              headerOffset={headerHeight}
              activeSectionId={activeSectionId}
            />
          </nav>

          <div className="flex items-center nav:justify-self-end">
            <HeaderActions className="hidden nav:flex" />

            <div className="nav:hidden">
              <Button type="text" aria-label="Open menu" aria-expanded={menuOpen} onClick={menuOpen ? closeMenu : openMenu}>
                {menuOpen ? <CloseOutlined className="text-xl text-foreground" /> : <MenuOutlined className="text-xl text-foreground" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        headerHeight={headerHeight}
        activeSectionId={activeSectionId}
        onClose={closeMenu}
      />
    </div>
  );
}

export default React.memo(Header);
