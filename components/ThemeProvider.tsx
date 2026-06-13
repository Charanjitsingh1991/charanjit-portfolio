"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import SunCalc from "suncalc";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void; auto: boolean }>({
  theme: "dark",
  toggle: () => {},
  auto: true,
});
export const useTheme = () => useContext(Ctx);

function localHourTheme(): Theme {
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [auto, setAuto] = useState(true);

  const apply = useCallback((t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setAuto(false);
      apply(saved);
      return;
    }
    // 1) immediate guess from local clock (reflects visitor's location)
    apply(localHourTheme());

    // 2) refine with real sunrise/sunset if geolocation is granted
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const now = new Date();
            const t = SunCalc.getTimes(now, latitude, longitude);
            const isDay = now >= t.sunrise && now < t.sunset;
            if (localStorage.getItem("theme")) return; // user overrode meanwhile
            apply(isDay ? "light" : "dark");
          } catch {
            /* keep clock-based guess */
          }
        },
        () => {/* denied → keep clock-based guess */},
        { timeout: 6000, maximumAge: 30 * 60 * 1000 }
      );
    }
  }, [apply]);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setAuto(false);
    localStorage.setItem("theme", next);
    apply(next);
  }, [theme, apply]);

  return <Ctx.Provider value={{ theme, toggle, auto }}>{children}</Ctx.Provider>;
}
