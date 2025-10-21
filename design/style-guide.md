# Warm Minimal Lab — Implementation Style Guide (Vue)

> **Scope**: Single theme only (no dark/light toggle). Target: Vue 3 + Vite + Tailwind CSS + Pinia (state) + Vue Router. Motion via `@vueuse/motion`. Icons via `lucide-vue-next`. Forms via native inputs; accessibility first.

## 1) Design Tokens (CSS Variables)

Place in `src/assets/theme.css` and import once in `main.ts`.

```css
:root {
  /* Brand */
  --latte-bg: #f5ede2; /* Crema */
  --latte-fg: #3b2f2f; /* Espresso */
  --latte-muted: #e8d9c7; /* Paper/Oat */
  --latte-accent: #1c9a8c; /* Matcha‑Teal */
  --latte-text-muted: #6b7280; /* Lab Gray */
  --latte-border: #e5ddd1;
  --latte-card: #fffdf9;

  /* Semantic */
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;

  /* Typography */
  --font-sans:
    Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Helvetica Neue,
    Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
  --font-display: 'Sora', var(--font-sans);
  --font-mono:
    'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;

  /* Radii & Shadow */
  --radius: 1rem; /* rounded-2xl */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
}

html,
body {
  background: var(--latte-bg);
  color: var(--latte-fg);
}
```

**Font loading**: In `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@600;700&display=swap"
  rel="stylesheet"
/>
```

## 2) Tailwind Setup

`tailwind.config.js`

```js
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
```

`src/assets/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base tokens */
@import './theme.css';

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--latte-accent);
  outline-offset: 2px;
}

/* Specimen label */
.label-specimen {
  @apply uppercase tracking-wider text-xs text-fg/70;
}
```

## 3) Typographic Scale & Usage

- Display/H1: `text-3xl font-display font-semibold`
- H2: `text-2xl font-display font-semibold`
- H3: `text-xl font-semibold`
- Body: `text-base`
- Small: `text-sm text-textmuted`
- Labels: `.label-specimen`

Guidelines: keep line-length ~ 45–65ch; avoid >2 typefaces per screen.

## 4) Core Components (APIs + Class Guidance)

> Component names are PascalCase, props kebab in templates. Each SFC has ARIA, keyboard, and test‑ids.

### 4.1 Button

- **Variants**: `primary`, `secondary`, `ghost`, `destructive`
- **Sizes**: `md` (48px), `sm` (40px)
- **Base classes**: `inline-flex items-center justify-center rounded-2xl font-semibold disabled:opacity-50 active:scale-95 transition`
- **Variants**:
  - Primary: `bg-accent text-white px-4 h-12`
  - Secondary: `bg-card text-fg border border-border px-4 h-12`
  - Ghost: `bg-transparent text-fg/80 px-3 h-10`
  - Destructive: `bg-error text-white px-4 h-12`

### 4.2 Card

- `rounded-2xl border border-border bg-card shadow-sm`
- Use for menu items, orders, passes.

### 4.3 Input / Select / Textarea

- Use `@tailwindcss/forms` defaults.
- Base: `h-12 rounded-xl border-border focus:ring-2 focus:ring-accent`.
- Label uses `.label-specimen` above field.

### 4.4 Badge (Status Chip)

- Base: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs`
- Variants:
  - Neutral: `bg-muted text-fg/80`
  - Ready: `bg-success/15 text-success`
  - Error: `bg-error/15 text-error`

### 4.5 Bottom Nav (3–5 items)

- Container: `fixed bottom-0 inset-x-0 bg-card border-t border-border h-16 flex justify-around`
- Item: `flex flex-col items-center justify-center text-xs text-fg/70 data-[active=true]:text-fg`

### 4.6 Top App Bar

- `sticky top-0 z-20 bg-bg/80 backdrop-blur border-b border-border h-14 px-4 flex items-center justify-between`

### 4.7 Menu Item Card (Orderable)

- Layout: image (56–72px) left, content mid, price right.
- Classes: `grid grid-cols-[72px,1fr,auto] gap-3 p-3`
- Add button: small primary or `+` icon button (touch target ≥44px).

### 4.8 Cart Drawer

- From right, 80vw on mobile.
- Container: `fixed inset-y-0 right-0 bg-card w-[80vw] max-w-[420px] shadow-md border-l border-border`.
- Header: title + close; Body: list; Footer: totals + primary CTA.

### 4.9 Toasts (Optimistic UI)

- Position: top-center on mobile.
- Style: `rounded-xl bg-fg text-white px-4 py-2 shadow-md`
- Success color may use `bg-success text-white`.

### 4.10 Skeletons

- `animate-pulse rounded-lg bg-muted`
- Bars height: 12–16px; card placeholder with aspect‑ratio.

### 4.11 QR Member Pass

- Card: `rounded-2xl border border-border bg-card p-4 grid gap-3`
- QR meaningfully sized (min 180px); textual fallback code below.

### 4.12 Order Status Chip

- States: `Queued` (neutral), `Pulling` (accent), `Ready` (success), `Issue` (error).

## 5) Motion

Library: `@vueuse/motion` (Motion One). Keep durations 120–180ms.

- Add‑to‑cart: scale `1 → 1.02 → 1`. Cart icon translateY `-2px` briefly.
- Drawer: enter `{ x: 100% → 0 }`, exit `{ x: 0 → 100% }`, easing `cubic-bezier(.2,.8,.2,1)`.
- Number tick: odometer via CSS transform with reduced motion fallback.

**Reduced Motion**: respect `@media (prefers-reduced-motion: reduce)`; disable non‑essential animations.

## 6) Accessibility

- Contrast AA or better on all text.
- Tap targets ≥44px.
- Focus visible on all interactive elements (see base CSS).
- Keyboard: Esc closes drawers/modals; trap focus when open.
- ARIA: role="dialog" for drawers; `aria-live="polite"` for toasts; labels for inputs.

## 7) Example SFCs (minimal)

**Button.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md' },
)
const cls = computed(() => [
  'inline-flex items-center justify-center font-semibold rounded-2xl transition active:scale-95 disabled:opacity-50',
  props.size === 'sm' ? 'h-10 px-3' : 'h-12 px-4',
  props.variant === 'primary' && 'bg-accent text-white',
  props.variant === 'secondary' && 'bg-card text-fg border border-border',
  props.variant === 'ghost' && 'bg-transparent text-fg/80',
  props.variant === 'destructive' && 'bg-error text-white',
])
</script>
<template>
  <button :class="cls" :disabled="disabled"><slot /></button>
</template>
```

**Card.vue**

```vue
<template>
  <div class="rounded-2xl border border-border bg-card shadow-sm"><slot /></div>
</template>
```

**Badge.vue**

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{ tone?: 'neutral' | 'ready' | 'error' }>(), {
  tone: 'neutral',
})
</script>
<template>
  <span
    :class="[
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
      props.tone === 'neutral' && 'bg-muted text-fg/80',
      props.tone === 'ready' && 'bg-success/15 text-success',
      props.tone === 'error' && 'bg-error/15 text-error',
    ]"
    ><slot
  /></span>
</template>
```

## 8) Layout Patterns

- **App Shell**: `<TopBar/>` + `<router-view/>` + `<BottomNav/>`.
- **Page Padding**: `px-4` mobile; `max-w-screen-sm mx-auto` for content columns.
- **Grid Lists**: menu uses `grid grid-cols-1 gap-3`.

## 9) Naming & State

- Props: simple, boolean flags for small variants.
- Emit events in kebab case (`update:open`, `add-to-cart`).
- State via Pinia stores: `useCartStore`, `useMemberStore`, `useQueueStore`.

## 10) Microcopy (tone)

- Primary CTA: “Pull a shot” (submit order)
- Re‑order: “Brew again”
- Edit prefs: “Dial in”
- Empty state: “No shots in the queue — perfect time to try the single origin.”

## 11) QA Checklist

- [ ] All components keyboard accessible
- [ ] Focus ring visible on every interactive element
- [ ] Forms have labels and helpful errors
- [ ] Network/loading skeletons present on Menu, Cart, Queue
- [ ] Button/Link distinction respected (navigation vs action)

---

**Hand‑off**: The coding agent can scaffold using these tokens and classes. Start with Button, Card, Badge, TopBar, BottomNav, then MenuItemCard and CartDrawer. Ensure snapshot tests for classes and basic interactions.
