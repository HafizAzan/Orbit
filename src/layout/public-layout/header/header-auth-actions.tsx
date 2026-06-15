import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../context/app-context";
import { getAuthenticatedHeaderAction } from "../../../lib/auth-routing";
import { cn } from "../../../lib/utils";
import { UN_AUTH_ROUTES } from "../../../router/public-routes";

type HeaderAuthActionsProps = {
  className?: string;
  onNavigate?: () => void;
  stacked?: boolean;
};

function HeaderAuthActions({ className, onNavigate, stacked = false }: HeaderAuthActionsProps) {
  const app = useAppContext();

  if (app?.isBootstrapping) {
    return <div className={cn("h-10 w-28 rounded-lg bg-muted/20", className)} aria-hidden />;
  }

  if (app?.isAuthenticated && app.user) {
    const action = getAuthenticatedHeaderAction(app.user);

    return (
      <div className={cn("flex items-center gap-6", className)}>
        <Link
          to={action.path}
          onClick={onNavigate}
          className={cn(
            "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90",
            stacked && "block w-full text-center",
          )}
        >
          {action.label}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <Link
        to={UN_AUTH_ROUTES.LOGIN}
        onClick={onNavigate}
        className={cn("text-[15px] font-medium text-foreground transition-colors hover:text-primary", stacked && "text-center")}
      >
        Sign In
      </Link>

      <Link
        to={UN_AUTH_ROUTES.REGISTER}
        onClick={onNavigate}
        className={cn(
          "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90",
          stacked && "block w-full text-center",
        )}
      >
        Get Started
      </Link>
    </div>
  );
}

export default React.memo(HeaderAuthActions);
