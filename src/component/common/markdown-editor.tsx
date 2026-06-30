import {
  BoldOutlined,
  CodeOutlined,
  EyeOutlined,
  ItalicOutlined,
  LinkOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import React, { useCallback, useRef, useState } from "react";
import MarkdownContent, { MARKDOWN_CONTENT_CLASS } from "./markdown-content";
import { applyMarkdownFormat, type MarkdownFormatAction } from "../../lib/markdown-format";
import { cn } from "../../lib/utils";
import { Paragraph } from "../ui/typography";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
};

const TOOLBAR_ITEMS: { action: MarkdownFormatAction; icon: typeof BoldOutlined; label: string; shortcut?: string }[] = [
  { action: "bold", icon: BoldOutlined, label: "Bold", shortcut: "Ctrl+B" },
  { action: "italic", icon: ItalicOutlined, label: "Italic", shortcut: "Ctrl+I" },
  { action: "bullet", icon: UnorderedListOutlined, label: "Bullet list" },
  { action: "link", icon: LinkOutlined, label: "Link" },
  { action: "code", icon: CodeOutlined, label: "Inline code" },
];

function MarkdownEditor({
  value,
  onChange,
  placeholder = "Add a detailed description...",
  rows = 8,
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const applyFormat = useCallback(
    (action: MarkdownFormatAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const result = applyMarkdownFormat(value, start, end, action);

      onChange(result.value);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    },
    [onChange, value],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;

    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      applyFormat("bold");
    }

    if (key === "i") {
      event.preventDefault();
      applyFormat("italic");
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-1 rounded-xl border border-border bg-background/60 p-2">
        {TOOLBAR_ITEMS.map(({ action, icon: Icon, label, shortcut }) => (
          <button
            key={action}
            type="button"
            title={shortcut ? `${label} (${shortcut})` : label}
            onClick={() => applyFormat(action)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-foreground"
            aria-label={label}
          >
            <Icon />
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          onClick={() => setShowPreview((current) => !current)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors",
            showPreview ? "bg-feature-sync text-primary" : "text-muted hover:bg-card hover:text-foreground",
          )}
          aria-label="Toggle preview"
          aria-pressed={showPreview}
        >
          <EyeOutlined />
          Preview
        </button>
      </div>

      {showPreview ? (
        <MarkdownContent
          content={value}
          className={cn("min-h-[200px] rounded-xl border border-border bg-background px-4 py-3 text-foreground", MARKDOWN_CONTENT_CLASS)}
          emptyFallback={<Paragraph size="sm" className="min-h-[200px] rounded-xl border border-border bg-background px-4 py-3">{placeholder}</Paragraph>}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary/40"
        />
      )}
    </div>
  );
}

export default React.memo(MarkdownEditor);
