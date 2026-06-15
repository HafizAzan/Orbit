const API_ROUTES: Record<string, Record<string, string>> = {
  AUTH: {
    REGISTER_SEND_OTP: "/auth/register/send-otp",
    REGISTER_PENDING: "/auth/register/pending",
    REGISTER_RESEND_OTP: "/auth/register/resend-otp",
    REGISTER_VERIFY: "/auth/register/verify",
    ME: "/auth/me",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
};

export default API_ROUTES;
