import { Button, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { TASK_LABEL_OPTIONS } from "../../../../data/workspace-task-form";
import Modal from "../../../ui/modal";
import { Paragraph, Title } from "../../../ui/typography";

type TaskLabelsModalProps = {
  open: boolean;
  selectedLabels: string[];
  onClose: () => void;
  onSave: (labels: string[]) => void;
};

function TaskLabelsModal({ open, selectedLabels, onClose, onSave }: TaskLabelsModalProps) {
  const [draftLabels, setDraftLabels] = useState<string[]>(selectedLabels);

  useEffect(() => {
    if (!open) return;
    setDraftLabels(selectedLabels);
  }, [open, selectedLabels]);

  const toggleLabel = (label: string, checked: boolean) => {
    setDraftLabels((current) => {
      if (checked) {
        return current.includes(label) ? current : [...current, label];
      }

      return current.filter((item) => item !== label);
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="px-6 pt-6 pb-5">
        <Title level={4} className="mb-0! text-foreground">
          Select labels
        </Title>
        <Paragraph size="sm" className="mt-1 mb-0! text-muted">
          Choose one or more labels to classify this task.
        </Paragraph>

        <div className="mt-5 space-y-2">
          {TASK_LABEL_OPTIONS.map((label) => (
            <label
              key={label}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:border-primary/30"
            >
              <Checkbox
                checked={draftLabels.includes(label)}
                onChange={(event) => toggleLabel(label, event.target.checked)}
              />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button size="large" onClick={onClose} className="font-medium!">
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          className="font-semibold!"
          onClick={() => {
            onSave(draftLabels);
            onClose();
          }}
        >
          Apply labels
        </Button>
      </div>
    </Modal>
  );
}

export default React.memo(TaskLabelsModal);
