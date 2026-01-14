# Repository Guidelines

This document provides contributor guidelines for the **FridgeCookAPI** project — a NestJS-based REST API for recipe and ingredient management.

## Project Structure

```
FridgeCookAPI/
├── src/                  # Application source code
│   ├── main.ts           # Application entry point
│   ├── app.module.ts     # Root module
│   ├── prisma.service.ts # Database service
│   ├── recipes/          # Recipes module (controller, service, DTOs)
│   ├── ingredients/      # Ingredients module
│   ├── diets/            # Diets module
│   ├── entities/         # Shared entity definitions
│   └── types/            # TypeScript type definitions
├── test/                 # End-to-end tests
├── prisma/               # Prisma schema and migrations
├── generated/            # Auto-generated Prisma client
└── dist/                 # Compiled output (do not edit)
```

## Build, Test & Development Commands

| Command             | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start dev server with hot reload         |
| `npm run build`     | Compile TypeScript to `dist/`            |
| `npm run start`     | Start the compiled application           |
| `npm run start:prod`| Run production build                     |
| `npm test`          | Run unit tests with Jest                 |
| `npm run test:e2e`  | Run end-to-end tests                     |
| `npm run test:cov`  | Run tests with coverage report           |
| `npm run lint`      | Lint and auto-fix code                   |
| `npm run format`    | Format code with Prettier                |

## Coding Style & Conventions

- **Language**: TypeScript (ES2023 target)
- **Formatting**: Prettier with single quotes and trailing commas
- **Linting**: ESLint with TypeScript and Prettier plugins
- **Naming**:
  - Files: `kebab-case` (e.g., `recipes.controller.ts`)
  - Classes: `PascalCase` (e.g., `RecipesService`)
  - Variables/Functions: `camelCase`
- **Module structure**: Each feature has its own folder with `controller`, `service`, `module`, and `dto` files

Run `npm run lint` and `npm run format` before committing.

## Testing Guidelines

- **Framework**: Jest
- **Unit tests**: Place in `src/` alongside source files as `*.spec.ts`
- **E2E tests**: Place in `test/` directory, named `*.e2e-spec.ts`
- **Test naming**: Use descriptive `describe` and `it` blocks (e.g., `it('should return all recipes')`)

Ensure tests pass with `npm test` before submitting a PR.

## Commit & Pull Request Guidelines

**Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Examples:
feat(recipes): add filtering by ingredient
fix(auth): resolve token expiration issue
chore(deps): update prisma to v7.2.0
```

**Pull Requests**:
- Provide a clear description of the change
- Reference related issues (e.g., `Fixes #12`)
- Ensure CI checks (lint, tests) pass
- Keep PRs focused and atomic
