import SolarChart from "./components/SolarChart";
import SolarOutput from "./components/SolarOutput";
import SolarSunPath from "./components/SolarSunPath";
import SolarTable from "./components/SolarTable";
import LiveStatus from "./components/LiveStatus";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1 className="dashboard-title">
          ☀ Solar Tracking Dashboard
        </h1>

        <div className="header-right">
          <LiveStatus />
          <ThemeToggle />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-layout">

        {/* LEFT SIDE - CHART */}
        <div className="chart-card">
          <SolarChart />
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
        <SolarTable />
      </div>

    </div>
  );
}

export default App;