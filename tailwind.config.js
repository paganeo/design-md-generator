/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Obsidian Pro (Default Dark)
        obsidian: {
          bg: '#0D0E12',
          surface: '#161820',
          elevated: '#1E202B',
          border: '#292C3A',
          borderHover: '#3D4155',
          text: '#F1F3F7',
          textMuted: '#8D93A5',
          accent: '#3B82F6',
          accentHover: '#2563EB',
          accentGlow: 'rgba(59, 130, 246, 0.15)',
        },
        // Carbon Slate theme tokens
        carbon: {
          bg: '#0B0F19',
          surface: '#111827',
          elevated: '#1F2937',
          border: '#374151',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
          accent: '#38BDF8',
        },
        // OLED Pure theme tokens
        oled: {
          bg: '#000000',
          surface: '#121214',
          elevated: '#1A1A1E',
          border: '#27272A',
          text: '#FFFFFF',
          textMuted: '#A1A1AA',
          accent: '#60A5FA',
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
