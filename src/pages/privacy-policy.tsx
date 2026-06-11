import React from "react";
import LegalPage from "../component/legal/legal-page";
import { PRIVACY_POLICY } from "../data/legal";

function PrivacyPolicy() {
  return <LegalPage document={PRIVACY_POLICY} />;
}

export default React.memo(PrivacyPolicy);
