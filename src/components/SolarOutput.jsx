import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarOutput() {
  const [energy, setEnergy] = useState(0);

  // 🔥 Function to fetch stored daily energy
  const fetchDailyEnergy = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/daily-energy/today"
      );

      setEnergy(res.data.energy || 0);
    } catch (err) {
      console.error("Error fetching daily energy:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDailyEnergy();

    // 🔥 When new solar data comes, backend recalculates
    socket.on("new-solar-data", () => {
      fetchDailyEnergy();
    });

    return () => socket.off("new-solar-data");
  }, []);

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
        {Number(energy).toFixed(2)} Wh
      </h1>
    </div>
  );
}

export default SolarOutput;