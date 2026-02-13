import type { Config } from 'tailwindcss'
import { alerisPreset } from '@panscan/ui/tailwind.config'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [alerisPreset as Config],
  plugins: [],
}

export default config
