import { useState } from "react";
import SolarChart from "./components/SolarChart";
import SolarOutput from "./components/SolarOutput";
import SolarSunPath from "./components/SolarSunPath";
import SolarTable from "./components/SolarTable";
import LiveStatus from "./components/LiveStatus";
import ThemeToggle from "./components/ThemeToggle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  // Shared state
  const [readings, setReadings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <h1 className="dashboard-title">☀ Solar Tracking Dashboard</h1>
        <div className="header-right">
          <LiveStatus />
          <ThemeToggle />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-layout">
        {/* LEFT SIDE - CHART */}
        <div className="chart-card">
          <SolarChart readings={readings} selectedDate={selectedDate} />
        </div>

        {/* RIGHT SIDE - OUTPUT + SUN */}
        <div className="right-column">
          <div className="card">
            <SolarOutput />
          </div>
          <div className="card">
            <SolarSunPath />
          </div>
        </div>
      </div>

      {/* TABLE FULL WIDTH */}
      <div className="card table-card">
        <SolarTable
          readings={readings}
          setReadings={setReadings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Global Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;