/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'samsung': '28px',
      },
      colors: {
        'synapse-deep': '#020617',
        'synapse-dark': '#0a191e',
        'synapse-surface': '#111d27',
        'synapse-elevated': '#1e293b',
        'synapse-border': 'rgba(45, 212, 191, 0.15)',
        'oneui-text-primary': '#f1f5f9',
        'oneui-text-secondary': '#94a3b8',
        'oneui-text-muted': '#64748b',
        'synapse-aqua': '#2dd4bf',
        'synapse-success': '#10b981',
        'synapse-error': '#f87171',
        'synapse-warning': '#fbbf24',
        'oneui-blue': '#2dd4bf',
        'oneui-bg': '#0a191e',
        'oneui-surface': '#111d27',
        'oneui-border': '#1e2d3d'
      }
    }
  },
  plugins: [],
}
