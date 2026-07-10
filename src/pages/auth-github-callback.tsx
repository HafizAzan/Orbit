import { Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMe } from "../api-services/auth.service";
import PageSeo from "../component/seo/page-seo";
import { useAppContext } from "../context/app-context";
import { showApiErrorToast, showApiSuccessToast } from "../lib/api-error";
import { getPostAuthRedirectPath } from "../lib/auth-routing";
import { saveAuthSession, updateAuthTokens } from "../lib/auth-session";

function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const app = useAppContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(decodeURIComponent(error));
      showApiErrorToast(decodeURIComponent(error));
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const rememberParam = searchParams.get("remember");
    const remember = rememberParam === "true" || rememberParam === "1";

    if (!accessToken || !refreshToken) {
      const msg = "Missing authentication tokens. Please try again.";
      setErrorMessage(msg);
      showApiErrorToast(msg);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
      return;
    }

    async function finishOAuth() {
      try {
        updateAuthTokens(accessToken!, refreshToken!, remember);
        const user = await getMe();
        saveAuthSession(accessToken!, user, remember, refreshToken!);
        app.setUser(user);
        showApiSuccessToast("Signed in with GitHub successfully.");
        navigate(getPostAuthRedirectPath(user), { replace: true });
      } catch (err) {
        showApiErrorToast(err);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      }
    }

    void finishOAuth();
  }, [app, navigate, searchParams]);

  return (
    <>
      <PageSeo title="GitHub Sign-In" description="Completing GitHub authentication." noIndex />
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        {errorMessage ? (
          <p className="text-base text-red-500">{errorMessage}</p>
        ) : (
          <>
            <Spin size="large" />
            <p className="text-sm text-muted-foreground">Completing sign-in with GitHub…</p>
          </>
        )}
      </div>
    </>
  );
}

export default React.memo(GithubCallback);
