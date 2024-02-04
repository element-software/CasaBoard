import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'card': "4px 4px 16px 0px rgba(0, 0, 0, 0.60), -4px -4px 16px 0px rgba(255, 255, 255, 0.10)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
