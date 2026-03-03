import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import { AiFillHome } from "react-icons/ai";

function SolarSunPath() {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((res) => {
        const latest = res.data[res.data.length - 1];
        setSolarData(latest);
      })
      .catch((err) => console.error(err));

    socket.on("new-solar-data", (newData) => {
      setSolarData(newData);
    });

    return () => socket.off("new-solar-data");
  }, []);

  if (!solarData) return <div>Loading sun path...</div>;

  const { azimuth, elevation } = solarData;

  const radius = 130;
  const centerX = 150;
  const centerY = 150;

  // Horizontal X based on azimuth
  let normalizedAzimuth = (azimuth - 90) / 180;
  normalizedAzimuth = Math.max(0, Math.min(1, normalizedAzimuth));
  const x = centerX - radius + normalizedAzimuth * (2 * radius);

  // Vertical Y based on elevation
  const y = centerY - radius * (elevation / 90);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Outer Card for Sun Info */}
      <div
        style={{
          width: "300px",
          background: "#333",
          color: "white",
          padding: "10px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div>Azimuth: {azimuth.toFixed(2)}°</div>
        <div>Elevation: {elevation.toFixed(2)}°</div>
      </div>

      {/* Sun Path Area */}
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "180px",
          background: "#222",
          borderRadius: "10px",
        }}
      >
        {/* Home logo at center */}
        <div
          style={{
            position: "absolute",
            left: `${centerX - 20}px`,
            top: `${centerY - 20}px`,
            zIndex: 1,
          }}
        >
          <AiFillHome size={40} color="white" />
        </div>

        {/* Sun */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "orange",
            boxShadow: "0 0 20px rgba(255,165,0,0.8)",
            left: `${x - 10}px`,
            top: `${y - 10}px`,
            transition: "all 0.5s ease",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

export default SolarSunPath;