# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3-beta.1] - 2025-12-02

### Fixed

- **Vite plugins configuration** - Fixed Tailwind CSS v4 styles not loading by moving plugins from `optimizeDeps.rolldownOptions.plugins` to root `plugins` array in `vite.config.ts`

## [0.2.2] - 2025-12-01

### Fixed

- **SVG attributes** - Changed `clip-rule` to `clipRule` and `fill-rule` to `fillRule` for React JSX compatibility

### Changed

- **Vite/Vitest config** - Updated configuration for rolldown compatibility (note: this was reverted in 0.2.3 due to incorrect plugin placement)

## [0.2.1] - 2025-12-01

### Fixed

- **Git check** - Replaced `require(child_process)` with the equivalent `import`
- **ProjectNameInput conditional** - Added `.trim()` to initial value in `src/components/ProjectNameInput.tsx`
- **SVG icons** - Fixed `transform` CSS style for Vite and TypeScript icons

## [0.2.0] - 2025-12-01

Entire Template refactor for better Dx and results, fixed errors

### Added

#### Template Engine Modernization

- **Handlebars.js integration** - Replaced ~500 lines of custom regex-based template processing with industry-standard Handlebars templating engine
- **Custom Handlebars helpers** - Added `json`, `eq`, `neq`, `and`, `or`, `not`, `includes`, `concat`, `lookup` helpers for advanced template logic
- **Partials system** - Recursive partial loading from `templates/dynamic/partials/` for reusable template components
- **IDE syntax highlighting** - All templates renamed from `.template` to `.hbs` for proper editor support

#### Plugin Architecture

- **Plugin interface** - New `Plugin` type with `shouldActivate()`, `getFiles()`, `getDependencies()`, `getDevDependencies()`, `getScripts()` methods
- **Plugin registry** - `PluginRegistry` for registering and querying plugins by feature flags
- **10 core plugins** - Modular plugins for each feature:
  - `tailwindPlugin` - Tailwind CSS v4 configuration
  - `reduxPlugin` - Redux Toolkit store/slices generation
  - `reactRouterPlugin` - React Router dependencies
  - `i18nPlugin` - i18next configuration and locale files
  - `eslintPlugin` - ESLint flat config generation
  - `prettierPlugin` - Prettier configuration
  - `huskyPlugin` - Git hooks and lint-staged setup
  - `githubActionsPlugin` - CI/CD workflow generation
  - `vscodePlugin` - Editor settings and extensions
  - `testingPlugin` - Vitest setup with profile-based configuration

#### Type System Improvements

- **TestProfileConfig modernization** - Replaced `includeTests` object with `testTypes` array for cleaner API
- **Plugin types** - Added `Plugin`, `PluginContext`, `PluginFile`, `PluginRegistry` interfaces
- **TestType union** - New type for `'unit' | 'integration' | 'accessibility' | 'performance' | 'snapshot' | 'redux' | 'router' | 'i18n' | 'tailwind'`

### Changed

- **TemplateEngine** - Complete rewrite using Handlebars instead of custom regex parsing
- **TestGenerator** - Now uses shared `TemplateEngine` instead of duplicated parsing logic
- **TemplateLogic** - Updated to use `.hbs` file extension and new factory functions
- **TestProfileConfig** - `coverageThreshold` renamed to `coverage`, `includeTests` replaced with `testTypes` array
- **TestProfileSelect component** - Updated UI to work with new `testTypes` array format

### Removed

- **Custom regex template parser** - Removed ~300 lines of fragile regex-based parsing code
- **Duplicated template processing** - TestGenerator no longer has its own template parser

### Technical Details

#### New Files

```
src/plugins/
├── index.ts          # Plugin exports and factory
├── registry.ts       # PluginRegistry implementation
├── tailwind.ts       # Tailwind CSS plugin
├── redux.ts          # Redux Toolkit plugin
├── react-router.ts   # React Router plugin
├── i18n.ts           # i18next plugin
├── eslint.ts         # ESLint plugin
├── prettier.ts       # Prettier plugin
├── husky.ts          # Husky plugin
├── github-actions.ts # GitHub Actions plugin
├── vscode.ts         # VS Code plugin
└── testing.ts        # Testing plugin
```

#### Dependencies Added

- `handlebars@^4.7.8` - Template engine

## [0.1.0-beta.1] - 2025-11-30

### Added

- **Documentation overhaul** - Complete README rewrite with professional tone, badges, and comprehensive sections
- **Multi-branch CI/CD** - GitHub Actions workflow supporting main and develop branches
- **GitHub releases automation** - Automatic GitHub releases with softprops/action-gh-release
- **npm auto-publish** - Automated npm publishing on main (stable) and develop (next tag)
- **CONTRIBUTING.md** - Development setup, code style guidelines, and contribution process
- **CODE_OF_CONDUCT.md** - Contributor Covenant v2.1
- **SECURITY.md** - Security policy with supported versions and vulnerability reporting
- **Issue templates** - YAML form templates for bug reports and feature requests
- **PR template** - Pull request template with description, type, and checklist

### Changed

- **Repository URLs** - Corrected all URLs to point to react-vite-starter-kit repository
- **README** - Rewritten professionally without emojis, with proper documentation structure

### Fixed

- **Homepage URL** - Corrected from tsvite-react-tailwind-boilerplate to react-vite-starter-kit
- **Bugs URL** - Corrected issue tracker URL
- **Repository URL** - Corrected git repository URL

## [0.0.6] - 2025-11-29

### Fixed

- **TemplateEngine nested conditionals** - Rewrote the template processor to properly handle nested `{{#if}}` blocks using depth-tracking algorithm instead of greedy regex matching
- **TypeScript CSS imports** - Fixed `Cannot find module './App.css'` error by adding `types: ['vite/client']` to generated `tsconfig.app.json` and removing incompatible `noUncheckedSideEffectImports` flag
- **Missing targetDir in skip mode** - Fixed "path argument must be of type string" error when using `--yes` flag by properly initializing `targetDir` from `initialProjectName`
- **Test file import paths** - Fixed test fallback generators to use correct relative import path `../test/test-utils` instead of `./test-utils`
- **Unused variable in i18n template** - Fixed unused `t` variable in `LanguageSelector` component when i18n is enabled
- **Conditional variable declarations** - Fixed `handleToggleTheme`, `autoCount`, and `isRunning` variables to only be declared when TailwindCSS is enabled (when the UI components using them are rendered)

### Changed

- **App.tsx template** - Improved conditional rendering logic to avoid declaring unused variables based on feature flags
- **TemplateEngine** - Added `findElseAtSameLevel()` method to correctly find `{{else}}` blocks at the same nesting depth

## [0.0.5] - 2025-11-29

### Added

- **Headless mode** for CI/non-TTY environments - Automatically detects when running in GitHub Actions, CI, or without a TTY and runs project creation without the interactive Ink UI

### Changed

- **Minimum Node.js version** bumped from 18.x to 20.x due to `string-width` dependency (used by Ink) requiring the RegExp `v` flag only available in Node.js 20+
- **GitHub Actions CI** updated to test on Node.js 20.x and 22.x only (removed 18.x)

### Fixed

- **GitHub Actions build failure** - Fixed `SyntaxError: Invalid regular expression flags` error on Node.js 18.x caused by `string-width` package using unsupported RegExp `v` flag
- **GitHub Actions template tests** - Fixed `Raw mode is not supported` error when running CLI in non-interactive CI environments by auto-detecting and using headless mode

## [0.0.4] - 2025-11-28

### Added

#### Testing Feature

- **Optional testing support** with Vitest + React Testing Library
- **`testing` feature flag** in FeatureFlags interface
- **Test dependencies** - vitest, @vitest/coverage-v8, @vitest/ui, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom
- **Test scripts** - `test`, `test:watch`, `test:ui`, `test:coverage`
- **Vitest configuration generator** with coverage thresholds (70%)
- **Test setup file** with mocks for IntersectionObserver, ResizeObserver, matchMedia
- **Test utilities** file with custom render function for providers
- **Feature-specific tests**:
  - App.test.tsx - Base component tests
  - store.test.ts - Redux slice/store tests (when Redux enabled)
  - redux-integration.test.tsx - Redux integration tests
  - router.test.tsx - React Router navigation tests
- **CI integration** - Tests run in GitHub Actions with coverage upload
- **Husky integration** - Tests run in pre-commit hook when testing enabled
- **VS Code integration** - Vitest explorer extension recommendation

#### CLI Tests

- **50 unit tests** for the CLI project itself
- **templates.test.ts** - Template configuration tests
- **dependencies.test.ts** - Dependency generation tests
- **validation.test.ts** - Project name validation tests
- **version.test.ts** - Version utility tests
- **vitest.config.ts** for CLI project with coverage

### Changed

- Updated `full-pack` template to include testing by default
- Updated generated tsconfig.json to include vitest type reference
- Updated generated GitHub Actions workflow with test step
- Updated generated Husky pre-commit to optionally run tests
- Updated generated VS Code settings with Vitest configuration

## [0.0.3] - 2025-11-28

### Added

#### CLI Implementation

- **Complete CLI wizard** using Ink (React for terminal) with interactive multi-step flow
- **Commander.js integration** for argument parsing (`--template`, `--yes`, `--no-git`, `--no-install`)
- **Project name validation** with npm package name validation and smart suggestions
- **Template selection** with 4 preset templates:
  - ⚡ Minimal - React + Vite + TypeScript only
  - 📦 Standard - Adds TailwindCSS + ESLint + Prettier
  - 🚀 Full Pack - Everything included with Redux, React Router, Husky, GitHub Actions
  - 🎨 Custom - Pick your own features
- **Feature selection** for custom template with toggleable options
- **Package manager selection** (npm, yarn, pnpm)
- **Git initialization prompt** with auto-detection of git availability

#### Project Generation

- **Dynamic package.json generation** based on selected features
- **TypeScript configuration** with proper tsconfig.json, tsconfig.app.json, tsconfig.node.json
- **Vite configuration** with rolldown-vite support
- **ESLint 9 flat config** with TypeScript, React hooks, and Prettier integration
- **Prettier configuration** with sensible defaults
- **TailwindCSS v4** configuration with Vite plugin
- **Redux Toolkit** store and slice generation
- **React Router** integration ready
- **Husky + lint-staged** for pre-commit hooks
- **GitHub Actions CI/CD** workflow for Node.js matrix testing (18.x, 20.x, 22.x)
- **VS Code configuration** with recommended extensions and settings

#### Build & Development

- **ESM module system** - Fully ESM compatible
- **tsup bundler** for building CLI distribution
- **tsx** for development with TypeScript
- **Proper npm publish configuration** with `files`, `bin`, and `publishConfig`

#### UI Components (Ink)

- `WelcomeScreen` - Animated welcome with gradient text
- `ProjectNameInput` - Input with validation and suggestions
- `TemplateSelect` - Template picker with descriptions
- `FeatureSelect` - Multi-toggle feature selection
- `PackageManagerSelect` - Package manager picker
- `GitInitPrompt` - Git initialization with availability check
- `Summary` - Project configuration summary
- `CreatingProject` - Progress indicator with step tracking
- `CompleteScreen` - Success message with next steps
- `ErrorScreen` - Error display with retry option

### Changed

- Updated from CommonJS to ESM module system
- Changed main entry from `main.ts` to compiled `dist/main.js`
- Updated React to v18.3.1 for Ink compatibility
- Restructured project with modular architecture

### Project Structure

```
src/
├── main.ts              # CLI entry point with Commander
├── app.tsx              # Main Ink app with wizard state
├── components/          # UI components
│   ├── WelcomeScreen.tsx
│   ├── ProjectNameInput.tsx
│   ├── TemplateSelect.tsx
│   ├── FeatureSelect.tsx
│   ├── PackageManagerSelect.tsx
│   ├── GitInitPrompt.tsx
│   ├── Summary.tsx
│   ├── CreatingProject.tsx
│   ├── CompleteScreen.tsx
│   └── ErrorScreen.tsx
├── config/
│   ├── templates.ts     # Template definitions
│   └── dependencies.ts  # Dependency versions
├── logics/
│   ├── ProjectCreator.ts    # Project generation logic
│   ├── PackageJsonLogic.ts  # package.json builder
│   └── TemplateLogic.ts     # Template file generation
├── types/
│   └── index.ts         # TypeScript type definitions
└── utils/
    ├── version.ts       # Version checking utilities
    └── validation.ts    # Name validation utilities
```

### Dependencies

#### Runtime

- `commander` - CLI argument parsing
- `ink` - React for CLI
- `ink-big-text` - ASCII art titles
- `ink-gradient` - Gradient text effects
- `ink-select-input` - Selection input
- `ink-spinner` - Loading spinners
- `ink-text-input` - Text input
- `chalk` - Terminal colors
- `fs-extra` - File system utilities
- `ora` - Elegant terminal spinners
- `validate-npm-package-name` - Package name validation

#### Development

- `typescript` - Type checking
- `tsup` - Build tool
- `tsx` - TypeScript execution
- `eslint` - Linting
- `prettier` - Code formatting
- `husky` - Git hooks
- `lint-staged` - Staged file linting

## [0.0.2] - Previous

### Added

- Initial project setup
- Basic template structure in `templates/full-pack/`
- Ink dependency installation

---

## Roadmap

### [0.3.0] - Planned

- [ ] Supabase integration template
- [ ] Custom TypeScript configurations
- [ ] Custom linting presets
- [ ] Template caching for faster project creation
- [ ] Update checker for CLI

### [0.4.0] - Future

- [ ] Monorepo support
- [ ] Docker configuration templates
- [ ] CI/CD templates for GitLab, Bitbucket
- [ ] Custom component library scaffolding
