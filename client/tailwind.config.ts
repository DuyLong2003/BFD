import type { Config } from "tailwindcss";

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0052CC",
                secondary: "#003EB3",
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};

export default config;