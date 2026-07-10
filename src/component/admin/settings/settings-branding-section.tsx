import { UploadOutlined } from '@ant-design/icons';
import { Button, ColorPicker, type ColorPickerProps } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  BRAND_COLOR_PRESETS,
  BRANDING_HINTS,
  DEFAULT_PLATFORM_LOGO,
  type PlatformSettings,
} from '../../../data/admin-settings';
import { isSameHexColor, normalizeHexColor } from '../../../lib/helper';
import { toast } from '../../../lib/toast';
import SettingsField from './settings-field';
import SettingsSection from './settings-section';

type SettingsBrandingSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsBrandingSection({ settings, onChange }: SettingsBrandingSectionProps) {
  const [pickerColor, setPickerColor] = useState(settings.brandColor);

  useEffect(() => {
    setPickerColor(settings.brandColor);
  }, [settings.brandColor]);

  const handlePickerChange: NonNullable<ColorPickerProps['onChange']> = (color) => {
    setPickerColor(normalizeHexColor(color.toHexString()));
  };

  const handlePickerChangeComplete: NonNullable<ColorPickerProps['onChangeComplete']> = (color) => {
    const normalized = normalizeHexColor(color.toHexString());
    setPickerColor(normalized);

    if (!isSameHexColor(normalized, settings.brandColor)) {
      onChange('brandColor', normalized);
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
              <img src={DEFAULT_PLATFORM_LOGO} alt="" className="h-10 w-10 object-contain" />
            </div>
            <Button onClick={() => toast.info('Logo upload coming soon')} className="font-medium!">
              Change
            </Button>
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
          <Button
            icon={<UploadOutlined />}
            onClick={() => toast.info('Favicon upload coming soon')}
            className="ml-2 font-medium!"
          >
            Upload New
          </Button>
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsBrandingSection);
