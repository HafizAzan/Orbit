import { Button } from "antd";
import React from "react";
import { pluralize } from "../../../lib/helper";
import { Paragraph, Text } from "../../ui/typography";

type SettingsSaveBarProps = {
  changeCount: number;
  onDiscard: () => void;
  onSave: () => void;
  saving?: boolean;
};

function SettingsSaveBar({ changeCount, onDiscard, onSave, saving = false }: SettingsSaveBarProps) {
  if (changeCount === 0) return null;

  return (
    <div className="sticky bottom-0 z-10 -mx-1 mt-6 border-t border-border bg-card/95 px-1 py-4 backdrop-blur-sm sm:-mx-2 sm:px-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Paragraph size="sm" className="mb-0!">
          You have <Text weight="semibold">{changeCount}</Text> unsaved{" "}
          {pluralize(changeCount, "change")}
        </Paragraph>

        <div className="flex flex-wrap gap-2">
          <Button size="large" onClick={onDiscard} disabled={saving} className="font-medium!">
            Discard
          </Button>
          <Button type="primary" size="large" onClick={onSave} loading={saving} className="font-semibold!">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SettingsSaveBar);
