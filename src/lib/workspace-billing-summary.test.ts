import { describe, expect, it } from "vitest";
import { resolveWorkspaceBillingSummary } from "./workspace-billing-summary";
import type { CurrentSubscriptionResponse } from "../types/billing.types";

const baseSubscription: CurrentSubscriptionResponse = {
  organizationId: "org-1",
  plan: "PRO",
  status: "active",
  billingCycle: "Annual",
  amount: 348,
  currency: "USD",
  renewalDate: "2026-12-12T00:00:00.000Z",
  expiresAt: null,
  stripeCustomerId: "cus_123",
  stripeSubscriptionId: "sub_123",
  stripePriceId: "price_123",
  lastPaymentAt: "2025-12-12T00:00:00.000Z",
};

describe("resolveWorkspaceBillingSummary", () => {
  it("maps subscription fields into billing summary cards", () => {
    const summary = resolveWorkspaceBillingSummary(baseSubscription, [
      {
        id: "prod_pro",
        name: "Pro Plan",
        description: null,
        plan: "PRO",
        metadata: {},
        features: [],
        highlighted: false,
        badge: null,
        sortOrder: 1,
        ctaLabel: null,
        ctaType: "checkout",
        prices: [],
      },
    ]);

    expect(summary.planName).toBe("Pro Plan");
    expect(summary.priceLabel).toBe("$348/year");
    expect(summary.nextPaymentDate).toBe("Dec 12, 2026");
    expect(summary.paymentMethodTitle).toBe("Stripe billing");
    expect(summary.statusLabel).toBe("Active");
  });

  it("returns empty summary when subscription is missing", () => {
    const summary = resolveWorkspaceBillingSummary(undefined);

    expect(summary.planName).toBe("—");
    expect(summary.priceLabel).toBe("No active subscription");
    expect(summary.paymentMethodTitle).toBe("No payment method");
  });
});
