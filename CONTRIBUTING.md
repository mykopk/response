# Contributing

Thank you for considering contributing to **@myko.pk/response** — we appreciate every bug report, documentation fix, feature suggestion, and pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project is committed to providing a welcoming and inclusive experience for everyone. Be respectful, constructive, and professional. Harassment, trolling, and personal attacks will not be tolerated.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/mykopk/response.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

## Development Setup

```bash
# Install dependencies
npm install

# Build the package (CJS + ESM + DTS)
npm run build

# Watch mode
npm run dev
```

## Project Structure

```
src/
├── builders/       # ResponseBuilder and related builder utilities
├── filters/        # NestJS exception filters (Global, Validation, Http, Database, Auth)
├── interceptors/   # ResponseInterceptor for automatic ApiResponse wrapping
├── index.ts        # Public API exports
├── response.constants.ts
├── response.module.ts
├── types.ts
└── views-path.ts
```

## Coding Standards

- **Language**: TypeScript with strict mode
- **Formatting**: Follow the existing code style
- **Typing**: Prefer explicit interfaces over inline types for public APIs
- **Naming**:
  - Classes: PascalCase
  - Functions/variables: camelCase
  - Files: kebab-case
  - Constants: UPPER_SNAKE_CASE
- **Exports**: Named exports only (no default exports)
- **Comments**: JSDoc for all public APIs; minimal inline comments
- **Error handling**: Use `ApiResponse` envelope — never throw raw exceptions from response utilities

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

- Write tests for every new feature and bug fix
- Use Vitest (the project's test runner)
- Place tests next to the source file as `*.test.ts`

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run `npm run build && npm test` — all tests must pass
3. Keep PRs focused: one feature or fix per PR
4. Write a clear PR description explaining what and why
5. Link any related issues

### PR title format

```
feat: add [feature]
fix: fix [bug description]
docs: update [documentation]
chore: [maintenance task]
refactor: [refactoring description]
test: add [test description]
```

## Reporting Bugs

Open an issue at https://github.com/mykopk/response/issues with:

- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Node.js version
- Minimal reproduction example if possible

## Feature Requests

Open an issue with the `enhancement` label. Include:

- What problem does it solve?
- How would the API look?

---

By contributing, you agree that your contributions will be licensed under the MIT License.
