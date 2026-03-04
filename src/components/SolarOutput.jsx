import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function SolarOutput() {
  const [energy, setEnergy] = useState(0);

  const fetchEnergy = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/daily-energy/today"
      );
      setEnergy(response.data.energy);
    } catch (err) {
      console.error("Error fetching energy:", err);
      setEnergy(0);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEnergy();

    // Refresh energy when new solar data arrives
    socket.on("new-solar-data", () => {
      fetchEnergy();
    });

    return () => {
      socket.off("new-solar-data");
    };
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
        {energy} Wh
      </h1>
    </div>
  );
}

export default SolarOutput;