import { createContext, useContext } from "react";

export type Theme = "light" | "dark";
export type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
