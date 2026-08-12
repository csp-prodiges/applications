/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        icc: {
          purple: "#3D1856",
          purpledark: "#270F38",
          purplelight: "#6B3FA0",
          lilac: "#EDE3F5",
          gold: "#D9A62E",
          goldlight: "#F2C94C",
          ink: "#1F1233",
          slate: "#655F78",
          mist: "#F7F4FB",
          cream: "#FBF8F2",
          red: "#E0332F",
          blue: "#2B7FD6",
          green: "#3FA64B",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(61, 24, 86, 0.18)",
        card: "0 2px 12px -4px rgba(61, 24, 86, 0.12)",
        lift: "0 12px 40px -12px rgba(61, 24, 86, 0.28)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
