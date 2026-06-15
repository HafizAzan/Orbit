import React from "react";
import { cn } from "../../../lib/utils";
import HeaderAuthActions from "./header-auth-actions";

function HeaderActions({
  className,
  onNavigate,
  stacked = false,
}: {
  className?: string;
  onNavigate?: () => void;
  stacked?: boolean;
}) {
  return <HeaderAuthActions className={cn(className)} onNavigate={onNavigate} stacked={stacked} />;
}

export default React.memo(HeaderActions);
