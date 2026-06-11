import { DatePicker as AntDatePicker, type DatePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { cn } from "../../lib/utils";

export function parseDatePickerValue(value?: string | Dayjs | null) {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

export function formatDatePickerValue(value?: Dayjs | null) {
  return value?.isValid() ? value.format("YYYY-MM-DD") : "";
}

type DatePickerPropsExtended = Omit<DatePickerProps, "value" | "onChange"> & {
  value?: string | Dayjs | null;
  onChange?: (value: string) => void;
};

function DatePicker({ value, onChange, className, size = "large", format = "MMM D, YYYY", ...props }: DatePickerPropsExtended) {
  return (
    <AntDatePicker
      value={parseDatePickerValue(value)}
      onChange={(date) => {
        const nextDate = Array.isArray(date) ? date[0] : date;
        onChange?.(formatDatePickerValue(nextDate));
      }}
      size={size}
      format={format}
      className={cn(
        "w-full! rounded-xl! [&_.ant-picker]:rounded-xl! [&_.ant-picker]:border-border! [&_.ant-picker]:bg-card! [&_.ant-picker-input>input]:rounded-xl!",
        className,
      )}
      {...props}
    />
  );
}

export default DatePicker;
export type { DatePickerPropsExtended as DatePickerProps };
