import { Realtime } from "ably";

const ably = new Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY,
});

export const notificationChannel = ably.channels.get("notifications");

export const getUserChannel = (userId: string) => {
  return ably.channels.get(`user-${userId}`);
};

export const sendNotificationToUser = (userId: string, message: string) => {
  const userChannel = getUserChannel(userId);
  userChannel.publish("new-comment", { message });
};
