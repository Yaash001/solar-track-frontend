import { useEffect, useState } from "react";
import socket from "../services/socket";

function LiveStatus() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // 🔥 Force connection if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // ✅ Immediately check current state
    setIsLive(socket.connected);

    // ✅ When connection happens
    const handleConnect = () => {
      setIsLive(true);
    };

    // ✅ When disconnected
    const handleDisconnect = () => {
      setIsLive(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div>
      {isLive ? "LIVE" : "OFFLINE"}
    </div>
  );
}

export default LiveStatus;