import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../component/logo";
import FOOTER_LINKS, { SOCIAL_LINKS } from "../../../data/footer-links";
import { UN_AUTH_ROUTES } from "../../../router/constant";

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 nav:grid nav:grid-cols-[1fr_auto_1fr] nav:items-center nav:gap-6 nav:py-10 lg:px-10">
        <div className="flex flex-col gap-3 nav:justify-self-start">
          <Link to={UN_AUTH_ROUTES.HOME}>
            <Logo />
          </Link>
          <p className="font-roboto text-sm text-muted">© {new Date().getFullYear()} FlowSync Inc. All rights reserved.</p>
        </div>

        <nav className="nav:justify-self-center">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-sm font-medium text-muted transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5 nav:justify-self-end">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-lg text-foreground transition-colors hover:text-primary"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
