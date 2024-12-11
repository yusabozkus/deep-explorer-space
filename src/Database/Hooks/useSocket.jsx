import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const useSocket = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Bildirim al
    socket.on("receive_notification", (notification) => {
      console.log(notification);
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connectUser = (username) => {
    socket.emit("user_connected", username);
  };

  const followUser = (follower, following) => {
    socket.emit("follow_user", { follower, following });
  };

  return { connectUser, followUser };
};

export default useSocket;
