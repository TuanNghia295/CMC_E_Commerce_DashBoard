# CMC_E_Commerce_DashBoard overview

- Purpose: React + TypeScript admin dashboard for e-commerce management.
- Main domains visible in routes/services/hooks: authentication, users, products, categories, banners, and orders.
- App routing is defined in `src/App.tsx` with private/protected routes via `src/PrivateRoute.tsx` and layout in `src/layout/AppLayout.tsx`.
- Data fetching/mutations use TanStack React Query (`QueryClientProvider` in `src/main.tsx`) with domain hooks under `src/hooks` and API services under `src/services`.
- State management also uses Zustand (`src/store/userStore.tsx`).
- UI is component-driven with folders under `src/components` (tables, modals, auth, common/ui widgets).
- Build system: Vite + TypeScript.
- Styling stack: Tailwind CSS (v4 packages present), plus component CSS imports in `src/main.tsx` (Swiper, Flatpickr).