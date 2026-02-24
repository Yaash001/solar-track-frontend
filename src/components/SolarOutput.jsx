import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarOutput() {
  const [readings, setReadings] = useState([]);
  const [energy, setEnergy] = useState(0);

  const MAX_POWER = 3.6; // total peak power of 4 panels (W)
  const PANEL_EFFICIENCY = 0.65; // realistic efficiency factor

  // Fetch initial readings and subscribe to new data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((response) => {
        setReadings(response.data);
      })
      .catch((err) => console.error("Error fetching solar readings:", err));

    socket.on("new-solar-data", (newData) => {
      setReadings((prev) => [...prev, newData]);
    });

    return () => {
      socket.off("new-solar-data");
    };
  }, []);

  // Compute total energy (Wh) whenever readings change
  useEffect(() => {
    if (readings.length < 2) {
      setEnergy(0);
      return;
    }

    let totalEnergy = 0;

    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i - 1];
      const curr = readings[i];

      // Clamp elevation to 0-90°, ensure numeric
      const elevation = Math.min(90, Math.max(0, Number(curr.elevation) || 0));
      const elevationRad = (elevation * Math.PI) / 180;

      // Instantaneous power (W) with efficiency
      const power = MAX_POWER * Math.sin(elevationRad) * PANEL_EFFICIENCY;

      // Time difference in hours (timestamp in seconds)
      const deltaTimeSec = curr.timestamp - prev.timestamp;
      const deltaTimeHr = deltaTimeSec / 3600;

      totalEnergy += power * deltaTimeHr; // Wh
    }

    setEnergy(totalEnergy.toFixed(2));
  }, [readings]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        color: "white",
      }}
    >
      <h2>Estimated Solar Output Today</h2>
      <h1 style={{ color: "#00E5FF", fontSize: "40px" }}>
        {energy} Wh
      </h1>
    </div>
  );
}

export default SolarOutput;