import React from "react";
import { cn } from "../../../lib/utils";
import { Link } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../../../router/constant";

function HeaderActions({ className, onNavigate, stacked = false }: { className?: string; onNavigate?: () => void; stacked?: boolean }) {
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

export default React.memo(HeaderActions);
