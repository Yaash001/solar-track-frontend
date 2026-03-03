import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import socket from "../services/socket";
import SolarTable from "./SolarTable";
import SolarChart from "./SolarChart";
import { toast } from "react-toastify";

function SolarDashboard() {
  const [readings, setReadings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/solar-readings"
        );

        const sorted = response.data.sort(
          (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
        );

        setReadings(sorted);

        if (sorted.length > 0) {
          setSelectedDate(
            getDateKey(sorted[sorted.length - 1].recordedAt)
          );
        }
      } catch (error) {
        toast.error("Failed to load solar data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("new-solar-data", (newData) => {
      setReadings((prev) =>
        [...prev, newData].sort(
          (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
        )
      );
    });

    return () => socket.off("new-solar-data");
  }, []);

  const uniqueDates = useMemo(() => {
    return [
      ...new Set(readings.map((r) => getDateKey(r.recordedAt))),
    ].sort((a, b) => new Date(b) - new Date(a));
  }, [readings]);

  const filteredReadings = useMemo(() => {
    return readings.filter(
      (r) => getDateKey(r.recordedAt) === selectedDate
    );
  }, [readings, selectedDate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <label>
        Select Date:{" "}
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {uniqueDates.map((dateKey) => (
            <option key={dateKey} value={dateKey}>
              {new Date(dateKey).toDateString()}
            </option>
          ))}
        </select>
      </label>

      <SolarTable readings={filteredReadings} />
      <div style={{ height: "400px", marginTop: "20px" }}>
        <SolarChart readings={filteredReadings} />
      </div>
    </div>
  );
}

export default SolarDashboard;