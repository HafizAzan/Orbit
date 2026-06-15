import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Title } from "../ui/typography";
import { useAppContext } from "../../context/app-context";
import PlanCatalogGrid from "../billing/plan-catalog-grid";
import { UN_AUTH_ROUTES } from "../../router/public-routes";

function PricingSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const app = useAppContext();

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");

    if (checkoutState) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("checkout");
      setSearchParams(nextParams, { replace: true });

      if (checkoutState === "cancel") {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams, setSearchParams]);

  return (
    <section id="pricing" className="bg-background px-4 py-14 sm:px-6 nav:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll variant="fade-up" className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Simple, transparent pricing
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            No hidden fees. Choose a plan that grows with your team.
          </Paragraph>
        </AnimateOnScroll>

        <PlanCatalogGrid
          mode="public"
          onContact={() => navigate("/contact")}
          onRequireAuth={(ctaType) => {
            if (app?.isAuthenticated) {
              return;
            }

            navigate(ctaType === "register" ? UN_AUTH_ROUTES.REGISTER : UN_AUTH_ROUTES.LOGIN, {
              state: { from: "/#pricing" },
            });
          }}
        />
      </div>
    </section>
  );
}

export default React.memo(PricingSection);
