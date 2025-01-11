"use client";
import { FaSun } from "react-icons/fa6";
import { BsMoonStarsFill } from "react-icons/bs";
import { useTheme } from "./ThemeProvider";
function Thememode() {
	const { theme, toggleTheme } = useTheme();
	return (
		<a onClick={toggleTheme} className="button ml-auto">
			{theme === "dark" ? <FaSun /> : <BsMoonStarsFill />}
		</a>
	);
}

export default Thememode;
