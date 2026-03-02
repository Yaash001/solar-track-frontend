import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarSunPath() {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/solar-readings")
      .then(res => {
        const latest = res.data[res.data.length - 1];
        setSolarData(latest);
      })
      .catch(err => console.error(err));

    socket.on("new-solar-data", (newData) => {
      setSolarData(newData);
    });

    return () => socket.off("new-solar-data");
  }, []);

  if (!solarData) return <div>Loading sun path...</div>;

  const { azimuth, elevation } = solarData;

  // ----- ARC SETTINGS -----
  const radius = 130;
  const centerX = 150;
  const centerY = 150;

  // ----- Convert azimuth to arc fraction -----
  // Sunrise ~90°, Sunset ~270°
  let normalizedAzimuth = (azimuth - 90) / 180;
  normalizedAzimuth = Math.max(0, Math.min(1, normalizedAzimuth));

  // ----- Convert fraction to angle along semicircle (π → 0) -----
  const angle = Math.PI * (1 - normalizedAzimuth);

  // ----- Use elevation to slightly adjust radius if needed (optional) -----
  const sunRadius = radius * (0.8 + 0.2 * (elevation / 90)); // optional subtle effect

  // ----- Calculate X/Y along the semi-circle -----
  const x = centerX + sunRadius * Math.cos(angle - Math.PI / 2); // shift so left is sunrise
  const y = centerY - sunRadius * Math.sin(angle);

  return (
    <div className="sunpath-container" style={{ position: "relative", width: "300px", height: "180px" }}>
      {/* Arc path */}
      <svg width="300" height="180" className="arc-svg">
        <path
          d="M 20 150 A 130 130 0 0 1 280 150"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Sun */}
      <div
        className="sun"
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "orange",
          boxShadow: "0 0 20px rgba(255,165,0,0.8)",
          left: `${x - 10}px`,
          top: `${y - 10}px`,
          transition: "all 0.5s ease"
        }}
      />

      {/* Sun info */}
      <div className="sun-info" style={{ marginTop: "10px", color: "white" }}>
        <p>Azimuth: {azimuth.toFixed(2)}°</p>
        <p>Elevation: {elevation.toFixed(2)}°</p>
      </div>
    </div>
  );
}

export default SolarSunPath;