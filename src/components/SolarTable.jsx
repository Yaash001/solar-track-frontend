import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import { toast } from "react-toastify";

function SolarTable({ readings, setReadings, selectedDate, setSelectedDate }) {
  const [loading, setLoading] = useState(true);

  // Date key: YYYY-MM-DD
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

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

  const formatDisplayDate = (dateKey) =>
    new Date(dateKey).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Initial fetch & socket
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
      } catch (error) {
        toast.error("Failed to load solar data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time socket
    socket.on("new-solar-data", (newData) => {
      toast.success("New solar data received 🌞");

      setReadings((prev) =>
        [...prev, newData].sort(
          (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
        )
      );
    });

    return () => socket.off("new-solar-data");
  }, []);

  // Unique dates
  const uniqueDates = useMemo(() => {
    return [...new Set(readings.map((r) => getDateKey(r.recordedAt)))].sort(
      (a, b) => new Date(b) - new Date(a)
    );
  }, [readings]);

  // Filtered readings for table
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => getDateKey(r.recordedAt) === selectedDate);
  }, [readings, selectedDate]);

  if (loading) return <p>Loading solar data...</p>;

  return (
    <div>
      <label>
        Select Date:{" "}
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {uniqueDates.map((dateKey) => (
            <option key={dateKey} value={dateKey}>
              {formatDisplayDate(dateKey)}
            </option>
          ))}
        </select>
      </label>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Azimuth (°)</th>
            <th>Elevation (°)</th>
          </tr>
        </thead>
        <tbody>
          {filteredReadings.length === 0 ? (
            <tr>
              <td colSpan="3">No data for selected date</td>
            </tr>
          ) : (
            filteredReadings.map((item) => (
              <tr key={item._id}>
                <td>{formatTime(item.recordedAt)}</td>
                <td>{Number(item.azimuth).toFixed(2)}</td>
                <td>{Number(item.elevation).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SolarTable;