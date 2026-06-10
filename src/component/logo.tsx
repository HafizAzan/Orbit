import React from "react";
import { RESOURCES } from "../lib/resources";
import { cn } from "../lib/utils";

type LogoProps = {
  className?: string;
  animated?: boolean;
};

function Logo({ className, animated = false }: LogoProps) {
  return (
    <div
      className={cn(
        "inline-flex transition-transform duration-300 ease-out hover:scale-105 active:scale-95",
        animated && "animate-scale-in",
        className,
      )}
    >
      <img
        src={RESOURCES.SVG.LOGO}
        alt="FlowSync"
        className="h-7 w-auto transition-opacity duration-300 nav:h-10"
      />
    </div>
  );
}

export default React.memo(Logo);
