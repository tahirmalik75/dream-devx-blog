/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f7f7f5',
          100: '#eeede9',
          200: '#dddbd4',
          300: '#c5c1b8',
          400: '#a8a297',
          500: '#908a7e',
          600: '#7a7268',
          700: '#645e56',
          800: '#524e48',
          900: '#44403b',
          950: '#252320',
        },
        accent: {
          DEFAULT: '#c9452e',
          light:   '#e05a42',
          dark:    '#a63520',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: theme('colors.ink.800'),
            a: { color: theme('colors.accent.DEFAULT'), textDecoration: 'none' },
            'h1,h2,h3,h4': { fontFamily: theme('fontFamily.serif').join(','), color: theme('colors.ink.950') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
