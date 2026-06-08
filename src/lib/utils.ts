import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function scrollToSection(sectionId: string, offset = 0) {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  window.history.replaceState(null, "", `#${sectionId}`);

  return true;
}

export function isSectionActive(sectionId: string, pathname: string, hash: string, homePath = "/") {
  const activeHash = hash.replace("#", "");

  if (activeHash) {
    return activeHash === sectionId;
  }

  return pathname === homePath && sectionId === "feature";
}
