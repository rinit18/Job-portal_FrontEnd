/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mine-shaft': {
          '50': 'rgb(var(--mine-shaft-50) / <alpha-value>)',
          '100': 'rgb(var(--mine-shaft-100) / <alpha-value>)',
          '200': 'rgb(var(--mine-shaft-200) / <alpha-value>)',
          '300': 'rgb(var(--mine-shaft-300) / <alpha-value>)',
          '400': 'rgb(var(--mine-shaft-400) / <alpha-value>)',
          '500': 'rgb(var(--mine-shaft-500) / <alpha-value>)',
          '600': 'rgb(var(--mine-shaft-600) / <alpha-value>)',
          '700': 'rgb(var(--mine-shaft-700) / <alpha-value>)',
          '800': 'rgb(var(--mine-shaft-800) / <alpha-value>)',
          '900': 'rgb(var(--mine-shaft-900) / <alpha-value>)',
          '950': 'rgb(var(--mine-shaft-950) / <alpha-value>)',
        },
        'bright-sun': {
          '50': 'rgb(var(--bright-sun-50) / <alpha-value>)',
          '100': 'rgb(var(--bright-sun-100) / <alpha-value>)',
          '200': 'rgb(var(--bright-sun-200) / <alpha-value>)',
          '300': 'rgb(var(--bright-sun-300) / <alpha-value>)',
          '400': 'rgb(var(--bright-sun-400) / <alpha-value>)',
          '500': 'rgb(var(--bright-sun-500) / <alpha-value>)',
          '600': 'rgb(var(--bright-sun-600) / <alpha-value>)',
          '700': 'rgb(var(--bright-sun-700) / <alpha-value>)',
          '800': 'rgb(var(--bright-sun-800) / <alpha-value>)',
          '900': 'rgb(var(--bright-sun-900) / <alpha-value>)',
          '950': 'rgb(var(--bright-sun-950) / <alpha-value>)',
        },
    
      },
      keyframes: {
        'option-animation': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'option-animation': 'option-animation 200ms ease forwards',
      },
    },
    screens: {
      'xsm': '350px',
      'xs': '476px',
      'sm': '640px',
      'md': '768px',
      'bs': '900px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',


      '2xl-mx': { 'max': '1535px' },
      'xl-mx': { 'max': '1279px' },
      'lg-mx': { 'max': '1023px' },
      'bs-mx': { 'max': '900px' },
      'md-mx': { 'max': '767px' },
      'sm-mx': { 'max': '639px' },
      'xs-mx': { 'max': '475px' },
      'xsm-mx': { 'max': '349px' }
    }
  },
  plugins: [],
}