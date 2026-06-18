export type MarkdownFormatAction = "bold" | "italic" | "bullet" | "link" | "code";

type FormatResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function wrapSelection(text: string, start: number, end: number, before: string, after: string, placeholder: string): FormatResult {
  const selected = text.slice(start, end) || placeholder;
  const nextValue = `${text.slice(0, start)}${before}${selected}${after}${text.slice(end)}`;
  const selectionStart = start + before.length;
  const selectionEnd = selectionStart + selected.length;

  return { value: nextValue, selectionStart, selectionEnd };
}

function applyBulletFormat(text: string, start: number, end: number): FormatResult {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const lineEndIndex = text.indexOf("\n", end);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  const block = text.slice(lineStart, lineEnd);
  const lines = block.split("\n");

  const nextLines = lines.map((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ")) return line;
    const leading = line.slice(0, line.length - trimmed.length);
    return `${leading}- ${trimmed || "List item"}`;
  });

  const nextBlock = nextLines.join("\n");
  const nextValue = `${text.slice(0, lineStart)}${nextBlock}${text.slice(lineEnd)}`;

  return {
    value: nextValue,
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}

export function applyMarkdownFormat(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  action: MarkdownFormatAction,
): FormatResult {
  switch (action) {
    case "bold":
      return wrapSelection(text, selectionStart, selectionEnd, "**", "**", "bold text");
    case "italic":
      return wrapSelection(text, selectionStart, selectionEnd, "*", "*", "italic text");
    case "code":
      return wrapSelection(text, selectionStart, selectionEnd, "`", "`", "code");
    case "link":
      return wrapSelection(text, selectionStart, selectionEnd, "[", "](https://)", "link text");
    case "bullet":
      return applyBulletFormat(text, selectionStart, selectionEnd);
    default:
      return { value: text, selectionStart, selectionEnd };
  }
}

export function renderMarkdownPreview(markdown: string): string {
  if (!markdown.trim()) return "";

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const formatInline = (line: string) => {
    let html = escapeHtml(line);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    return html;
  };

  const parts: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    parts.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };

  for (const line of markdown.split("\n")) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("- ")) {
      listItems.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    flushList();

    if (!line.trim()) {
      parts.push("<br />");
      continue;
    }

    parts.push(`<p>${formatInline(line)}</p>`);
  }

  flushList();

  return parts.join("");
}
