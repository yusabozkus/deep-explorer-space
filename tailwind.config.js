import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		'./src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'body': '#161719',
				'primary': '#FF6500',
				'card': '#232524',
				'gray': '#d6d6d6',
				'border': "#353535",
				"input": "#232524",
				"default": "#232524",
				"default-100": "#2b2b2b",
				"default-200": "#2b2b2b"
			},
			fontFamily: {
				poppins: ["Poppins", "sans-serif"]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	darkMode: ["class", "class"],
	darkMode: "class",
	plugins: [nextui(), require("tailwindcss-animate")],
}