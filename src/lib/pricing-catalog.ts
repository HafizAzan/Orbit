import { formatCurrency } from "./helper";
import type { BillingCatalogProduct, PricingPlanCard } from "../types/billing.types";

function resolvePrimaryPrice(product: BillingCatalogProduct) {
  const monthlyPrice = product.prices.find((price) => price.billingCycle === "Monthly");
  return monthlyPrice ?? product.prices[0];
}

function resolveCtaLabel(product: BillingCatalogProduct, priceAmount: number) {
  if (product.ctaLabel) {
    return product.ctaLabel;
  }

  if (product.ctaType === "contact") {
    return "Contact sales";
  }

  if (priceAmount <= 0 || product.ctaType === "register") {
    return "Start for free";
  }

  return "Get started";
}

export function mapCatalogToPricingPlans(products: BillingCatalogProduct[]): PricingPlanCard[] {
  return products.map((product, index) => {
    const primaryPrice = resolvePrimaryPrice(product);
    const priceAmount = primaryPrice.unitAmount;
    const highlighted =
      product.highlighted || (!products.some((item) => item.highlighted) && index === 1);

    return {
      id: product.id,
      priceId: primaryPrice.id,
      name: product.name,
      description: product.description ?? "",
      price: formatCurrency(priceAmount, primaryPrice.currency, 0),
      priceSuffix: primaryPrice.priceSuffix || undefined,
      features: product.features,
      ctaLabel: resolveCtaLabel(product, priceAmount),
      ctaType: product.ctaType,
      highlighted,
      badge: product.badge ?? (highlighted ? "Most popular" : undefined),
    };
  });
}
