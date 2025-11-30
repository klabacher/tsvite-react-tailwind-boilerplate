# react-vite-starter-kit

[![npm version](https://img.shields.io/npm/v/react-vite-starter-kit.svg)](https://www.npmjs.com/package/react-vite-starter-kit)
[![npm downloads](https://img.shields.io/npm/dm/react-vite-starter-kit.svg)](https://www.npmjs.com/package/react-vite-starter-kit)
[![CI](https://github.com/klabacher/react-vite-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/klabacher/react-vite-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

A CLI scaffolding tool for generating React + Vite projects with customizable features. Create production-ready React applications with TypeScript, TailwindCSS, Redux, React Router, and more.

## Requirements

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0

## Installation

The recommended way to use this tool is via `npx`:

```bash
npx react-vite-starter-kit my-app
```

Alternatively, you can install it globally:

```bash
npm install -g react-vite-starter-kit
react-vite-starter-kit my-app
```

## Usage

### Interactive Mode

Run without options to start the interactive wizard:

```bash
npx react-vite-starter-kit my-app
```

The wizard guides you through:
1. Project name configuration
2. Template selection (or custom feature selection)
3. Package manager choice (npm, yarn, pnpm)
4. Git initialization preference

### Quick Start with Templates

```bash
# Create a minimal project
npx react-vite-starter-kit my-app --template minimal

# Create a standard project with common features
npx react-vite-starter-kit my-app --template standard

# Create a full-featured project
npx react-vite-starter-kit my-app --template full-pack

# Skip all prompts and use defaults
npx react-vite-starter-kit my-app --yes

# Skip git initialization
npx react-vite-starter-kit my-app --no-git

# Skip dependency installation
npx react-vite-starter-kit my-app --no-install
```

## CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--template <name>` | `-t` | Use a specific template: `minimal`, `standard`, or `full-pack` |
| `--yes` | `-y` | Skip prompts and use default configuration |
| `--no-git` | | Skip git repository initialization |
| `--no-install` | | Skip automatic dependency installation |
| `--help` | `-h` | Display help information |
| `--version` | `-V` | Display version number |

## Templates

### Feature Comparison

| Feature | Minimal | Standard | Full Pack | Custom |
|---------|:-------:|:--------:|:---------:|:------:|
| React + Vite | Yes | Yes | Yes | Yes |
| TypeScript | Yes | Yes | Yes | Yes |
| TailwindCSS | - | Yes | Yes | Optional |
| Redux Toolkit | - | Yes | Yes | Optional |
| React Router | - | Yes | Yes | Optional |
| ESLint | - | Yes | Yes | Optional |
| Prettier | - | Yes | Yes | Optional |
| Husky | - | - | Yes | Optional |
| GitHub Actions | - | - | Yes | Optional |
| VS Code Config | - | - | Yes | Optional |
| Vitest + Testing Library | - | - | Yes | Optional |
| i18n (react-i18next) | - | - | - | Optional |

### Template Details

**Minimal**: Basic React + Vite + TypeScript setup. Ideal for learning or small projects.

**Standard**: Recommended setup including TailwindCSS, Redux Toolkit, React Router, ESLint, and Prettier.

**Full Pack**: Complete development environment with all standard features plus Husky pre-commit hooks, GitHub Actions CI/CD, VS Code configuration, and Vitest testing.

**Custom**: Select individual features to build your own configuration.

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
├── .vscode/                # With VS Code Config
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

# Build
npm run build

# Run locally
node dist/main.js --help
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run CLI in development mode |
| `npm run build` | Build the CLI for distribution |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Troubleshooting

### Common Issues

**Error: Cannot find module**

Ensure you have Node.js >= 20.0.0 installed:
```bash
node --version
```

**Permission denied when running globally**

On Unix systems, you may need to configure npm to use a different directory for global packages:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Git initialization fails**

Ensure git is installed and configured:
```bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Build fails in generated project**

Make sure all dependencies are installed:
```bash
cd my-app
npm install
npm run build
```

### Getting Help

- Check [existing issues](https://github.com/klabacher/react-vite-starter-kit/issues)
- Open a [new issue](https://github.com/klabacher/react-vite-starter-kit/issues/new)
- Start a [discussion](https://github.com/klabacher/react-vite-starter-kit/discussions)

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## Security

For information about reporting security vulnerabilities, see [SECURITY.md](SECURITY.md).

## License

MIT License. See [LICENSE](LICENSE) for details.
