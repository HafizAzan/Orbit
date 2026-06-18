import { InputNumber, type InputNumberProps } from "antd";
import React from "react";

type IntegerInputProps = Omit<InputNumberProps, "precision" | "parser">;

function blockNonIntegerKeys(event: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-", ".", ","].includes(event.key)) {
    event.preventDefault();
  }
}

function IntegerInput({ onKeyDown, controls = false, ...props }: IntegerInputProps) {
  return (
    <InputNumber
      {...props}
      controls={controls}
      precision={0}
      parser={(value) => value?.replace(/\D/g, "") ?? ""}
      onKeyDown={(event) => {
        blockNonIntegerKeys(event);
        onKeyDown?.(event);
      }}
    />
  );
}

export default React.memo(IntegerInput);
