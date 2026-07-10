import React from "react";
import { cn } from "../../lib/utils";
import type { PricingBillingInterval } from "../../lib/pricing-catalog";
import { Text } from "../ui/typography";

type PricingIntervalToggleProps = {
  value: PricingBillingInterval;
  onChange: (value: PricingBillingInterval) => void;
  savingsHint?: string | null;
  className?: string;
};

function PricingIntervalToggle({
  value,
  onChange,
  savingsHint,
  className,
}: PricingIntervalToggleProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            value === "monthly"
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            value === "yearly"
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground",
          )}
        >
          Yearly
        </button>
      </div>

      {savingsHint ? (
        <Text
          as="span"
          size="xs"
          weight="semibold"
          className={cn(
            "rounded-full px-3 py-1 transition-opacity",
            value === "yearly"
              ? "bg-emerald-50 text-emerald-700 opacity-100"
              : "bg-muted/40 text-muted opacity-80",
          )}
        >
          {value === "yearly" ? `Save with yearly · ${savingsHint}` : `Yearly includes ${savingsHint}`}
        </Text>
      ) : null}
    </div>
  );
}

export default React.memo(PricingIntervalToggle);
