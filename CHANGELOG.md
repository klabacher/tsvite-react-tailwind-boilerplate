# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta.1] - 2025-11-30

### Added

- **CONTRIBUTING.md** - Comprehensive contributing guide with development setup, code style, commit conventions, and pull request process
- **CODE_OF_CONDUCT.md** - Contributor Covenant Code of Conduct for community guidelines
- **SECURITY.md** - Security policy with vulnerability reporting instructions and supported versions
- **LICENSE** - MIT License file
- **GitHub Issue Templates** - Bug report and feature request templates with structured forms
- **Pull Request Template** - Standardized PR template with checklist and description sections
- **Multi-branch CI/CD workflow** - Comprehensive GitHub Actions workflow with:
  - Separate handling for dev, beta, and main branches
  - Automated npm publishing with appropriate tags (beta/latest)
  - Automated GitHub releases with changelog extraction
  - Matrix testing on Node.js 20.x, 22.x, and 24.x
  - Template generation testing for all templates

### Changed

- **README.md** - Complete rewrite with professional documentation:
  - Comprehensive badges (npm version, downloads, CI status, license, Node.js, TypeScript)
  - Detailed installation and usage instructions
  - Complete CLI options table
  - Feature comparison table by template
  - Troubleshooting section
  - Removed emojis for professional tone
- **package.json** - Updated with correct repository URLs and recommended npm fields:
  - Fixed homepage, bugs, and repository URLs
  - Added funding information
  - Added sideEffects: false for tree-shaking optimization
  - Updated version to 0.1.0-beta.1

### Fixed

- **Repository URLs** - Corrected all URLs from old repository name to react-vite-starter-kit

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

### [0.1.0] - Planned

- [ ] Supabase integration template
- [ ] Custom TypeScript configurations
- [ ] Custom linting presets
- [ ] Template caching for faster project creation
- [ ] Update checker for CLI

### [0.2.0] - Future

- [ ] Monorepo support
- [ ] Docker configuration templates
- [ ] CI/CD templates for GitLab, Bitbucket
- [ ] Custom component library scaffolding
