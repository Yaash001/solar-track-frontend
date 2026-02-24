import SolarTable from "./components/SolarTable";
import SolarChart from "./components/SolarChart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SolarOutput from "./components/SolarOutput";
import SolarSunPath from "./components/SolarSunPath";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Solar Tracker Dashboard</h1>

      <SolarChart />
      <SolarTable />
      <SolarOutput/>
      <SolarSunPath/>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;