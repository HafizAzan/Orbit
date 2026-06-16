import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { pluralize } from "../../../lib/helper";
import { ConfirmModal } from "../../ui/modal";

type BulkDeleteTasksButtonProps = {
  selectedCount: number;
  onDelete: () => void | Promise<void>;
};

function BulkDeleteTasksButton({ selectedCount, onDelete }: BulkDeleteTasksButtonProps) {
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
        icon={<DeleteOutlined />}
        className="font-semibold!"
        onClick={() => setOpen(true)}
      >
        Bulk Delete ({selectedCount})
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Delete selected tasks"
        description={`Are you sure you want to delete ${selectedCount} selected ${pluralize(selectedCount, "task")}? This action cannot be undone.`}
        confirmText="Delete Tasks"
        confirmDanger
        confirmLoading={loading}
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(BulkDeleteTasksButton);
