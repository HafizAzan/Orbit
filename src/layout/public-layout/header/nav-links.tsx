import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NAV_ITEMS from "../../../data/nav-items";
import { getHomeSectionHref, navigateToHomeSection } from "../../../lib/home-navigation";
import { cn, isSectionActive } from "../../../lib/utils";

type NavLinksProps = {
  className?: string;
  onNavigate?: () => void;
  headerOffset?: number;
  activeSectionId?: string;
};

function getNavLinkClass(isActive: boolean) {
  return cn(
    "inline-block border-b-2 pb-1 text-[15px] font-medium transition-colors tracking-[0.2px]",
    isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary",
  );
}

function NavLinks({ className, onNavigate, headerOffset = 0, activeSectionId }: NavLinksProps) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    navigateToHomeSection(sectionId, { pathname, navigate, headerOffset });
    onNavigate?.();
  };

  return (
    <ul className={className}>
      {NAV_ITEMS.map((item) => (
        <li key={item.sectionId}>
          <a
            href={getHomeSectionHref(item.sectionId)}
            onClick={(event) => handleClick(event, item.sectionId)}
            className={getNavLinkClass(isSectionActive(item.sectionId, pathname, hash, "/", activeSectionId))}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default React.memo(NavLinks);
