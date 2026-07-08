import type { NavigateFunction } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../router/public-routes";
import type { AuthTwoFactorChallengeResponse } from "../types/auth.types";

export function navigateToTwoFactorChallenge(
  navigate: NavigateFunction,
  challenge: AuthTwoFactorChallengeResponse,
  options?: { remember?: boolean; replace?: boolean },
) {
  navigate(UN_AUTH_ROUTES.TWO_FACTOR, {
    replace: options?.replace ?? false,
    state: {
      challengeToken: challenge.challengeToken,
      remember: options?.remember ?? false,
    },
  });
}
