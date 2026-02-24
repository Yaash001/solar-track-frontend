import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import socket from "../services/socket";

function SolarSunPath({ radius = 120, width = 260, height = 150 }) {
  const [readings, setReadings] = useState([]);

  // Initialize sun elevation from last reading
  const getLastElevation = () => {
    if (readings.length === 0) return 0;
    return Number(readings[readings.length - 1].elevation) || 0;
  };

  const elevation = getLastElevation();

  // Convert elevation to (x, y) coordinates along semicircle
  const getSunPosition = (elev) => {
    const elevRad = (elev * Math.PI) / 180;
    const x = radius + radius * Math.cos(Math.PI - elevRad);
    const y = radius - radius * Math.sin(elevRad);
    return { x: x + 10, y }; // +10 for SVG offset
  };

  // Fetch last 20 readings on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/solar-readings?limit=20")
      .then((res) => {
        if (res.data.length > 0) {
          setReadings(res.data);
        }
      })
      .catch((err) => console.error(err));

    // Socket.io updates
    socket.on("new-solar-data", (newData) => {
      setReadings((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-20); // keep last 20 readings
      });
    });

    return () => socket.off("new-solar-data");
  }, []);

  const sunCoords = getSunPosition(elevation);

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <svg width={width} height={height}>
        {/* Semicircle line */}
        <path
          d={`M 10 ${radius} A ${radius} ${radius} 0 0 1 ${radius * 2 + 10} ${radius}`}
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
        />

        {/* Sun */}
        <motion.circle
          r="12"
          fill="#FFD700"
          cx={sunCoords.x}
          cy={sunCoords.y}
          animate={{
            cx: getSunPosition(elevation).x,
            cy: getSunPosition(elevation).y,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </svg>

      <p style={{ color: "white", marginTop: "10px" }}>
        Elevation: {elevation.toFixed(1)}°
      </p>
    </div>
  );
}

export default SolarSunPath;