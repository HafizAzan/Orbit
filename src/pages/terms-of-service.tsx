import React from "react";
import PageSeo from "../component/seo/page-seo";
import LegalPage from "../component/legal/legal-page";
import { TERMS_OF_SERVICE } from "../data/legal";

function TermsOfService() {
  return (
    <>
      <PageSeo title="Terms of Service" description="Read the Orbit Terms of Service governing your use of the platform." path="/terms-of-service" />
      <LegalPage document={TERMS_OF_SERVICE} />
    </>
  );
}

export default React.memo(TermsOfService);
