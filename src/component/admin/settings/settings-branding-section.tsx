import { UploadOutlined } from "@ant-design/icons";
import { Button, ColorPicker, Upload, type ColorPickerProps, type UploadProps } from "antd";
import React, { useEffect, useState } from "react";
import {
  BRAND_COLOR_PRESETS,
  BRANDING_HINTS,
  DEFAULT_PLATFORM_LOGO,
  type PlatformSettings,
} from "../../../data/admin-settings";
import { uploadPlatformFavicon, uploadPlatformLogo } from "../../../api-services/admin-settings.service";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { isSameHexColor, normalizeHexColor } from "../../../lib/helper";
import { resolveTaskAttachmentUrl } from "../../../lib/task-attachments";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";

type SettingsBrandingSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsBrandingSection({ settings, onChange }: SettingsBrandingSectionProps) {
  const [pickerColor, setPickerColor] = useState(settings.brandColor);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    setPickerColor(settings.brandColor);
  }, [settings.brandColor]);

  const handlePickerChange: NonNullable<ColorPickerProps["onChange"]> = (color) => {
    setPickerColor(normalizeHexColor(color.toHexString()));
  };

  const handlePickerChangeComplete: NonNullable<ColorPickerProps["onChangeComplete"]> = (color) => {
    const normalized = normalizeHexColor(color.toHexString());
    setPickerColor(normalized);

    if (!isSameHexColor(normalized, settings.brandColor)) {
      onChange("brandColor", normalized);
    }
  };

  const logoSrc = settings.logoUrl
    ? resolveTaskAttachmentUrl(settings.logoUrl)
    : DEFAULT_PLATFORM_LOGO;

  const handleLogoUpload: UploadProps["customRequest"] = async (options) => {
    const file = options.file as File;
    setUploadingLogo(true);
    try {
      const next = await uploadPlatformLogo(file);
      onChange("logoUrl", next.logoUrl);
      showApiSuccessToast("Logo updated.");
      options.onSuccess?.(next);
    } catch (error) {
      showApiErrorToast(error);
      options.onError?.(error as Error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload: UploadProps["customRequest"] = async (options) => {
    const file = options.file as File;
    setUploadingFavicon(true);
    try {
      const next = await uploadPlatformFavicon(file);
      onChange("faviconUrl", next.faviconUrl);
      showApiSuccessToast("Favicon updated.");
      options.onSuccess?.(next);
    } catch (error) {
      showApiErrorToast(error);
      options.onError?.(error as Error);
    } finally {
      setUploadingFavicon(false);
    }
  };

  return (
    <SettingsSection
      id="branding"
      title="Branding"
      description="Customize the look and feel of the user dashboard."
    >
      <div className="space-y-6">
        <SettingsField label="Platform Logo" hint={BRANDING_HINTS.logo}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
              <img src={logoSrc} alt="" className="h-10 w-10 object-contain" />
            </div>
            <Upload accept="image/png,image/jpeg,image/webp,image/gif" showUploadList={false} customRequest={handleLogoUpload}>
              <Button loading={uploadingLogo} className="font-medium!">
                Change
              </Button>
            </Upload>
          </div>
        </SettingsField>

        <SettingsField label="Brand Color" hint={BRANDING_HINTS.brandColor} className="">
          <ColorPicker
            size="large"
            format="hex"
            disabledAlpha
            value={pickerColor}
            presets={BRAND_COLOR_PRESETS}
            showText={(color) => <span className="font-mono uppercase">{color.toHexString()}</span>}
            onChange={handlePickerChange}
            onChangeComplete={handlePickerChangeComplete}
            className="rounded-xl! [&_.ant-color-picker-trigger]:min-h-10! [&_.ant-color-picker-trigger]:rounded-xl! [&_.ant-color-picker-trigger]:border-border! [&_.ant-color-picker-trigger]:bg-background!"
          />
        </SettingsField>

        <SettingsField label="Favicon" hint={BRANDING_HINTS.favicon}>
          <div className="flex flex-wrap items-center gap-4">
            {settings.faviconUrl ? (
              <img
                src={resolveTaskAttachmentUrl(settings.faviconUrl)}
                alt=""
                className="h-8 w-8 rounded border border-border object-contain"
              />
            ) : null}
            <Upload
              accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon,.ico"
              showUploadList={false}
              customRequest={handleFaviconUpload}
            >
              <Button icon={<UploadOutlined />} loading={uploadingFavicon} className="font-medium!">
                Upload New
              </Button>
            </Upload>
          </div>
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsBrandingSection);
