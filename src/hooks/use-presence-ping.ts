import { useEffect } from "react";
import { getSocket } from "../config/socket";

const PRESENCE_PING_INTERVAL_MS = 2 * 60 * 1000;

function sendPresencePing() {
  if (document.visibilityState !== "visible") return;
  getSocket()?.emit("presence:ping");
}

function usePresencePing(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    sendPresencePing();

    const intervalId = window.setInterval(sendPresencePing, PRESENCE_PING_INTERVAL_MS);
    const handleActivity = () => sendPresencePing();

    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleActivity);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleActivity);
    };
  }, [enabled]);
}

export default usePresencePing;
