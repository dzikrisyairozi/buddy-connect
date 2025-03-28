# Buddy Connect Monorepo

This is a Turborepo-powered monorepo for the Buddy Connect application.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `frontend`: a [Next.js](https://nextjs.org/) app for the Buddy Connect web client
- `backend`: a Firebase Functions backend with Express.js for the Buddy Connect API
- `@buddy-connect/shared`: shared functions
- `@buddy-connect/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@buddy-connect/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Development Tools

This monorepo comes fully configured with the following development tools:

- **Linting**: ESLint is configured for all packages with appropriate presets
- **Formatting**: Prettier with automatic code formatting and Tailwind CSS class sorting
- **Git Hooks**: Husky pre-commit hooks for running lint-staged on changed files
- **Commit Linting**: Commitlint enforces conventional commit messages
- **Continuous Integration**: GitHub Actions workflows for linting, type checking, and building on the main branch

These tools work together to ensure code quality and consistency across the entire codebase. When you commit code:

1. Lint-staged formats and lints only the files you've changed
2. Commitlint ensures your commit messages follow the conventional format
3. Pre-push hooks run all checks before pushing to remote
4. CI validates everything when you push to the main branch

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

This will start:

- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Quality Checks

You can run the following commands to check your code:

```
# Run all checks (type checking, linting, and format checking)
pnpm check-all

# Run individual checks
pnpm type:check
pnpm lint
pnpm format:check

# Format all files
pnpm format
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
