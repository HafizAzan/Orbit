import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { ConfirmModal } from "../../ui/modal";
import { Text } from "../../ui/typography";

type DeleteProjectButtonProps = {
  projectName: string;
  onDelete: () => void | Promise<void>;
  size?: "large" | "middle" | "small";
  className?: string;
};

function DeleteProjectButton({ projectName, onDelete, size = "large", className }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await onDelete();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        danger
        size={size}
        icon={<DeleteOutlined />}
        className={className}
        onClick={() => setOpen(true)}
      >
        Delete Project
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Delete project"
        description={
          <>
            Are you sure you want to delete <Text as="span" weight="semibold">{projectName}</Text>? All
            tasks, files, and activity linked to this project will be permanently removed.
          </>
        }
        confirmText="Delete Project"
        confirmDanger
        confirmLoading={loading}
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(DeleteProjectButton);
