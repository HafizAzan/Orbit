import React from "react";
import { RESOURCES } from "../lib/resources";

function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={RESOURCES.SVG.LOGO} alt="FlowSync" className="h-7 w-auto nav:h-10" />
    </div>
  );
}

export default React.memo(Logo);
