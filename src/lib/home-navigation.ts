import type { NavigateFunction } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../router/public-routes";
import { scrollToSection } from "./utils";

type NavigateToHomeSectionOptions = {
  pathname: string;
  navigate: NavigateFunction;
  headerOffset?: number;
  homePath?: string;
};

export function getHomeSectionHref(sectionId: string, homePath = UN_AUTH_ROUTES.HOME) {
  return `${homePath}#${sectionId}`;
}

export function navigateToHomeSection(
  sectionId: string,
  { pathname, navigate, headerOffset = 0, homePath = UN_AUTH_ROUTES.HOME }: NavigateToHomeSectionOptions,
) {
  if (pathname === homePath) {
    scrollToSection(sectionId, headerOffset);
    return;
  }

  navigate(getHomeSectionHref(sectionId, homePath));
}
