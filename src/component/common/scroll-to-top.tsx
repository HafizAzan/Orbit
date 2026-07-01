import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollAllContainersToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("main").forEach((element) => {
    element.scrollTop = 0;
  });
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollAllContainersToTop();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
