import { Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ContactLeadRecord, ContactLeadStatus } from "../data/admin-leads";
import { LEAD_SUBJECT_LABELS } from "../data/admin-leads";
import { Text } from "../component/ui/typography";

type CreateLeadTableColumnsOptions = {
  onView: (record: ContactLeadRecord) => void;
  onStatusChange: (record: ContactLeadRecord, status: ContactLeadStatus) => void;
  updatingId: string | null;
};

function createLeadTableColumns({
  onView,
  onStatusChange,
  updatingId,
}: CreateLeadTableColumnsOptions): ColumnsType<ContactLeadRecord> {
  return [
    {
      title: "Contact",
      key: "contact",
      render: (_value, record) => (
        <div className="min-w-0">
          <Text as="p" weight="semibold" className="mb-0! truncate">
            {record.fullName}
          </Text>
          <Text as="p" size="xs" color="muted" className="mb-0! truncate">
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (value: string | null) => value || "—",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject: ContactLeadRecord["subject"]) => LEAD_SUBJECT_LABELS[subject] ?? subject,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status: ContactLeadStatus, record) => (
        <Select
          size="small"
          value={status}
          disabled={updatingId === record.id}
          options={[
            { value: "new", label: "New" },
            { value: "reviewed", label: "Reviewed" },
            { value: "closed", label: "Closed" },
          ]}
          onChange={(next) => onStatusChange(record, next)}
          className="w-full!"
        />
      ),
    },
    {
      title: "Received",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_value, record) => (
        <Button type="link" size="small" onClick={() => onView(record)} className="px-0!">
          View
        </Button>
      ),
    },
  ];
}

export default createLeadTableColumns;
