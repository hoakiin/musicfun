import type { SocketEvents } from "../constants";
import { getSocket } from "./getSocket";
export const subscribeToEvent = <T>(
  event: SocketEvents,
  callback: (data: T) => void,
) => {
  const socket = getSocket()

  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};
