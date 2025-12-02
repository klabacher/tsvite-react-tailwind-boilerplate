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
