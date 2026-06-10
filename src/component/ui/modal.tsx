import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal as AntModal, type ModalProps as AntModalProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "./typography";

const defaultModalClassNames: NonNullable<AntModalProps["classNames"]> = {
  container: "rounded-2xl! overflow-hidden! shadow-lg!",
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
      onOk={onConfirm}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      okButtonProps={{
        danger: confirmDanger,
        className: "h-10! px-5! font-semibold!",
      }}
      cancelButtonProps={{
        className: "h-10! px-5! font-medium!",
      }}
      className={cn(className)}
      title={
        <div className="flex items-center gap-3">
          {icon ?? <ExclamationCircleOutlined className="text-xl text-amber-500" />}
          {typeof title === "string" ? (
            <Title level={5} className="mb-0! text-foreground">
              {title}
            </Title>
          ) : (
            title
          )}
        </div>
      }
    >
      {description ? (
        typeof description === "string" ? (
          <Paragraph size="sm" color="muted" className="mb-0!">
            {description}
          </Paragraph>
        ) : (
          description
        )
      ) : null}
    </Modal>
  );
}

export default Modal;
export { ConfirmModal };
export type { ConfirmModalProps, ModalProps };
