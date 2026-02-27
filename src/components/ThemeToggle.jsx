import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button className="theme-btn" onClick={toggleTheme}>
      {theme === "dark" ? "🌙 Dark" : "☀ Light"}
    </button>
  );
}

export default ThemeToggle;