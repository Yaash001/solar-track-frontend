import { useEffect, useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function SolarChart({ readings, selectedDate }) {
  // Date key YYYY-MM-DD
  const getDateKey = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Filter readings for selected date
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => getDateKey(r.recordedAt) === selectedDate);
  }, [readings, selectedDate]);

  // Clamp readings
  const clampedReadings = filteredReadings.map((item) => ({
    x: Math.min(Math.max(item.azimuth, 0), 270),
    y: Math.min(Math.max(item.elevation, 0), 90),
  }));

  const data = {
    datasets: [
      {
        label: "Solar Position",
        data: clampedReadings,
        backgroundColor: "rgba(0,229,255,0.8)",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#ffffff" } },
    },
    scales: {
      x: {
        min: 0,
        max: 280,
        title: { display: true, text: "Azimuth (°)", color: "#00E5FF" },
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        min: 0,
        max: 120,
        title: { display: true, text: "Elevation (°)", color: "#00E5FF" },
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default SolarChart;