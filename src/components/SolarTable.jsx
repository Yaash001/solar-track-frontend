import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import { toast } from "react-toastify";

function SolarTable() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    // Initial fetch
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((response) => {
        setReadings(response.data.slice(-20));
      });

    socket.on("new-solar-data", (newData) => {
      toast.success("New solar data received 🌞");

      setReadings((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-20);
      });
    });

    return () => {
      socket.off("new-solar-data");
    };
  }, []);

  const formatTime = (unix) => {
    return new Date(unix * 1000).toLocaleTimeString();
  };

  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Azimuth (°)</th>
          <th>Elevation (°)</th>
        </tr>
      </thead>
      <tbody>
        {readings.map((item) => (
          <tr key={item._id}>
            <td>{formatTime(item.timestamp)}</td>
            <td>{item.azimuth.toFixed(2)}</td>
            <td>{item.elevation.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SolarTable;