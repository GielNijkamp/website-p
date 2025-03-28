// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      spacing: {
        'header': 'var(--header-height, 80px)',
        'header-scrolled': 'var(--header-height-scrolled, 60px)',
      },
      minHeight: {
        'screen-dynamic': 'calc(100vh - var(--header-height, 80px))',
        'screen-dynamic-scrolled': 'calc(100vh - var(--header-height-scrolled, 60px))'
      },
      zIndex: {
        'header': '1000',
        'under-header': '10',
        'background': '-10'
      },
      transitionProperty: {
        'header': 'height, background-color, box-shadow'
      }
    },
  },
  plugins: [],
}