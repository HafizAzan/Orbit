import { formatCurrency } from "./helper";
import type {
  BillingCatalogPrice,
  BillingCatalogProduct,
  BillingCycle,
  PricingPlanCard,
} from "../types/billing.types";

export type PricingBillingInterval = "monthly" | "yearly";

export function toBillingCycle(interval: PricingBillingInterval): BillingCycle {
  return interval === "yearly" ? "Annual" : "Monthly";
}

export function resolveCatalogPrice(
  product: BillingCatalogProduct,
  interval: PricingBillingInterval = "monthly",
): BillingCatalogPrice | undefined {
  const preferredCycle = toBillingCycle(interval);
  const preferred = product.prices.find((price) => price.billingCycle === preferredCycle);

  if (preferred) {
    return preferred;
  }

  const monthly = product.prices.find((price) => price.billingCycle === "Monthly");
  return monthly ?? product.prices[0];
}

export function resolveYearlySavingsLabel(metadata: Record<string, string> | undefined) {
  const raw =
    metadata?.is_yearly?.trim() ||
    metadata?.is_year?.trim() ||
    metadata?.yearly_savings?.trim() ||
    "";

  if (!raw) {
    return null;
  }

  // Normalize "2 month free" -> "2 months free"
  if (/^\d+\s+month\s+free$/i.test(raw)) {
    return raw.replace(/month/i, "months");
  }

  return raw;
}

function resolveCtaLabel(product: BillingCatalogProduct) {
  if (product.ctaLabel) {
    return product.ctaLabel;
  }

  if (product.ctaType === "contact") {
    return "Contact sales";
  }

  return "Get started";
}

export function resolveCatalogSavingsHint(products: BillingCatalogProduct[]) {
  for (const product of products) {
    const label = resolveYearlySavingsLabel(product.metadata);
    if (label) {
      return label;
    }
  }

  return null;
}

export function mapCatalogToPricingPlans(
  products: BillingCatalogProduct[],
  interval: PricingBillingInterval = "monthly",
): PricingPlanCard[] {
  return products
    .map((product) => {
      const selectedPrice = resolveCatalogPrice(product, interval);

      if (!selectedPrice) {
        return null;
      }

      const yearlySavings =
        interval === "yearly" ? resolveYearlySavingsLabel(product.metadata) : null;

      return {
        id: product.id,
        priceId: selectedPrice.id,
        name: product.name,
        description: product.description ?? "",
        price: formatCurrency(selectedPrice.unitAmount, selectedPrice.currency, 0),
        priceSuffix: selectedPrice.priceSuffix || undefined,
        features: product.features,
        ctaLabel: resolveCtaLabel(product),
        ctaType: product.ctaType,
        highlighted: product.highlighted,
        badge: product.badge ?? undefined,
        billingCycle: selectedPrice.billingCycle,
        savingsLabel: yearlySavings ?? undefined,
      } satisfies PricingPlanCard;
    })
    .filter((plan): plan is PricingPlanCard => plan != null);
}
