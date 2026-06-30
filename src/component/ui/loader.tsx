import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { cn } from "../../lib/utils";
import { Text } from "./typography";

type LoaderProps = {
  label?: string;
  className?: string;
  fullScreen?: boolean;
};

function Loader({ label = "Loading...", className, fullScreen = false }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3",
        fullScreen ? "min-h-screen bg-background" : "min-h-[50vh] py-16",
        className,
      )}
    >
      <Spin indicator={<LoadingOutlined spin className="text-3xl text-primary!" />} size="large" />
      <Text as="p" size="sm" color="muted" weight="medium" font="roboto">{label}</Text>
    </div>
  );
}

export default Loader;
