import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import socket from "../services/socket";

function SolarSunPath({ radius = 100 }) {
  const width = radius * 2 + 20; // semi-circle width + margin
  const height = radius + 20; // semi-circle height + margin

  const [readings, setReadings] = useState([]);

  // Get latest reading safely
  const latestReading = useMemo(() => {
    if (!readings.length) return null;
    return readings[readings.length - 1];
  }, [readings]);

  // Determine max elevation for scaling
  const maxElevation = useMemo(() => {
    if (!readings.length) return 60; // default max
    return Math.max(...readings.map((r) => Number(r.elevation)), 60);
  }, [readings]);

  // Compute sun coordinates
  const sunCoords = useMemo(() => {
    if (!latestReading) return { x: radius + 10, y: radius };

    const az = Number(latestReading.azimuth);
    const elev = Number(latestReading.elevation);

    if (!Number.isFinite(az) || !Number.isFinite(elev)) {
      return { x: radius + 10, y: radius };
    }

    // Map azimuth (sunrise ≈ 90°, sunset ≈ 270°) to x
    const minAz = 90;
    const maxAz = 270;
    const x = 10 + ((az - minAz) / (maxAz - minAz)) * (radius * 2);

    // Map elevation 0 → maxElevation to y (top of arc = high elevation)
    const y = radius - (elev / maxElevation) * radius;

    return { x, y };
  }, [latestReading, radius, maxElevation]);

  useEffect(() => {
    // Initial fetch
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setReadings(res.data.slice(-20)); // last 20 readings
        }
      })
      .catch(console.error);

    // Socket listener for new readings
    socket.on("new-solar-data", (newData) => {
      setReadings((prev) => [...prev.slice(-19), newData]);
    });

    return () => socket.off("new-solar-data");
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={width} height={height}>
        {/* Sun semi-circle path */}
        <path
          d={`M 10 ${radius} A ${radius} ${radius} 0 0 1 ${radius * 2 + 10} ${radius}`}
          stroke="#00E5FF"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated sun */}
        <motion.circle
          r="12"
          fill="#FFD700"
          cx={sunCoords.x}
          cy={sunCoords.y}
          animate={{
            cx: sunCoords.x,
            cy: sunCoords.y,
          }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 20,
          }}
        />
      </svg>

      <p style={{ marginTop: "10px" }}>
        Elevation: {latestReading ? Number(latestReading.elevation).toFixed(1) : 0}° | Azimuth:{" "}
        {latestReading ? Number(latestReading.azimuth).toFixed(1) : 0}°
      </p>
    </div>
  );
}

export default SolarSunPath;