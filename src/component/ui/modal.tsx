import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal as AntModal, type ModalProps as AntModalProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "./typography";

const defaultModalClassNames: NonNullable<AntModalProps["classNames"]> = {
  container: "rounded-2xl! overflow-hidden! shadow-xl!",
  header: "mb-0! border-b border-border px-6! py-4!",
  body: "px-6! py-5!",
  footer: "mt-0! border-t border-border px-6! py-4!",
};

type ModalProps = AntModalProps;

function Modal({ centered = true, classNames, ...props }: ModalProps) {
  return (
    <AntModal
      centered={centered}
      classNames={{
        ...defaultModalClassNames,
        ...classNames,
      }}
      {...props}
    />
  );
}

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmDanger?: boolean;
  confirmLoading?: boolean;
  icon?: ReactNode;
  className?: string;
};

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmDanger = false,
  confirmLoading = false,
  icon,
  className,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable
      maskClosable={!confirmDanger}
      width={420}
      className={cn(className)}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="px-6 pt-7 pb-5 text-center">
        <span
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl",
            confirmDanger ? "bg-red-50 text-red-500" : "bg-feature-sync text-primary",
          )}
        >
          <span className="text-2xl leading-none [&_.anticon]:text-2xl!">{icon ?? <ExclamationCircleOutlined />}</span>
        </span>

        <div className="mt-5">
          {typeof title === "string" ? (
            <Title level={4} className="mb-0! text-foreground">
              {title}
            </Title>
          ) : (
            title
          )}
        </div>

        {description ? (
          <div className="mt-2">
            {typeof description === "string" ? (
              <Paragraph size="sm" color="muted" className="mx-auto mb-0! max-w-sm leading-relaxed">
                {description}
              </Paragraph>
            ) : (
              description
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse items-center justify-center gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-center">
        <Button size="large" onClick={onClose} disabled={confirmLoading} className="h-11! w-full rounded-xl! font-medium! sm:w-auto sm:min-w-30">
          {cancelText}
        </Button>
        <Button
          type="primary"
          size="large"
          danger={confirmDanger}
          loading={confirmLoading}
          onClick={onConfirm}
          className="h-11! w-full rounded-xl! font-semibold! sm:w-auto sm:min-w-30"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;
export { ConfirmModal };
export type { ConfirmModalProps, ModalProps };
