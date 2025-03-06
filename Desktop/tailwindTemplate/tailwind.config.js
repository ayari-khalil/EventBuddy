/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#2a2a2a", // Couleur de fond du header
        secondary: "#333", // Couleur de fond des cartes de jeux
        accent: "#4CAF50", // Couleur des boutons
        background: "#1a1a1a", // Couleur de fond du body
        text: "#ffffff", // Couleur du texte
      },
    },
  },
  plugins: [],
};
