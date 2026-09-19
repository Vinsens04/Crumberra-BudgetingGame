import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cookie: "#E7A84B",
        dough: "#FFF3D6",
        chocolate: "#5B321E",
        strawberry: "#F47C8C",
        mint: "#7CC9A5",
        blueberry: "#6675C8",
      },
      boxShadow: {
        dough: "0 10px 0 #DDBF91, 0 18px 35px rgba(91,50,30,.14)",
        button: "0 6px 0 #9D642C, 0 12px 24px rgba(91,50,30,.16)",
      },
      fontFamily: {
        display: ["Fredoka Variable", "Arial Rounded MT Bold", "sans-serif"],
        body: ["Nunito Variable", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
