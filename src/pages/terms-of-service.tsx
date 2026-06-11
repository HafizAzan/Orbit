import React from "react";
import LegalPage from "../component/legal/legal-page";
import { TERMS_OF_SERVICE } from "../data/legal";

function TermsOfService() {
  return <LegalPage document={TERMS_OF_SERVICE} />;
}

export default React.memo(TermsOfService);
