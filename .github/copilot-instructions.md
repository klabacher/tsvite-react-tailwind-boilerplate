# Copilot Instructions for react-vite-starter-kit

## Project Overview

This is a CLI scaffolding tool that generates React + Vite projects with customizable features. It's built with:

- **Ink** - React-based terminal UI framework for the interactive wizard
- **Commander** - CLI argument parsing
- **TypeScript** - Strict typing throughout

The CLI is published to npm and run via `npx react-vite-starter-kit [project-name]`.

## Architecture

### Core Components

```
src/
├── app.tsx           # Main Ink wizard orchestrating step components
├── main.ts           # Commander CLI entry point
├── components/       # Ink UI components for each wizard step
├── config/           # Static config: templates, dependencies, testProfiles
├── logics/           # Core logic engines
│   ├── ProjectCreator.ts   # Orchestrates project generation
│   ├── TemplateEngine.ts   # Handlebars-like template processor
│   ├── TemplateLogic.ts    # Template file reading/fallback generators
│   ├── TestGenerator.ts    # Test file generation based on profiles
│   └── PackageJsonLogic.ts # package.json generation
├── types/            # TypeScript interfaces (FeatureFlags, ProjectConfig, etc.)
└── utils/            # Validation, version checks
```

### Template System

Templates use a custom Handlebars-like syntax processed by `TemplateEngine`:

- `{{#if features.redux}}...{{/if}}` - Conditional blocks
- `{{#each array}}...{{/each}}` - Iteration with `{{this}}`, `{{@index}}`
- `{{variable}}` - Variable interpolation
- Template files are in `templates/dynamic/*.template`

### Feature Flags Pattern

All optional features are controlled via `FeatureFlags` interface in `src/types/index.ts`:

```typescript
interface FeatureFlags {
  typescript: boolean; // Always true
  tailwindcss: boolean;
  redux: boolean;
  reactRouter: boolean;
  i18n: boolean;
  eslint: boolean;
  prettier: boolean;
  husky: boolean;
  githubActions: boolean;
  vscode: boolean;
  testing: boolean;
  testProfile?: TestProfile;
}
```

When adding a new feature:

1. Add to `FeatureFlags` interface
2. Add to `featureDescriptions` in `config/templates.ts`
3. Add dependencies in `config/dependencies.ts`
4. Add generation logic in `ProjectCreator.ts`
5. Create templates in `templates/dynamic/`

## Key Patterns

### Wizard State Machine

The wizard in `app.tsx` uses React state with a `WizardStep` type:

```typescript
type WizardStep =
  | 'welcome'
  | 'project-name'
  | 'template-select'
  | 'feature-select'
  | 'test-profile-select'
  | 'package-manager'
  | 'git-init'
  | 'summary'
  | 'creating'
  | 'complete'
  | 'error';
```

### Test Profiles

Testing setup is tiered via profiles (bare → minimum → standard → advanced → complete) defined in `config/testProfiles.ts`. Each profile specifies coverage thresholds and which test types to include.

### ESM with .js Extensions

All imports use `.js` extensions (`import { X } from './module.js'`) for ESM compatibility. This is required for the compiled output.

## Development Commands

```bash
npm run dev          # Run CLI in development (tsx)
npm run build        # Build with tsup
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run lint         # ESLint check
npm run typecheck    # TypeScript validation
```

## Testing

Tests are in `tests/` directory, run with Vitest. Test pure logic functions - avoid testing Ink components directly.

Example test pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { validateProjectName } from '../src/utils/validation';

describe('validateProjectName', () => {
  it('should accept valid npm package names', () => {
    expect(validateProjectName('my-app').valid).toBe(true);
  });
});
```

## Adding New Features

1. **Config**: Add to `FeatureFlags` type and `featureDescriptions`
2. **Dependencies**: Add to `featureDependencies` in `config/dependencies.ts`
3. **Generation**: Add generator function in `ProjectCreator.ts` (follow `generateEslintConfig` pattern)
4. **Templates**: Create `.template` files in `templates/dynamic/` using the conditional syntax
5. **Tests**: Add tests for any new logic in `tests/`

## Code Style

- Use functional components for Ink UI
- Prefer explicit typing over inference for public APIs
- Use `async/await` for file operations
- Follow existing patterns for consistency (e.g., generator functions return content strings)
