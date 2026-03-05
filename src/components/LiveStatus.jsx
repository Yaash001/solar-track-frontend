import { useEffect, useState } from "react";
import socket from "../services/socket";

function LiveStatus() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    setIsLive(socket.connected);

    const handleConnect = () => setIsLive(true);
    const handleDisconnect = () => setIsLive(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div
      style={{
        display: "inline-block",
        padding: "12px 24px",      // bigger padding
        borderRadius: "30px",      // bigger radius
        fontWeight: "900",          // bold
        fontSize: "22px",           // larger font
        color: "white",
        backgroundColor: isLive ? "#28a745" : "#dc3545",
        boxShadow: isLive
          ? "0 0 15px rgba(40, 167, 69, 0.8)"
          : "0 0 15px rgba(220, 53, 69, 0.8)",
        transition: "all 0.3s ease",
        fontFamily: "Segoe UI, sans-serif",
        textAlign: "center",
        minWidth: "100px",
      }}
    >
      {isLive ? "LIVE" : "OFFLINE"}
    </div>
  );
}

export default LiveStatus;