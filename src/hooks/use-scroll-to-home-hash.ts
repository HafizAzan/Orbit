import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../router/public-routes";
import { scrollToSection } from "../lib/utils";

function useScrollToHomeHash(headerOffset: number, homePath = UN_AUTH_ROUTES.HOME) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== homePath) return;

    const sectionId = hash.replace("#", "");
    if (!sectionId) return;

    let attempts = 0;
    let timeoutId: number | undefined;

    const tryScroll = () => {
      const scrolled = scrollToSection(sectionId, headerOffset);

      if (!scrolled && attempts < 24) {
        attempts += 1;
        timeoutId = window.setTimeout(tryScroll, 50);
      }
    };

    tryScroll();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [pathname, hash, headerOffset, homePath]);
}

export default useScrollToHomeHash;
