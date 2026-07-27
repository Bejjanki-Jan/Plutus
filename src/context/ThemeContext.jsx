import { createContext, useContext, useState, useEffect } from "react";

const themes = {
  Midnight: {
    name: "Midnight",
    primary: "#4a5568",
    secondary: "#2d3748",
    primaryRgb: "74, 85, 104",
    secondaryRgb: "45, 55, 72",
    accent: "#f7fafc",
    bgGradientStart: "#1a1c1eff",
    bgGradientEnd: "#2d3239ff",
  },
  Slate: {
    name: "Slate",
    primary: "#7c93c3",
    secondary: "#5a7ab8",
    primaryRgb: "124, 147, 195",
    secondaryRgb: "90, 122, 184",
    accent: "#e8edf5",
    bgGradientStart: "#0a0f1a",
    bgGradientEnd: "#131a2b",
  },
  Indigo: {
    name: "Indigo",
    primary: "#667eea",
    secondary: "#764ba2",
    primaryRgb: "102, 126, 234",
    secondaryRgb: "118, 75, 162",
    accent: "#a5b4fc",
    bgGradientStart: "#1e1e37ff",
    bgGradientEnd: "#00081fff",
  },
  Emerald: {
    name: "Emerald",
    primary: "#77c1a8ff",
    secondary: "#a8e7d3ff",
    primaryRgb: "16, 185, 129",
    secondaryRgb: "5, 150, 105",
    accent: "#6ee7b7",
    bgGradientStart: "#1a2e1a",
    bgGradientEnd: "#163e2a",
  },
  Rose: {
    name: "Rose",
    primary: "#9F1239",
    secondary: "#881337",
    primaryRgb: "159, 18, 57",
    secondaryRgb: "136, 19, 55",
    accent: "#FB7185",
    bgGradientStart: "#500724",
    bgGradientEnd: "#9F1239",
  },
  Amber: {
    name: "Amber",
    primary: "#c5baa6ff",
    secondary: "#d97706",
    primaryRgb: "245, 158, 11",
    secondaryRgb: "217, 119, 6",
    accent: "#d5a401ff",
    bgGradientStart: "#2e2a1a",
    bgGradientEnd: "#3e3016",
  },
  Cyan: {
    name: "Cyan",
    primary: "#03cef2ff",
    secondary: "#0891b2",
    primaryRgb: "6, 182, 212",
    secondaryRgb: "8, 145, 178",
    accent: "#026875ff",
    bgGradientStart: "#1a2a2e",
    bgGradientEnd: "#00191cff",
  },
  Purple: {
    name: "Purple",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    primaryRgb: "139, 92, 246",
    secondaryRgb: "124, 58, 237",
    accent: "#c4b5fd",
    bgGradientStart: "#1f1a2e",
    bgGradientEnd: "#2a163e",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem("plutus-theme") || "Indigo";
  });

  const theme = themes[themeName] || themes.Indigo;

  useEffect(() => {
    localStorage.setItem("plutus-theme", themeName);

    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-primary-rgb", theme.primaryRgb);
    root.style.setProperty("--color-secondary-rgb", theme.secondaryRgb);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--bg-gradient-start", theme.bgGradientStart);
    root.style.setProperty("--bg-gradient-end", theme.bgGradientEnd);
  }, [themeName, theme]);

  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { themes };
