# Repository Guidelines

## Project Structure & Module Organization
This repository is a small monorepo with `frontend/`, `backend/`, `shared/`, and `docs/`.

- `frontend/src` contains the React Router app, organized by `app/`, `pages/`, `widgets/`, `features/`, `entities/`, and `shared/`.
- `backend/src` contains the Node/TypeScript API, split into `modules/`, `core/`, `config/`, `shared/`, and `scripts/`.
- `frontend/build` and `backend/dist` are generated outputs. Do not edit them directly.
- Environment examples live at the root in `.env.example`; local overrides belong in `.env`.

## Build, Test, and Development Commands
- `npm run dev` runs frontend and backend together from the repo root.
- `npm run frontend:dev` or `npm run backend:dev` starts one side only.
- `npm run lint` runs ESLint across both packages.
- `npm run format` applies Prettier across both packages.
- `cd frontend && npm run build` builds the client and server bundle for the UI.
- `cd frontend && npm run typecheck` generates route types and runs TypeScript checks.
- `cd backend && npm run build` compiles the API to `backend/dist`.
- `cd backend && npm run db:migrate` or `npm run db:rollback` applies or reverts database migrations.

## Coding Style & Naming Conventions
Use TypeScript throughout. Follow the existing Prettier style: two-space indentation, semicolons, and single quotes in TS/TSX files. Keep ESLint clean before opening a PR.

- React components and providers use PascalCase file names such as `TaskList.tsx` and `AntdProvider.tsx`.
- Backend module files use lowercase dotted names such as `tasks.service.ts`, `auth.routes.ts`, and `postgres.config.ts`.
- Prefer path aliases already used in the frontend, for example `@/shared/ui/TaskCard`.

## Testing Guidelines
There is no automated test suite configured yet. Until one is added, treat `npm run lint`, frontend `npm run typecheck`, and backend `npm run build` as the minimum validation set. When adding tests later, place them next to the feature they cover and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Git history is brief and uses short, imperative subjects such as `init` and `add react-query & api`. Keep commits focused and descriptive.

PRs should include a short summary, affected areas (`frontend`, `backend`, or both), setup or migration notes, and screenshots for visible UI changes. Link the related issue when one exists.

## Security & Configuration Tips
Never commit real secrets from `.env`. Keep new environment variables documented in `.env.example`, and update both runtime code and validation schemas when config changes.
