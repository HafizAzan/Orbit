import React from "react";
import { renderMarkdownPreview } from "../../lib/markdown-format";
import { cn } from "../../lib/utils";

export const MARKDOWN_CONTENT_CLASS =
  "text-sm leading-relaxed text-muted [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-foreground [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_p:last-child]:mb-0 [&_p]:mb-1.5 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-1 [&_ul]:space-y-0.5";

type MarkdownContentProps = {
  content: string;
  className?: string;
  lineClamp?: 2 | 3 | 4 | 5;
  emptyFallback?: React.ReactNode;
  /** Set false when nested inside a clickable card so links don't steal clicks */
  interactive?: boolean;
};

function MarkdownContent({
  content,
  className,
  lineClamp,
  emptyFallback,
  interactive = true,
}: MarkdownContentProps) {
  const html = renderMarkdownPreview(content);

  if (!html) {
    return emptyFallback ? <>{emptyFallback}</> : null;
  }

  return (
    <div
      className={cn(
        MARKDOWN_CONTENT_CLASS,
        lineClamp === 2 && "line-clamp-2",
        lineClamp === 3 && "line-clamp-3",
        lineClamp === 4 && "line-clamp-4",
        lineClamp === 5 && "line-clamp-5",
        !interactive && "pointer-events-none",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default React.memo(MarkdownContent);
