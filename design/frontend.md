You are a senior Vue engineer. Add a Profile page and bottom navigation to the LatteApp customer MVP (no auth, no backend).

############################

## SCOPE

############################

- Add bottom tab navigation with two tabs: **Home** (/) and **Profile** (/profile).
- Implement **ProfilePage** with an editable form:
  - name (text), email (email), preferredDrink (text)
  - “Save” button persists to localStorage via Pinia.
  - Simple success toast (or alert) is fine.
- Keep everything mobile-first and accessible.

############################

## THEME CLASSES (use as-is)

############################

- Card: "rounded-2xl border border-[var(--latte-border)] bg-[var(--latte-card)] shadow-sm"
- Primary button: "inline-flex items-center justify-center rounded-2xl h-12 px-4 font-semibold bg-[var(--latte-accent)] text-white active:scale-95"
- Specimen label: "uppercase tracking-wider text-xs text-[var(--latte-fg)]/70"
- TopBar: "sticky top-0 z-20 bg-[var(--latte-bg)]/80 backdrop-blur border-b border-[var(--latte-border)] h-14 px-4 flex items-center justify-between"
- BottomNav container: "fixed bottom-0 inset-x-0 bg-[var(--latte-card)] border-t border-[var(--latte-border)] h-16 flex justify-around"
- BottomNav item: "flex flex-col items-center justify-center text-xs text-[var(--latte-fg)]/70 data-[active=true]:text-[var(--latte-fg)]"

############################

## FILES TO CREATE/UPDATE

############################

- src/app/routes.ts # add /profile route
- src/app/App.vue # include <BottomNav/> under <router-view/>
- src/components/layout/BottomNav.vue
- src/pages/ProfilePage.vue
- src/components/profile/ProfileForm.vue
- src/stores/profile.ts # Pinia store with localStorage persist
- src/components/ui/Card.vue # reuse if not present

############################

## ROUTES

############################

- "/" -> HomePage (already exists)
- "/profile" -> ProfilePage

############################

## PINIA STORE: profile.ts

############################
State:
name: string
email: string
preferredDrink?: string
Actions:
loadFromLocal()
saveToLocal()
update<K extends keyof State>(key:K, value: State[K])
Persist key: "latte_profile"

On store init, call loadFromLocal().

############################

## BOTTOM NAV

############################
BottomNav.vue:

- Two items: Home, Profile.
- Use <router-link> with `aria-current="page"` when active.
- Add `data-active="true"` on active link for styling.
- Icons optional; use text labels if simpler.
- Ensure it does not overlap content; pages should have `pb-20`.

############################

## PROFILE PAGE + FORM

############################
ProfilePage.vue:

- <TopBar title="Profile" />
- <main class="max-w-screen-sm mx-auto px-4 pb-20 py-4">
  - <h1 class="text-2xl font-display font-semibold mb-3">Profile</h1>
  - <ProfileForm />

ProfileForm.vue:

- Form wrapped in Card.
- Fields:
  - Name (label with specimen class)
  - Email (type=email)
  - Preferred Drink (text)
- Each input: class "h-12 rounded-xl border-[var(--latte-border)] focus:ring-2 focus:ring-[var(--latte-accent)] w-full"
- “Save” button (primary) at bottom; on click:
  - call store.saveToLocal()
  - show `alert("Profile saved")` (temporary)
- Accessibility:
  - <label for=...> with ids
  - Proper input types
  - Pressing Enter in any field submits
