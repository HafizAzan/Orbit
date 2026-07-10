import React from "react";
import { useAppUiTheme } from "../context/app-ui-theme-context";
import { getOrbitLogoPalette } from "../data/orbit-logo-themes";
import { cn } from "../lib/utils";
import OrbitMark from "./orbit-mark";

type LogoProps = {
  className?: string;
  animated?: boolean;
  /** Show wordmark next to the mark. Default true. */
  withWordmark?: boolean;
};

function Logo({ className, animated = false, withWordmark = true }: LogoProps) {
  const { themeId } = useAppUiTheme();
  const palette = getOrbitLogoPalette(themeId);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 transition-transform duration-300 ease-out hover:scale-105 active:scale-95",
        animated && "animate-scale-in",
        className,
      )}
    >
      <OrbitMark
        palette={palette}
        className="h-7 w-7 shrink-0 transition-[filter] duration-300 nav:h-10 nav:w-10"
        title="Orbit"
      />
      {withWordmark ? (
        <span
          className="font-brand text-[1.15rem] font-semibold tracking-[-0.03em] transition-colors duration-300 nav:text-[1.45rem]"
          style={{ color: palette.wordmark }}
        >
          Orbit
        </span>
      ) : null}
    </div>
  );
}

export default React.memo(Logo);
