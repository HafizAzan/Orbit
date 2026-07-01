import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../config/socket";
import { getAccessToken } from "../lib/auth-session";

function useRealtimeConnection(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !getAccessToken()) {
      disconnectSocket();
      return;
    }

    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [enabled]);
}

export default useRealtimeConnection;
