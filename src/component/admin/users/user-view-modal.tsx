import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { USER_ROLE_STYLES, USER_STATUS_STYLES, type UserRecord } from "../../../data/admin-users";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../shared/record-detail-field";

type UserViewModalProps = {
  record: UserRecord | null;
  onClose: () => void;
};

function UserViewModal({ record, onClose }: UserViewModalProps) {
  const statusStyle = record ? USER_STATUS_STYLES[record.status] : null;

  return (
    <DetailModal
      open={record !== null}
      onClose={onClose}
      title={record?.name ?? "User details"}
      subtitle={record?.email}
      icon={<UserOutlined />}
    >
      {record && statusStyle ? (
        <>
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
            <Avatar
              size={48}
              className="shrink-0 bg-primary/10! text-primary! font-semibold!"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(record.name)}`}
            />
            <div>
              <p className="font-semibold text-foreground">{record.name}</p>
              <p className="text-sm text-muted">{record.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <RecordDetailField label="Organization" value={record.organization} />
            <RecordDetailField label="Role">
              <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", USER_ROLE_STYLES[record.role])}>
                {record.role}
              </span>
            </RecordDetailField>
            <RecordDetailField label="Status">
              <span className="inline-flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", statusStyle.dot)} />
                {statusStyle.label}
              </span>
            </RecordDetailField>
            <RecordDetailField label="Last active" value={record.lastActive} />
          </div>
        </>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(UserViewModal);
