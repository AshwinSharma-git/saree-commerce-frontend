"use client";

import { io, type Socket } from "socket.io-client";
import { tokenStore } from "@/lib/api/client";

const SOCKET_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SOCKET_URL) ||
  // Strip the `/api/v1` from the API URL — sockets sit at the root.
  ((typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "http://localhost:4000")
    .replace(/\/api\/v\d+\/?$/, "");

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket", "polling"],
    auth: () => ({ token: tokenStore.get() ?? "" }),
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
  });
  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
