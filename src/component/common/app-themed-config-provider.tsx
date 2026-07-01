import { ConfigProvider, theme as antdTheme } from "antd";
import React, { type ReactNode } from "react";
import { useAppUiTheme } from "../../context/app-ui-theme-context";

type AppThemedConfigProviderProps = {
  children: ReactNode;
};

function AppThemedConfigProvider({ children }: AppThemedConfigProviderProps) {
  const { antdPrimary, themeId } = useAppUiTheme();
  const isDark = themeId === "midnight";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: antdPrimary,
          borderRadius: 10,
          controlHeight: 40,
          fontFamily: '"Roboto", ui-sans-serif, system-ui, sans-serif',
          ...(isDark
            ? {
                colorBgContainer: "#151c2f",
                colorBgElevated: "#1a2332",
                colorBorder: "#243044",
                colorText: "#e2e8f0",
                colorTextSecondary: "#94a3b8",
              }
            : {}),
        },
        components: isDark
          ? {
              Input: {
                colorBgContainer: "#151c2f",
                colorBorder: "#243044",
                activeBorderColor: antdPrimary,
                hoverBorderColor: "#334155",
              },
              Select: {
                colorBgContainer: "#151c2f",
                colorBorder: "#243044",
                optionSelectedBg: "rgba(99, 102, 241, 0.2)",
              },
              Button: {
                defaultBg: "#151c2f",
                defaultBorderColor: "#243044",
                defaultColor: "#e2e8f0",
              },
              Drawer: {
                colorBgElevated: "#151c2f",
              },
              Popover: {
                colorBgElevated: "#151c2f",
              },
              Dropdown: {
                colorBgElevated: "#151c2f",
              },
            }
          : undefined,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default React.memo(AppThemedConfigProvider);
