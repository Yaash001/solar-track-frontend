import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket"; // make sure this exports a configured socket.io client

function SolarOutput() {
  const [totalPower, setTotalPower] = useState(0);
  const [avgPower, setAvgPower] = useState(0);

  const fetchEnergy = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/daily-energy/today"
      );

      setTotalPower(response.data.totalPower || 0);
      setAvgPower(response.data.avgPower || 0);
    } catch (err) {
      console.error("Error fetching energy:", err);
      setTotalPower(0);
      setAvgPower(0);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEnergy();

    // Refresh energy when new solar data arrives
    socket.on("new-solar-data", () => {
      fetchEnergy();
    });

    // Cleanup on unmount
    return () => {
      socket.off("new-solar-data");
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Estimated Solar Output Today</h2>
      <h1
        style={{
          color: "#00E5FF",
          fontSize: "50px",
          textShadow: "0 0 15px rgba(0,229,255,0.7)",
          marginBottom: "10px",
        }}
      >
        {totalPower} Wh
      </h1>{/*
      <p style={{ fontSize: "18px", color: "#ccc" }}>
        Average Power: {avgPower} W
      </p>*/}
    </div>
  );
}

export default SolarOutput;