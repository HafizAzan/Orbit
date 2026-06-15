import { useEffect, useState } from "react";
import { formatCountdown, getRemainingSeconds } from "../lib/otp-session";

export function useOtpCountdown(expiresAt: string | null | undefined) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    expiresAt ? getRemainingSeconds(expiresAt) : 0,
  );

  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const update = () => {
      setRemainingSeconds(getRemainingSeconds(expiresAt));
    };

    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  return {
    remainingSeconds,
    isExpired: remainingSeconds <= 0,
    formattedTime: formatCountdown(remainingSeconds),
  };
}
