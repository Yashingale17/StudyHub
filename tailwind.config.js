module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'custom-xl': '1200px',
        'custom-lg': '880px',
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
