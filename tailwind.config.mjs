module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'stardew-brown': '#5a4a32',
        'stardew-cream': '#f8f4e8',
        'stardew-green': '#8ba58d',
        'stardew-dark-green': '#7a947c',
        'stardew-border': '#7a6a52',
      },
      backgroundImage: {
        'spring-pattern': "url('/backgrounds/spring.jpg')",
        'summer-pattern': "url('/backgrounds/summer.jpg')",
        'fall-pattern': "url('/backgrounds/fall.jpg')",
        'winter-pattern': "url('/backgrounds/winter.jpg')",
    },
    },
  },
  plugins: [],
}