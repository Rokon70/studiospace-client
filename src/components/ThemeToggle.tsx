"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

// Challenge 3: light / dark theme
export default function ThemeToggle() {
  const [theme, setTheme] = useState("studiolight");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "studiolight");
  }, []);

  const toggle = () => {
    const next = theme === "studiodark" ? "studiolight" : "studiodark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle" aria-label="Toggle light and dark theme">
      {theme === "studiodark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
    </button>
  );
}
