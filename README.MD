# react-vite-starter-kit

> 🚀 Out-Of-The-Box React + Vite project scaffolding with commonly used features. Just type `npx react-vite-starter-kit` and start building!

[![npm version](https://img.shields.io/npm/v/react-vite-starter-kit.svg)](https://www.npmjs.com/package/react-vite-starter-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Interactive CLI** - Beautiful terminal UI built with Ink & Commander
- 📦 **Multiple Templates** - Choose from minimal, standard, full-pack, or custom
- ⚡ **Vite + React** - Lightning fast development with hot module replacement
- 🔷 **TypeScript** - Full TypeScript support out of the box
- 🎨 **TailwindCSS** - Utility-first CSS framework (optional)
- 🔄 **Redux Toolkit** - State management made easy (optional)
- 🧭 **React Router** - Client-side routing (optional)
- 📏 **ESLint + Prettier** - Code quality and formatting (optional)
- 🐶 **Husky + lint-staged** - Git hooks for code quality (optional)
- 🔄 **GitHub Actions** - CI/CD pipeline ready (optional)
- 📝 **VS Code Config** - Editor settings and extensions (optional)

## 📋 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## 🚀 Quick Start

```bash
# Create a new project interactively
npx react-vite-starter-kit my-app

# Use a specific template
npx react-vite-starter-kit my-app --template full-pack

# Skip prompts with defaults
npx react-vite-starter-kit my-app --yes

# Skip git initialization
npx react-vite-starter-kit my-app --no-git

# Skip dependency installation
npx react-vite-starter-kit my-app --no-install
```

## 📁 Templates

### 🟢 Minimal

Basic React + Vite + TypeScript setup. Perfect for learning or small projects.

**Includes:** React, Vite, TypeScript

### 🔵 Standard

Recommended setup with routing, state management, and TailwindCSS.

**Includes:** React, Vite, TypeScript, React Router, Redux Toolkit, TailwindCSS

### 🟣 Full Pack

Everything included! Complete development environment with all bells and whistles.

**Includes:** All Standard features + ESLint, Prettier, Husky, GitHub Actions, VS Code config

### ⚪ Custom

Build your own! Select exactly what you need.

**Choose from:** React Router, Redux Toolkit, TailwindCSS, ESLint, Prettier, Husky, GitHub Actions, VS Code config

## 🛠️ CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--template <name>` | `-t` | Use a specific template (minimal, standard, full-pack) |
| `--yes` | `-y` | Skip prompts and use defaults |
| `--no-git` | | Skip git initialization |
| `--no-install` | | Skip dependency installation |
| `--help` | `-h` | Show help |
| `--version` | `-V` | Show version |

## 📂 Project Structure

```bash
my-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/           # With React Router
│   ├── Redux/           # With Redux Toolkit
│   │   ├── Store.ts
│   │   └── Slice.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .github/             # With GitHub Actions
│   └── workflows/
│       └── ci.yml
├── .husky/              # With Husky
│   └── pre-commit
├── .vscode/             # With VS Code config
│   ├── settings.json
│   └── extensions.json
├── eslint.config.js     # With ESLint
├── .prettierrc          # With Prettier
├── tailwind.config.ts   # With TailwindCSS
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 🔧 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/your-username/react-vite-starter-kit.git
cd react-vite-starter-kit

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/main.js --help

# Development mode with watch
npm run dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the CLI |
| `npm run dev` | Build with watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run typecheck` | TypeScript type checking |
| `npm run prepare` | Setup Husky hooks |

## 📝 Publishing

```bash
# Build and publish to npm
npm run build
npm publish --access public
```

## 🗺️ Roadmap

- [ ] Yarn/pnpm/bun package manager support
- [ ] Supabase integration template
- [ ] Custom TypeScript configurations
- [ ] Custom linting profiles
- [ ] Rolldown-vite option
- [ ] Legacy Vite option
- [ ] More framework templates

## 📄 License

MIT © [Your Name]

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

**Be Faster!** ⚡
