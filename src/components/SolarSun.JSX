import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarSun() {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    // Initial fetch
    axios.get("http://localhost:5000/api/solar-readings")
      .then(res => {
        const latest = res.data[res.data.length - 1];
        setSolarData(latest);
      });

    // Listen for live updates
    socket.on("new-solar-data", (newData) => {
      setSolarData(newData);
    });

    return () => socket.off("new-solar-data");
  }, []);

  if (!solarData) return <div>Loading sun position...</div>;

  // Normalize azimuth (0–360) → 0%–100%
  const leftPosition = (solarData.azimuth / 360) * 100;

  // Normalize elevation (0–90 typical) → bottom to top
  const bottomPosition = (solarData.elevation / 90) * 100;

  return (
    <div style={styles.sky}>
      <div
        style={{
          ...styles.sun,
          left: `${leftPosition}%`,
          bottom: `${bottomPosition}%`,
        }}
      />
    </div>
  );
}

const styles = {
  sky: {
    position: "relative",
    height: "400px",
    width: "100%",
    background: "linear-gradient(to top, #87CEEB, #E0F6FF)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  sun: {
    position: "absolute",
    width: "60px",
    height: "60px",
    backgroundColor: "yellow",
    borderRadius: "50%",
    transform: "translate(-50%, 50%)",
    transition: "all 0.8s ease-in-out",
    boxShadow: "0 0 40px rgba(255, 200, 0, 0.8)",
  },
};

export default SolarSun;