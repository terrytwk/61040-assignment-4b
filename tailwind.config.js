/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      borderRadius: { '2xl': 'var(--radius)' },
      boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)' },
      colors: {
        bg: 'var(--latte-bg)',
        fg: 'var(--latte-fg)',
        muted: 'var(--latte-muted)',
        border: 'var(--latte-border)',
        card: 'var(--latte-card)',
        accent: 'var(--latte-accent)',
        textmuted: 'var(--latte-text-muted)',
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
