import React, { useCallback, useState } from "react";
import { Button } from "antd";
import { ConfirmModal } from "../../ui/modal";
import { useBillingPortal, useCancelPlan, useCurrentSubscription } from "../../../hooks/use-billing";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";

function WorkspaceBillingActions() {
  const { data: subscription } = useCurrentSubscription();
  const { mutateAsync: openPortal, isPending: portalLoading } = useBillingPortal();
  const { mutateAsync: cancelPlan, isPending: cancelLoading } = useCancelPlan();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleManagePayment = useCallback(async () => {
    try {
      const result = await openPortal(`${window.location.origin}/billing`);
      window.location.assign(result.url);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [openPortal]);

  const handleCancelSubscription = useCallback(async () => {
    try {
      const result = await cancelPlan({ cancelAtPeriodEnd: true });
      showApiSuccessToast(result.message);
      setCancelModalOpen(false);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [cancelPlan]);

  if (!subscription?.stripeSubscriptionId) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          className="font-semibold!"
          loading={portalLoading}
          onClick={() => {
            void handleManagePayment();
          }}
        >
          Manage Payment Method
        </Button>

        <Button danger className="font-semibold!" onClick={() => setCancelModalOpen(true)}>
          Cancel Subscription
        </Button>
      </div>

      <ConfirmModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel subscription?"
        description="Your workspace will keep access until the end of the current billing period."
        confirmText="Cancel at period end"
        confirmDanger
        confirmLoading={cancelLoading}
      />
    </>
  );
}

export default React.memo(WorkspaceBillingActions);
