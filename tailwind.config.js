/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode toggling via the 'class' strategy
  theme: {
    extend: {

      colors: {
        darkCharcoal: '#2D2D2D', // Primary dark color
        offWhite: '#F5F5F5', // Primary light color
        emeraldGreen: '#50C878', // Accent color for buttons and highlights
        royalBlue: '#4169E1', // Secondary accent color
        lightGray: '#E0E0E0', // Text color for dark mode
        backgroundLight: '#F7F8FA', // Light mode background
        backgroundDark: '#1A1A1A', // Dark mode background
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'], // Primary font for headings
        secondary: ['Roboto', 'sans-serif'], // Secondary font for body text
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out', // Smooth fade-in animation
      },
      spacing: {
        128: '32rem', // Large custom spacing value
        144: '36rem', // Extra large custom spacing value
      },
      borderRadius: {
        xl: '1rem', // Larger border radius for modern design
        '2xl': '1.5rem', // Extra large border radius
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for cards
        button: '0 4px 10px rgba(80, 200, 120, 0.4)', // Shadow for buttons
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      backdropBlur: {
        xs: '2px'},
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
    },
  },
};