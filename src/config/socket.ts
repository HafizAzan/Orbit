import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "../lib/auth-session";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL?.replace(/\/api\/v\d+\/?$/, "") ?? "http://localhost:5000";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket | null {
  const token = getAccessToken();

  if (!token) {
    disconnectSocket();
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(`${SOCKET_URL}/realtime`, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function joinProjectRoom(projectId: string) {
  socket?.emit("project:join", { projectId });
}

export function leaveProjectRoom(projectId: string) {
  socket?.emit("project:leave", { projectId });
}
