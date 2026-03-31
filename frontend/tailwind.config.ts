import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        }
      }
    }
  }
}