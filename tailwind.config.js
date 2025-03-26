// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)', 
          },
          text: 'rgb(var(--color-text) / <alpha-value>)',
          background: {
            dark: 'rgb(var(--color-background-dark) / <alpha-value>)',
            light: 'rgb(var(--color-background-light) / <alpha-value>)'
          },
          border: 'rgb(var(--color-border) / <alpha-value>)',
          overlay: 'rgb(var(--color-overlay) / <alpha-value>)'
        },
        fontFamily: {
          base: ['var(--font-base)'],
          heading: ['var(--font-heading)']
        }
      },
    },
    plugins: [],
  }