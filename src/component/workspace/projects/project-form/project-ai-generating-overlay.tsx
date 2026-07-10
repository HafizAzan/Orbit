import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";
import { Paragraph, Text } from "../../../ui/typography";

type ProjectAiGeneratingOverlayProps = {
  open: boolean;
};

function ProjectAiGeneratingOverlay({ open }: ProjectAiGeneratingOverlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[1px]">
      <div className="mx-4 max-w-md rounded-2xl border border-border bg-card px-8 py-7 text-center shadow-xl">
        <Spin indicator={<LoadingOutlined className="text-3xl text-primary" spin />} />
        <Text as="p" weight="semibold" className="mt-4 mb-1! text-lg">
          AI is generating content
        </Text>
        <Paragraph size="sm" color="muted" className="mb-0!">
          Filling the form fields on this page. Attachments are left for you.
        </Paragraph>
      </div>
    </div>
  );
}

export default React.memo(ProjectAiGeneratingOverlay);
