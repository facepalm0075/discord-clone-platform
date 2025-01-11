import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class", // Use 'media' or 'class'
	theme: {
		extend: {
			// Extend your theme here if needed
		},
	},
	plugins: [],
};
export default config;
