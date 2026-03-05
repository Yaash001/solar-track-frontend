import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";

function SolarSunPath() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for smooth animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const centerX = 150;
  const centerY = 150;
  const radius = 100; // distance from house

  // Compute fraction of the day between 8 AM and 4 PM
  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  let fraction = 0; // default at left
  if (hour >= 8 && hour <= 16) {
    const totalSeconds = (hour - 8) * 3600 + minutes * 60 + seconds;
    fraction = totalSeconds / (8 * 3600); // 0 → 1 over 8 hours
  } else if (hour < 8) {
    fraction = 0;
  } else if (hour > 16) {
    fraction = 1;
  }

  // Map fraction to angle 135° (left) → 90° (above) → 45° (right)
  // We'll use a piecewise linear curve: 0–0.5 fraction: 135→90, 0.5–1: 90→45
  let angleDeg = 90;
  if (fraction <= 0.5) {
    angleDeg = 135 - fraction * 2 * 45; // 0 → 0.5 fraction maps 135 → 90
  } else {
    angleDeg = 90 - (fraction - 0.5) * 2 * 45; // 0.5 →1 maps 90→45
  }

  const angleRad = (angleDeg * Math.PI) / 180;
  const sunX = centerX + radius * Math.cos(angleRad);
  const sunY = centerY - radius * Math.sin(angleRad);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* Sun Path */}
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "180px",
          background: "#222",
          borderRadius: "10px",
        }}
      >
        {/* House at center */}
        <div
          style={{
            position: "absolute",
            left: `${centerX - 20}px`,
            top: `${centerY - 20}px`,
            zIndex: 1,
          }}
        >
          <AiFillHome size={40} color="white" />
        </div>

        {/* Sun */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "orange",
            boxShadow: "0 0 20px rgba(255,165,0,0.8)",
            left: `${sunX - 10}px`,
            top: `${sunY - 10}px`,
            transition: "all 1s linear",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

export default SolarSunPath;