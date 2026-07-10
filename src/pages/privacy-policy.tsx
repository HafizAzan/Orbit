import React from "react";
import PageSeo from "../component/seo/page-seo";
import LegalPage from "../component/legal/legal-page";
import { PRIVACY_POLICY } from "../data/legal";

function PrivacyPolicy() {
  return (
    <>
      <PageSeo title="Privacy Policy" description="Read the Orbit Privacy Policy to understand how we collect, use, and protect your data." path="/privacy-policy" />
      <LegalPage document={PRIVACY_POLICY} />
    </>
  );
}

export default React.memo(PrivacyPolicy);
