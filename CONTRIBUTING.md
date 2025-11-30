# Contributing to react-vite-starter-kit

Thank you for your interest in contributing to react-vite-starter-kit. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Branch Naming](#branch-naming)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Review](#code-review)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your changes
5. Make your changes and commit them
6. Push to your fork and submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/react-vite-starter-kit.git
cd react-vite-starter-kit

# Add upstream remote
git remote add upstream https://github.com/klabacher/react-vite-starter-kit.git

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify setup
npm run test
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run CLI in development mode with tsx |
| `npm run build` | Build the CLI with tsup |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Code Style

This project uses ESLint and Prettier for code formatting and linting.

### General Guidelines

- Use TypeScript for all new code
- Follow the existing code patterns and conventions
- Use meaningful variable and function names
- Keep functions focused and small
- Add comments only when necessary to explain complex logic
- Use explicit typing for public APIs

### File Naming

- Use camelCase for file names (e.g., `projectCreator.ts`)
- Use PascalCase for React component files (e.g., `WelcomeScreen.tsx`)
- Use `.ts` for TypeScript files and `.tsx` for React components

### Imports

- Use `.js` extensions in imports for ESM compatibility
- Group imports: external packages first, then internal modules
- Sort imports alphabetically within groups

## Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `build` | Changes that affect the build system or external dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |

### Examples

```
feat(templates): add Docker support to full-pack template

fix(cli): resolve validation error for scoped package names

docs(readme): add troubleshooting section

test(validation): add tests for edge cases in project name validation
```

## Branch Naming

Use the following branch naming convention:

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<description>` | `feature/add-docker-support` |
| Bug fix | `fix/<description>` | `fix/validation-error` |
| Documentation | `docs/<description>` | `docs/update-readme` |
| Refactor | `refactor/<description>` | `refactor/simplify-template-engine` |
| Test | `test/<description>` | `test/add-integration-tests` |

## Pull Request Process

1. **Update your fork**: Before starting work, sync your fork with upstream:
   ```bash
   git fetch upstream
   git checkout dev
   git merge upstream/dev
   ```

2. **Create a branch**: Create a new branch from `dev`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**: Implement your changes following the code style guidelines.

4. **Test**: Run all tests and ensure they pass:
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```

5. **Commit**: Commit your changes using conventional commit format.

6. **Push**: Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create PR**: Open a pull request against the `dev` branch of the main repository.

### PR Requirements

- Fill out the pull request template completely
- Ensure all CI checks pass
- Include tests for new functionality
- Update documentation if necessary
- Keep changes focused and atomic

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in the `tests/` directory
- Use descriptive test names that explain the expected behavior
- Test edge cases and error conditions
- Mock external dependencies when appropriate

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../src/module.js';

describe('functionToTest', () => {
  it('should handle valid input correctly', () => {
    const result = functionToTest('valid-input');
    expect(result).toBe(expectedValue);
  });

  it('should throw error for invalid input', () => {
    expect(() => functionToTest('')).toThrow();
  });
});
```

## Code Review

All pull requests require review before merging.

### Review Criteria

- Code follows project conventions and style guidelines
- Changes are well-tested
- Documentation is updated if needed
- Commit messages follow conventional commits
- No security vulnerabilities introduced
- Performance impact is acceptable

### Responding to Feedback

- Address all review comments
- Explain your reasoning if you disagree with feedback
- Request re-review after making changes

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Open a new discussion for general questions
3. Open an issue for specific problems

Thank you for contributing!
