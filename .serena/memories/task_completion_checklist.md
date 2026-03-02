# Task completion checklist for this project

When finishing code changes, run:
1. `npm run lint`
2. `npm run build`

If UI behavior changed, also run:
- `npm run dev` and manually verify affected pages/routes.

There is currently no explicit test script in `package.json`; rely on lint + build + targeted manual verification unless a future test setup is added.