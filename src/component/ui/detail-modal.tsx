import { Button } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "./typography";
import Modal from "./modal";

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  width?: number;
  className?: string;
};

function DetailModal({ open, onClose, title, subtitle, icon, children, width = 520, className }: DetailModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable
      maskClosable
      width={width}
      className={className}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="border-b border-border bg-feature-sync/30 px-6 py-5">
        <div className="flex items-start gap-3">
          {icon ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_.anticon]:text-lg!">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <Title level={4} className="mb-0! text-foreground">
              {title}
            </Title>
            {subtitle ? (
              <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                {subtitle}
              </Paragraph>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn("max-h-[min(70vh,32rem)] overflow-y-auto px-6 py-5")}>{children}</div>

      <div className="flex justify-center border-t border-border bg-background/60 px-6 py-4">
        <Button size="large" onClick={onClose} className="h-11! min-w-30 rounded-xl! font-medium!">
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default DetailModal;
