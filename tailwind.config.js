module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ["Noto Sans", "sans"],
      arial: ["arial"],
    },
    colors: {
      background: "#1B2837",
      primary: "#214B6B",
      secondary: "#4D6E95",
      card: "#17202D",
      text: "#FFFFFF",
    },
    extend: {
      borderRadius: {
        primary: "30px",
        secondary: "20px",
      },
      fontSize: {
        heading: "40px",
      },
    },
  },
  plugins: [require("tailwindcss-skip-link")()],
};
