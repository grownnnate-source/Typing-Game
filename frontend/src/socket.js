import { io } from "socket.io-client";

// Connect to backend Socket.IO server
export const socket = io("http://localhost:3000", {
  autoConnect: true,
  transports: ["websocket", "polling"]
});
