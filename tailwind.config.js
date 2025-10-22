/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'latte-bg': 'var(--latte-bg)',
        'latte-fg': 'var(--latte-fg)',
        'latte-muted': 'var(--latte-muted)',
        'latte-border': 'var(--latte-border)',
        'latte-card': 'var(--latte-card)',
        'latte-accent': 'var(--latte-accent)',
        'latte-text-muted': 'var(--latte-text-muted)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
