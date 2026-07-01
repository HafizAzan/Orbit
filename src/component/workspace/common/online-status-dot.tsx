import { cn } from "../../../lib/utils";

type OnlineStatusDotProps = {
  online: boolean;
  className?: string;
  title?: string;
};

function OnlineStatusDot({ online, className, title }: OnlineStatusDotProps) {
  return (
    <span
      title={title ?? (online ? "Online" : "Offline")}
      aria-label={online ? "Online" : "Offline"}
      className={cn(
        "inline-block h-2.5 w-2.5 shrink-0 rounded-full border-2 border-card",
        online ? "bg-emerald-500" : "bg-muted",
        className,
      )}
    />
  );
}

export default OnlineStatusDot;
