import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import socket from "../services/socket";
import { toast } from "react-toastify";

import SolarTable from "./SolarTable";
import SolarChart from "./SolarChart";

function SolarDashboard() {
  const [readings, setReadings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Safe date key YYYY-MM-DD
  const getDateKey = (dateString) => {
    const d = new Date(dateString);
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  // Initial fetch & socket subscription
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/solar-readings");

        const sorted = response.data.sort(
          (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
        );

        setReadings(sorted);

        if (sorted.length > 0 && !selectedDate) {
          setSelectedDate(getDateKey(sorted[sorted.length - 1].recordedAt));
        }
      } catch (err) {
        toast.error("Failed to load solar data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time updates
    socket.on("new-solar-data", (newData) => {
      toast.success("New solar data received 🌞");

      setReadings((prev) =>
        [...prev, newData].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
      );
    });

    return () => socket.off("new-solar-data");
  }, []);

  if (loading) return <p>Loading solar data...</p>;

  return (
    <div className="solar-dashboard">
      {/* Table with dropdown controlling selectedDate */}
      <div className="card table-card">
        <SolarTable
          readings={readings}
          setReadings={setReadings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Chart showing data filtered by selectedDate */}
      <div className="chart-card" style={{ marginTop: "20px" }}>
        <SolarChart readings={readings} selectedDate={selectedDate} />
      </div>
    </div>
  );
}

export default SolarDashboard;