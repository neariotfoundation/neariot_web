module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        darkpurple: "#703eb8",
        purple: {
          DEFAULT: "#8a64c9",
          light: "#dfd4ee",
          dark: "#703eb8",
          lighter:"#c0acde"
        },
        lightpurple: "#dfd4ee",
      },
    },
  },
  plugins: [],
};
