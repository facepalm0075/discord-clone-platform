import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		if (localStorage.getItem("selectedTheme") !== null) {
			const lol = localStorage.getItem("selectedTheme");
			lol === "dark" ? seter("dark") : seter("light");
		}
	}, []);

	const seter = (item: Theme) => {
		document.querySelector("body")?.setAttribute("data-theme", item);
		localStorage.setItem("selectedTheme", item);
		setTheme(item);
	};

	const toggleTheme = () => {
		if (theme == "dark") {
			seter("light");
		} else {
			seter("dark");
		}
	};

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
