import { CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import type { ProjectThemeDefinition, ProjectThemeId } from "../../../data/project-themes";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectThemePickerProps = {
  themes: ProjectThemeDefinition[];
  selectedThemeId: ProjectThemeId;
  saving?: boolean;
  onSelect: (themeId: ProjectThemeId) => void;
};

function ProjectThemePicker({ themes, selectedThemeId, saving = false, onSelect }: ProjectThemePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {themes.map((theme) => {
        const isSelected = theme.id === selectedThemeId;

        return (
          <button
            key={theme.id}
            type="button"
            disabled={saving}
            onClick={() => onSelect(theme.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md",
              isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30",
            )}
          >
            <div
              className="h-20 rounded-xl shadow-inner"
              style={{ background: theme.previewGradient }}
              aria-hidden
            />

            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <Text as="p" size="sm" weight="semibold">
                  {theme.label}
                </Text>
                <Paragraph size="xs" color="muted" className="mt-1">
                  {theme.description}
                </Paragraph>
              </div>

              {isSelected ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <CheckOutlined className="text-xs" />
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", theme.pillBg)}>Status</span>
              <span className={cn("rounded-lg px-2.5 py-1 text-[11px] font-semibold", theme.accentSoft, theme.accentText)}>
                Accent
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

type ProjectThemeSectionProps = {
  themes: ProjectThemeDefinition[];
  selectedThemeId: ProjectThemeId;
  saving?: boolean;
  onSave: (themeId: ProjectThemeId) => void;
};

export function ProjectThemeSection({
  themes,
  selectedThemeId,
  saving = false,
  onSave,
}: ProjectThemeSectionProps) {
  const [draftThemeId, setDraftThemeId] = React.useState(selectedThemeId);
  const hasChanges = draftThemeId !== selectedThemeId;

  React.useEffect(() => {
    setDraftThemeId(selectedThemeId);
  }, [selectedThemeId]);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={4}>Your project theme</Title>
      <Paragraph size="sm" color="muted" className="mt-1 max-w-2xl">
        Pick how this project looks for you. Other team members can choose their own theme — your choice only affects your view.
      </Paragraph>

      <div className="mt-6">
        <ProjectThemePicker
          themes={themes}
          selectedThemeId={draftThemeId}
          saving={saving}
          onSelect={setDraftThemeId}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="primary"
          size="large"
          disabled={!hasChanges || saving}
          loading={saving}
          onClick={() => onSave(draftThemeId)}
          className="rounded-xl! font-semibold!"
        >
          Save my theme
        </Button>
      </div>
    </article>
  );
}

export default React.memo(ProjectThemePicker);
