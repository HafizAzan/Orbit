import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

type TaskFormFooterProps = {
  isEdit: boolean;
  saving: boolean;
  cancelPath: string;
  onDiscard: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
};

function TaskFormFooter({ isEdit, saving, cancelPath, onDiscard, onSave, onSaveAndContinue }: TaskFormFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 mt-8 border-t border-border bg-card/95 px-1 py-4 backdrop-blur-sm sm:-mx-2 sm:px-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={onDiscard}
          disabled={saving}
          className="w-fit font-medium! text-muted!"
        >
          Discard
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Link to={cancelPath}>
            <Button size="large" disabled={saving} className="w-full font-semibold! sm:w-auto">
              Cancel
            </Button>
          </Link>
          {!isEdit ? (
            <Button
              size="large"
              disabled={saving}
              onClick={onSaveAndContinue}
              className="w-full font-semibold! sm:w-auto"
            >
              Create & Continue
            </Button>
          ) : null}
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={onSave}
            className="w-full font-semibold! sm:w-auto"
          >
            {isEdit ? "Save Task" : "Save Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TaskFormFooter);
