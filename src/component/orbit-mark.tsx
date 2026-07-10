import React, { useId } from "react";
import type { OrbitLogoPalette } from "../data/orbit-logo-themes";

type OrbitMarkProps = {
  palette: OrbitLogoPalette;
  className?: string;
  title?: string;
};

/** Unique Orbit brand mark — dual tilted orbits, core planet, and a satellite. */
function OrbitMark({ palette, className, title = "Orbit" }: OrbitMarkProps) {
  const reactId = useId().replace(/:/g, "");
  const glowId = `orbit-mark-glow-${reactId}`;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {palette.glow ? (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>

      <rect width="40" height="40" rx="12" fill={palette.markBg} />

      <g filter={palette.glow ? `url(#${glowId})` : undefined}>
        {/* Outer orbit */}
        <ellipse
          cx="20"
          cy="20"
          rx="12.5"
          ry="7.2"
          stroke={palette.ring}
          strokeWidth="1.6"
          transform="rotate(-28 20 20)"
          opacity="0.95"
        />
        {/* Inner orbit */}
        <ellipse
          cx="20"
          cy="20"
          rx="12.5"
          ry="7.2"
          stroke={palette.markFg}
          strokeWidth="1.35"
          transform="rotate(38 20 20)"
          opacity="0.85"
        />
        {/* Core planet */}
        <circle cx="20" cy="20" r="4.2" fill={palette.markFg} />
        <circle cx="18.6" cy="18.8" r="1.15" fill={palette.markBg} opacity="0.35" />
        {/* Satellite */}
        <circle cx="30.2" cy="14.4" r="2.15" fill={palette.satellite} />
        <circle cx="30.2" cy="14.4" r="0.85" fill={palette.markFg} opacity="0.9" />
      </g>
    </svg>
  );
}

export default React.memo(OrbitMark);
