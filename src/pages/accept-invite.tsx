import React from "react";
import { useSearchParams } from "react-router-dom";
import PageSeo from "../component/seo/page-seo";
import AcceptInviteForm from "../component/auth/accept-invite-form";
import AcceptInvitePreview from "../component/auth/accept-invite-preview";
import { useValidateInviteToken } from "../hooks/user-authentication";

function resolveInviteToken(searchParams: URLSearchParams) {
  return searchParams.get("token")?.trim() || searchParams.get("invite")?.trim() || "";
}

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = resolveInviteToken(searchParams);
  const { data: invite } = useValidateInviteToken(token);

  return (
    <>
      <PageSeo title="Accept Invitation" description="Accept your invitation to join a workspace on Orbit." noIndex />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full min-w-0 bg-card lg:bg-background">
          <AcceptInviteForm />
        </div>
        {invite ? <AcceptInvitePreview invite={invite} /> : null}
      </div>
    </>
  );
}

export default React.memo(AcceptInvite);
