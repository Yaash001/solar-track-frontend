import { useState, useEffect } from "react";
import SolarChart from "./components/SolarChart";
import SolarOutput from "./components/SolarOutput";
import SolarSunPath from "./components/SolarSunPath";
import SolarTable from "./components/SolarTable";
import LiveStatus from "./components/LiveStatus";
import ThemeToggle from "./components/ThemeToggle" 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [readings, setReadings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now.getHours();
      if (hour >= 8 && hour < 11) setGreeting("Good Morning, User ☀");
      else if (hour >= 11 && hour < 14) setGreeting("Good Afternoon, User 🌤");
      else setGreeting("Good Evening, User 🌙");
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1 className="dashboard-title">☀ Solar Tracking Dashboard</h1>
          <div className="clock-greeting">
            <div className="clock">{formatTime(currentTime)}</div>
            <div className="greeting">{greeting}</div>
          </div>
        </div>
        <div className="header-right">
          <LiveStatus />
<ThemeToggle />         

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-layout">
        <div className="chart-card">
          <SolarChart readings={readings} selectedDate={selectedDate} />
        </div>
        <div className="right-column">
          <div className="card">
            <SolarOutput />
          </div>
          <div className="card">
            <SolarSunPath />
          </div>
        </div>
      </div>

      <div className="card table-card">
        <SolarTable
          readings={readings}
          setReadings={setReadings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;