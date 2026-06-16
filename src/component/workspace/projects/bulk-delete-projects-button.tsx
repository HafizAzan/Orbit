import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { pluralize } from "../../../lib/helper";
import { ConfirmModal } from "../../ui/modal";

type BulkDeleteProjectsButtonProps = {
  selectedCount: number;
  onDelete: () => void | Promise<void>;
};

function BulkDeleteProjectsButton({ selectedCount, onDelete }: BulkDeleteProjectsButtonProps) {
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
        size="large"
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
        title="Delete selected projects"
        description={`Are you sure you want to delete ${selectedCount} selected ${pluralize(selectedCount, "project")}? All linked tasks, files, and activity will be permanently removed.`}
        confirmText="Delete Projects"
        confirmDanger
        confirmLoading={loading}
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(BulkDeleteProjectsButton);
