# Coding conventions observed

- Language: TypeScript + TSX with React functional components.
- Module system: ESM imports/exports.
- Formatting style in source files:
  - Double quotes for strings.
  - Semicolons used consistently.
  - 2-space indentation in config and TS/TSX files.
- Linting:
  - ESLint flat config in `eslint.config.js`.
  - TypeScript recommended rules enabled.
  - `@typescript-eslint/no-explicit-any` is set to `error`.
  - React hooks lint rules enabled.
- Project structure conventions:
  - Domain hooks in `src/hooks` (e.g., `useProducts`, `useCreateProduct`).
  - API interaction encapsulated in `src/services`.
  - Domain types in `src/types`.
  - Feature/UI components grouped under `src/components`.
- Routing pattern:
  - Protected app routes nested under `PrivateRoute` and `AppLayout` in `src/App.tsx`.