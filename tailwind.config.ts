import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at 20% 20%, #f0f9ff, #f8fafc 40%, #eef2ff 80%)',
        'linear-soft': 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config

