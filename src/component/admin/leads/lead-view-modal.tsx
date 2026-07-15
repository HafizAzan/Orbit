import { Modal } from "antd";
import React from "react";
import type { ContactLeadRecord } from "../../../data/admin-leads";
import { LEAD_SUBJECT_LABELS } from "../../../data/admin-leads";
import { Paragraph, Text } from "../../ui/typography";

type LeadViewModalProps = {
  lead: ContactLeadRecord | null;
  onClose: () => void;
};

function LeadViewModal({ lead, onClose }: LeadViewModalProps) {
  return (
    <Modal
      open={lead !== null}
      onCancel={onClose}
      footer={null}
      title={lead?.fullName ?? "Lead"}
      centered
      width={560}
      classNames={{
        container: "rounded-2xl! overflow-hidden!",
        header: "mb-0! border-b border-border px-6! py-4!",
        body: "px-6! py-5!",
      }}
    >
      {lead ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Text as="p" size="xs" color="muted" className="mb-1!">
                Email
              </Text>
              <Text as="p" weight="medium" className="mb-0! break-all">
                {lead.email}
              </Text>
            </div>
            <div>
              <Text as="p" size="xs" color="muted" className="mb-1!">
                Company
              </Text>
              <Text as="p" weight="medium" className="mb-0!">
                {lead.companyName || "—"}
              </Text>
            </div>
            <div>
              <Text as="p" size="xs" color="muted" className="mb-1!">
                Subject
              </Text>
              <Text as="p" weight="medium" className="mb-0!">
                {LEAD_SUBJECT_LABELS[lead.subject]}
              </Text>
            </div>
            <div>
              <Text as="p" size="xs" color="muted" className="mb-1!">
                Source
              </Text>
              <Text as="p" weight="medium" className="mb-0!">
                {lead.source}
              </Text>
            </div>
          </div>
          <div>
            <Text as="p" size="xs" color="muted" className="mb-1!">
              Message
            </Text>
            <Paragraph size="sm" className="mb-0! whitespace-pre-wrap">
              {lead.message}
            </Paragraph>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

export default React.memo(LeadViewModal);
