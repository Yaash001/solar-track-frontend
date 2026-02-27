import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarOutput() {
  const [readings, setReadings] = useState([]);
  const [energy, setEnergy] = useState(0);

  const MAX_POWER = 3.6;
  const PANEL_EFFICIENCY = 0.65;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((response) => {
        setReadings(response.data);
      })
      .catch((err) => console.error(err));

    socket.on("new-solar-data", (newData) => {
      setReadings((prev) => [...prev, newData]);
    });

    return () => socket.off("new-solar-data");
  }, []);

  useEffect(() => {
    if (readings.length < 2) {
      setEnergy(0);
      return;
    }

    let totalEnergy = 0;

    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i - 1];
      const curr = readings[i];

      const elevation = Math.min(90, Math.max(0, Number(curr.elevation) || 0));
      const elevationRad = (elevation * Math.PI) / 180;

      const power =
        MAX_POWER * Math.sin(elevationRad) * PANEL_EFFICIENCY;

      const prevTime = new Date(prev.recordedAt).getTime();
      const currTime = new Date(curr.recordedAt).getTime();

      const deltaTimeHr = (currTime - prevTime) / (1000 * 60 * 60);

      totalEnergy += power * deltaTimeHr;
    }

    setEnergy(totalEnergy.toFixed(2));
  }, [readings]);

  return (
    <div>
      <h2>Estimated Solar Output Today</h2>
      <h1
        style={{
          color: "#00E5FF",
          fontSize: "50px",
          textShadow: "0 0 15px rgba(0,229,255,0.7)",
        }}
      >
        {energy} Wh
      </h1>
    </div>
  );
}

export default SolarOutput;