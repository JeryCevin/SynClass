import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Kita arahkan langsung ke folder app (tanpa src)
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Tambahkan ini jaga-jaga file ada di root
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;