/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        screens: {
            xs: "480px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
        },
        extend: {
            fontFamily: {
                display: ["Space Mono", "monospace"],
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                primary: {
                    50: "#fef7ee",
                    100: "#fdedd6",
                    200: "#fad6ac",
                    300: "#f7b878",
                    400: "#f39142",
                    500: "#f0721d",
                    600: "#e15813",
                    700: "#ba4212",
                    800: "#943616",
                    900: "#782f15",
                },
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-in-left": "slideInLeft 0.5s ease-out",
                float: "float 6s ease-in-out infinite",
                shimmer: "shimmer 1.5s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideInLeft: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
        },
    },
    plugins: [],
};
