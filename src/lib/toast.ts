import { message } from "antd";
import type { ArgsProps, ConfigOptions, NoticeType } from "antd/es/message/interface";
import type { Key, ReactNode } from "react";

type ToastContent = ReactNode;
type ToastOptions = Omit<ArgsProps, "content" | "type">;
const DEFAULT_DURATION = 3;

function resolveOptions(
  options?: ToastOptions | number,
  defaultDuration = DEFAULT_DURATION,
): ToastOptions {
  if (typeof options === "number") {
    return { duration: options };
  }

  return {
    duration: defaultDuration,
    ...options,
  };
}

function show(type: NoticeType, content: ToastContent, options?: ToastOptions | number) {
  return message.open({
    type,
    content,
    ...resolveOptions(options),
  });
}

function configureToast(options: ConfigOptions) {
  message.config(options);
}

function destroyToast(key?: Key) {
  message.destroy(key);
}

const toast = {
  success(content: ToastContent, options?: ToastOptions | number) {
    return show("success", content, options);
  },

  error(content: ToastContent, options?: ToastOptions | number) {
    return show("error", content, options);
  },

  info(content: ToastContent, options?: ToastOptions | number) {
    return show("info", content, options);
  },

  warning(content: ToastContent, options?: ToastOptions | number) {
    return show("warning", content, options);
  },

  loading(content: ToastContent, options?: ToastOptions | number) {
    return show("loading", content, options);
  },

  open(options: ArgsProps) {
    return message.open(options);
  },

  configure: configureToast,
  destroy: destroyToast,
};

export { toast, configureToast, destroyToast };
export type { ToastContent, ToastOptions };
