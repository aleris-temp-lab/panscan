import type { Config } from 'tailwindcss'

// Aleris Brand Colors (from Brand Guidelines 2025)
const colors = {
  // Primary colors
  petrol: {
    DEFAULT: '#004851',
    80: '#4F868E',
    60: '#7FA9AE',
    40: '#ABC7C9',
  },
  orange: {
    DEFAULT: '#F58C61',
    80: '#FFBE9F',
    60: '#FAAA8D',
    40: '#FBD1C0',
  },
  sand: {
    DEFAULT: '#F2ECE4',
    100: '#D9B48F',
    60: '#E7CEB5',
  },
  slate: {
    DEFAULT: '#D7D2CB',
  },
}

export const alerisPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Brand colors
        petrol: colors.petrol,
        orange: colors.orange,
        sand: colors.sand,
        slate: colors.slate,
        // Semantic mappings
        primary: colors.petrol,
        accent: colors.orange,
        background: colors.sand.DEFAULT,
        surface: '#FFFFFF',
        muted: colors.slate.DEFAULT,
        // Text colors
        foreground: colors.petrol.DEFAULT,
        'foreground-muted': colors.petrol[60],
      },
      fontFamily: {
        sans: ['Museo Sans', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 72, 81, 0.08)',
        medium: '0 4px 16px rgba(0, 72, 81, 0.12)',
      },
    },
  },
}

export default alerisPreset
