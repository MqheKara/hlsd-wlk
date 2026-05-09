/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Roasted Bean: classic, warm, refined
        rb_serif: ['"Cormorant Garamond"', 'serif'],
        rb_sans: ['"Inter"', 'sans-serif'],
        rb_script: ['"Caveat"', 'cursive'],

        // Hillside Walk: modern, airy, sophisticated
        hw_display: ['"Fraunces"', 'serif'],
        hw_sans: ['"Manrope"', 'sans-serif'],

        // Sushi: minimalist Japanese-inspired
        sushi_serif: ['"Noto Serif JP"', 'serif'],
        sushi_sans: ['"Noto Sans JP"', 'sans-serif'],

        // Beauty: feminine elegance
        beauty_display: ['"Cormorant Garamond"', 'serif'],
        beauty_sans: ['"Jost"', 'sans-serif'],

        // Bakery: playful and sweet
        bakery_display: ['"Pacifico"', 'cursive'],
        bakery_sans: ['"Quicksand"', 'sans-serif'],
      },
      colors: {
        rb: {
          coffee: '#3B2417',
          espresso: '#5C3A21',
          mocha: '#6F4E37',
          cream: '#F5E6D3',
          milk: '#FAF3E7',
          caramel: '#C9A87C',
          accent: '#8B4513',
        },
        hw: {
          forest: '#2F3E2A',
          sage: '#7C8B5C',
          olive: '#5C6B4A',
          terracotta: '#C56B4D',
          sand: '#E8D5B7',
          cream: '#F5EFE3',
          stone: '#5A5650',
        },
        sushi: {
          ink: '#0E0E0E',
          paper: '#F4F1EA',
          vermillion: '#B73225',
          gold: '#C9A85B',
          stone: '#5A5650',
        },
        beauty: {
          rose: '#F8C8DC',
          blush: '#FCE4EC',
          gold: '#B76E79',
          pearl: '#FAF6F2',
          plum: '#5A2A4A',
          cream: '#FFF5F8',
        },
        bakery: {
          buttercream: '#FFF5E1',
          strawberry: '#F4A6A6',
          mint: '#B6E3D4',
          chocolate: '#6B4226',
          vanilla: '#FBE7C6',
          frosting: '#FCE4EC',
          sprinkle: '#F7B5CA',
        },
      },
      animation: {
        'steam': 'steam 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'fall': 'fall 12s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) scaleX(1.4)', opacity: '0.4' },
          '100%': { transform: 'translateY(-40px) scaleX(2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
