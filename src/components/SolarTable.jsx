import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import { toast } from "react-toastify";

function SolarTable() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
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

    return () => socket.off("new-solar-data");
  }, []);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <table>
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
            <td>{formatTime(item.recordedAt)}</td>
            <td>{item.azimuth.toFixed(2)}</td>
            <td>{item.elevation.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SolarTable;