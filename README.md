# react-vite-starter-kit

CLI scaffolding tool for React + Vite projects with customizable features. Create production-ready React applications with TypeScript, TailwindCSS, Redux, testing, and more - all configured and ready to use.

[![npm version](https://img.shields.io/npm/v/react-vite-starter-kit.svg)](https://www.npmjs.com/package/react-vite-starter-kit)
[![npm downloads](https://img.shields.io/npm/dm/react-vite-starter-kit.svg)](https://www.npmjs.com/package/react-vite-starter-kit)
[![CI](https://github.com/klabacher/react-vite-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/klabacher/react-vite-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [CLI Options](#cli-options)
- [Templates](#templates)
- [Feature Comparison](#feature-comparison)
- [Generated Project Structure](#generated-project-structure)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Interactive CLI** - Terminal-based wizard built with Ink and Commander for guided project setup
- **Multiple Templates** - Choose from minimal, standard, full-pack, or build a custom configuration
- **Vite + React** - Fast development with hot module replacement and optimized builds
- **TypeScript** - Full TypeScript support with strict type checking
- **TailwindCSS** - Utility-first CSS framework (optional)
- **Redux Toolkit** - State management with Redux Toolkit (optional)
- **React Router** - Client-side routing (optional)
- **i18n Support** - Internationalization with react-i18next (optional)
- **ESLint + Prettier** - Code quality and formatting (optional)
- **Husky + lint-staged** - Git hooks for pre-commit validation (optional)
- **GitHub Actions** - CI/CD pipeline configuration (optional)
- **VS Code Config** - Editor settings and recommended extensions (optional)
- **Vitest + Testing Library** - Unit and component testing with coverage (optional)

## Requirements

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0

## Installation

You can use the CLI directly with npx (recommended) or install it globally:

```bash
# Using npx (no installation required)
npx react-vite-starter-kit my-app

# Or install globally
npm install -g react-vite-starter-kit
react-vite-starter-kit my-app
```

## Usage

### Interactive Mode

Run the CLI without arguments to use the interactive wizard:

```bash
npx react-vite-starter-kit
```

The wizard will guide you through:
1. Project name input with validation
2. Template selection
3. Feature customization (for custom template)
4. Package manager selection
5. Git initialization preference
6. Summary and confirmation

### Quick Start with Templates

```bash
# Create project with minimal template
npx react-vite-starter-kit my-app --template minimal

# Create project with standard template
npx react-vite-starter-kit my-app --template standard

# Create project with full-pack template
npx react-vite-starter-kit my-app --template full-pack

# Skip all prompts and use defaults
npx react-vite-starter-kit my-app --yes
```

### Non-Interactive Mode

For CI/CD environments or scripting:

```bash
# Create project without git initialization
npx react-vite-starter-kit my-app --template standard --no-git

# Create project without installing dependencies
npx react-vite-starter-kit my-app --template minimal --no-install

# Combine options
npx react-vite-starter-kit my-app --template full-pack --no-git --no-install
```

## CLI Options

| Option              | Alias | Description                                              | Default   |
|---------------------|-------|----------------------------------------------------------|-----------|
| `--template <name>` | `-t`  | Use a specific template (minimal, standard, full-pack)   | -         |
| `--yes`             | `-y`  | Skip prompts and use defaults                            | false     |
| `--no-git`          | -     | Skip git initialization                                  | false     |
| `--no-install`      | -     | Skip dependency installation                             | false     |
| `--help`            | `-h`  | Display help information                                 | -         |
| `--version`         | `-V`  | Display version number                                   | -         |

## Templates

### Minimal

Basic React + Vite + TypeScript setup. Ideal for learning, prototyping, or small projects where you want to add dependencies manually.

**Includes:** React, Vite, TypeScript

### Standard

Recommended configuration for most projects. Includes routing, state management, styling, and code quality tools.

**Includes:** React, Vite, TypeScript, React Router, Redux Toolkit, TailwindCSS, ESLint, Prettier

### Full Pack

Complete development environment with all available features. Best for teams or projects requiring a production-ready setup from the start.

**Includes:** All Standard features plus Husky, GitHub Actions CI/CD, VS Code configuration, Vitest testing setup

### Custom

Build your own configuration by selecting individual features. The wizard will guide you through each option.

## Feature Comparison

| Feature                | Minimal | Standard | Full Pack | Custom |
|------------------------|:-------:|:--------:|:---------:|:------:|
| React                  | Yes     | Yes      | Yes       | Yes    |
| Vite                   | Yes     | Yes      | Yes       | Yes    |
| TypeScript             | Yes     | Yes      | Yes       | Yes    |
| TailwindCSS            | -       | Yes      | Yes       | Opt    |
| Redux Toolkit          | -       | Yes      | Yes       | Opt    |
| React Router           | -       | Yes      | Yes       | Opt    |
| i18n (react-i18next)   | -       | -        | -         | Opt    |
| ESLint                 | -       | Yes      | Yes       | Opt    |
| Prettier               | -       | Yes      | Yes       | Opt    |
| Husky + lint-staged    | -       | -        | Yes       | Opt    |
| GitHub Actions CI/CD   | -       | -        | Yes       | Opt    |
| VS Code Configuration  | -       | -        | Yes       | Opt    |
| Vitest + Testing Library | -     | -        | Yes       | Opt    |

*Opt = Optional (selectable in custom template)*

## Generated Project Structure

```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/              # With React Router
│   ├── Redux/              # With Redux Toolkit
│   │   ├── Store.ts
│   │   └── Slice.ts
│   ├── test/               # With Testing
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   ├── __tests__/          # With Testing
│   │   └── App.test.tsx
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .github/                # With GitHub Actions
│   └── workflows/
│       └── ci.yml
├── .husky/                 # With Husky
│   └── pre-commit
├── .vscode/                # With VS Code config
│   ├── settings.json
│   └── extensions.json
├── vitest.config.ts        # With Testing
├── eslint.config.js        # With ESLint
├── .prettierrc             # With Prettier
├── tailwind.config.ts      # With TailwindCSS
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/klabacher/react-vite-starter-kit.git
cd react-vite-starter-kit

# Install dependencies
npm install

# Build the CLI
npm run build

# Run locally
node dist/main.js --help

# Run in development mode
npm run dev
```

### Available Scripts

| Script              | Description                          |
|---------------------|--------------------------------------|
| `npm run build`     | Build the CLI with tsup              |
| `npm run dev`       | Run CLI in development mode with tsx |
| `npm run lint`      | Run ESLint                           |
| `npm run lint:fix`  | Fix ESLint errors automatically      |
| `npm run format`    | Format code with Prettier            |
| `npm run format:check` | Check code formatting             |
| `npm run typecheck` | Run TypeScript type checking         |
| `npm run test`      | Run tests with Vitest                |
| `npm run test:watch`| Run tests in watch mode              |
| `npm run test:coverage` | Run tests with coverage report   |

## Troubleshooting

### Common Issues

**Error: "Raw mode is not supported"**

This error occurs when running the CLI in a non-interactive environment (CI, piped input, etc.). Use the `--template` and `--yes` flags to skip interactive prompts:

```bash
npx react-vite-starter-kit my-app --template standard --yes
```

**Error: "Cannot find module './App.css'"**

Ensure you are using Node.js 20.0.0 or higher. Earlier versions may have issues with Vite's CSS handling in TypeScript projects.

**Error: Package name validation failed**

Project names must be valid npm package names:
- Lowercase letters, numbers, hyphens, and underscores only
- Cannot start with a dot or underscore
- Cannot contain spaces or special characters
- Maximum 214 characters

**Dependencies fail to install**

Try clearing the npm cache and reinstalling:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check the [GitHub Issues](https://github.com/klabacher/react-vite-starter-kit/issues) for known problems and solutions
- Review the [Discussions](https://github.com/klabacher/react-vite-starter-kit/discussions) for community support
- File a [bug report](https://github.com/klabacher/react-vite-starter-kit/issues/new?template=bug_report.md) if you encounter a new issue

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
