import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function SolarChart() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/solar-readings")
      .then((response) => {
        setReadings(response.data.slice(-30));
      });

    socket.on("new-solar-data", (newData) => {
      setReadings((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-30);
      });
    });

    return () => socket.off("new-solar-data");
  }, []);

  const data = {
    datasets: [
      {
        label: "Solar Position",
        data: readings.map((item) => ({
          x: item.azimuth,
          y: item.elevation,
        })),
        backgroundColor: "rgba(0,229,255,0.8)",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Azimuth (°)",
          color: "#00E5FF",
        },
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "Elevation (°)",
          color: "#00E5FF",
        },
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Scatter data={data} options={options} />
    </div>
  );
}

export default SolarChart;