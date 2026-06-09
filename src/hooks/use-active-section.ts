import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function getSectionTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function resolveActiveSection(sectionIds: string[], headerOffset: number) {
  const scrollPosition = window.scrollY + headerOffset + 80;
  const viewportBottom = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  const existingSectionIds = sectionIds.filter((sectionId) => document.getElementById(sectionId));

  if (!existingSectionIds.length) {
    return sectionIds[0] ?? "";
  }

  if (viewportBottom >= documentHeight - 50) {
    return existingSectionIds[existingSectionIds.length - 1];
  }

  let activeSection = existingSectionIds[0];

  for (const sectionId of existingSectionIds) {
    const element = document.getElementById(sectionId);
    if (!element) continue;

    if (getSectionTop(element) <= scrollPosition) {
      activeSection = sectionId;
    }
  }

  return activeSection;
}

function useActiveSection(sectionIds: readonly string[], headerOffset: number, homePath = "/") {
  const { pathname, hash } = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    const hashSection = hash.replace("#", "");
    if (hashSection && sectionIds.includes(hashSection)) {
      return hashSection;
    }

    return pathname === homePath ? (sectionIds[0] ?? "") : "";
  });

  useEffect(() => {
    if (pathname !== homePath) {
      setActiveSection("");
      return;
    }

    const hashSection = hash.replace("#", "");
    if (hashSection && sectionIds.includes(hashSection)) {
      setActiveSection(hashSection);
    }

    const updateActiveSection = () => {
      const nextSection = resolveActiveSection([...sectionIds], headerOffset);
      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    updateActiveSection();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [hash, headerOffset, homePath, pathname, sectionIds]);

  return activeSection;
}

export default useActiveSection;
