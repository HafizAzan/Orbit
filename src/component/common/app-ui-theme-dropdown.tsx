import { BgColorsOutlined, CheckOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import React from "react";
import { useAppUiTheme } from "../../context/app-ui-theme-context";
import { APP_UI_THEMES, isDarkAppUiTheme, type AppUiThemeId } from "../../data/app-ui-themes";
import { getOrbitLogoPalette } from "../../data/orbit-logo-themes";
import { cn } from "../../lib/utils";
import OrbitMark from "../orbit-mark";
import { Paragraph, Text, Title } from "../ui/typography";

function AppUiThemeDropdown() {
  const { themeId, isSaving, setTheme } = useAppUiTheme();
  const [open, setOpen] = React.useState(false);

  const handleSelect = async (nextThemeId: AppUiThemeId) => {
    if (nextThemeId === themeId || isSaving) return;
    await setTheme(nextThemeId);
  };

  const content = (
    <div className="w-[min(100vw-2rem,24rem)] p-1">
      <Title level={5} className="px-2 pt-1">
        Orbit appearance
      </Title>
      <Paragraph size="sm" color="muted" className="px-2 pb-3">
        Three light themes and three dark themes. Logo and accents update with each theme.
      </Paragraph>

      <div className="grid grid-cols-2 gap-2">
        {APP_UI_THEMES.map((theme) => {
          const isSelected = theme.id === themeId;
          const isDark = isDarkAppUiTheme(theme.id);
          const logoPalette = getOrbitLogoPalette(theme.id);

          return (
            <button
              key={theme.id}
              type="button"
              disabled={isSaving}
              onClick={() => void handleSelect(theme.id)}
              className={cn(
                "relative rounded-xl border p-3 text-left transition-all",
                isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <div className={cn("mb-2 overflow-hidden rounded-lg border border-border", isDark ? "bg-[#0b1120]" : "bg-background")}>
                <div className="h-1.5" style={{ background: theme.previewGradient }} />
                <div className="flex items-center gap-1.5 p-1.5">
                  <OrbitMark palette={logoPalette} className="h-5 w-5 shrink-0" title="" />
                  <div className={cn("h-3 flex-1 rounded", isDark ? "bg-[#151c2f]" : "bg-white")} />
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.antdPrimary }} />
                </div>
              </div>
              <Text as="p" size="sm" weight="semibold">
                {theme.label}
              </Text>
              <Text as="p" className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                {theme.description}
              </Text>
              {isSelected ? <CheckOutlined className="absolute top-2 right-2 text-primary" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen} trigger="click" placement="bottomRight" content={content}>
      <Button
        type="text"
        aria-label="Change Orbit theme"
        icon={<BgColorsOutlined className="text-lg!" />}
        className="flex! h-10! w-10! items-center! justify-center!"
      />
    </Popover>
  );
}

export default React.memo(AppUiThemeDropdown);
