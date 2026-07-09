import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TwoFactorChallengeScreen from "../component/auth/two-factor-challenge-screen";
import { useAppContext } from "../context/app-context";
import { showApiSuccessToast } from "../lib/api-error";
import { getPostAuthRedirectPath } from "../lib/auth-routing";
import { saveAuthSession } from "../lib/auth-session";
import { UN_AUTH_ROUTES } from "../router/public-routes";
import type { TwoFactorChallengeLocationState } from "../types/auth.types";

function TwoFactorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const app = useAppContext();
  const state = (location.state as TwoFactorChallengeLocationState | null) ?? null;

  if (!state?.challengeToken) {
    navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
    return null;
  }

  return (
    <TwoFactorChallengeScreen
      challengeToken={state.challengeToken}
      onBack={() => navigate(UN_AUTH_ROUTES.LOGIN, { replace: true })}
      onComplete={(session) => {
        saveAuthSession(session.accessToken, session.user, state.remember === true, session.refreshToken);
        app?.setUser(session.user);
        showApiSuccessToast(session.message);
        navigate(getPostAuthRedirectPath(session.user), { replace: true });
      }}
    />
  );
}

export default React.memo(TwoFactorPage);
