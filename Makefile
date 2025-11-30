# ============================================================================
# React Vite Starter Kit - Makefile
# ============================================================================
# Fluxo de branches: develop → pre-release → main
# TODO: add translation to English
# Uso:
#   make help              - Mostra todos os comandos disponíveis
#   make dev               - Inicia desenvolvimento
#   make release-beta      - Cria release beta (develop → pre-release)
#   make release-prod      - Cria release produção (pre-release → main)
# ============================================================================

. PHONY: help dev build test lint typecheck clean install
.PHONY: release-beta release-prod release-patch release-minor release-major
.PHONY: sync-branches check-clean check-branch version-bump
.PHONY: pr-beta pr-prod hotfix

# Cores para output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Versão atual do package.json
VERSION := $(shell node -p "require('./package.json').version")

# ============================================================================
# HELP
# ============================================================================

help: ## Mostra este menu de ajuda
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║     React Vite Starter Kit - Comandos Disponíveis            ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(GREEN)Versão atual: $(VERSION)$(RESET)"
	@echo ""
	@echo "$(YELLOW)📦 Desenvolvimento:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '(dev|build|test|lint|install|clean)' | awk 'BEGIN {FS = ":.*? ## "}; {printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)🚀 Releases:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*? ## .*$$' $(MAKEFILE_LIST) | grep -E '(release|bump)' | awk 'BEGIN {FS = ":.*? ## "}; {printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)🔄 Branches & PRs:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '(pr-|sync|hotfix)' | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)📋 Fluxo de Release:$(RESET)"
	@echo "  develop ──► pre-release ──► main"
	@echo "    │              │            │"
	@echo "    │         npm @pre-release  npm @latest"
	@echo "    └── (desenvolvimento)"
	@echo ""

# ============================================================================
# DESENVOLVIMENTO
# ============================================================================

install: ## Instala dependências
	@echo "$(CYAN)📦 Instalando dependências... $(RESET)"
	npm ci

dev: ## Inicia modo desenvolvimento
	@echo "$(CYAN)🚀 Iniciando desenvolvimento...$(RESET)"
	npm run dev

build: ## Compila o projeto
	@echo "$(CYAN)🔨 Compilando... $(RESET)"
	npm run build

test: ## Roda os testes
	@echo "$(CYAN)🧪 Rodando testes...$(RESET)"
	npm run test

test-watch: ## Roda testes em modo watch
	npm run test:watch

test-coverage: ## Roda testes com coverage
	npm run test:coverage

lint: ## Roda linter
	@echo "$(CYAN)🔍 Verificando código...$(RESET)"
	npm run lint

lint-fix: ## Corrige problemas de lint automaticamente
	npm run lint:fix

typecheck: ## Verifica tipos TypeScript
	@echo "$(CYAN)📝 Verificando tipos...$(RESET)"
	npm run typecheck

format: ## Formata código com Prettier
	npm run format

clean: ## Limpa arquivos de build
	@echo "$(CYAN)🧹 Limpando... $(RESET)"
	rm -rf dist coverage node_modules/. cache

# Validação completa antes de commit/release
validate: lint typecheck test build ## Roda todas as validações
	@echo "$(GREEN)✅ Todas as validações passaram!$(RESET)"

# ============================================================================
# CHECAGENS DE SEGURANÇA
# ============================================================================

check-clean: ## Verifica se working directory está limpo
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "$(RED)❌ Erro: Existem mudanças não commitadas$(RESET)"; \
		git status --short; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ Working directory limpo$(RESET)"

check-branch: ## Mostra branch atual
	@echo "$(CYAN)Branch atual: $$(git branch --show-current)$(RESET)"

check-remote: ## Verifica se está sincronizado com remote
	@git fetch origin
	@LOCAL=$$(git rev-parse @); \
	REMOTE=$$(git rev-parse @{u} 2>/dev/null || echo "none"); \
	if [ "$$LOCAL" != "$$REMOTE" ] && [ "$$REMOTE" != "none" ]; then \
		echo "$(YELLOW)⚠️  Branch não está sincronizada com origin$(RESET)"; \
		echo "Execute: git pull origin $$(git branch --show-current)"; \
	else \
		echo "$(GREEN)✅ Sincronizado com origin$(RESET)"; \
	fi

# ============================================================================
# VERSIONAMENTO (Semantic Versioning)
# ============================================================================

bump-patch: ## Incrementa versão patch (0.0.X) - bug fixes
	@echo "$(CYAN)📌 Incrementando versão patch...$(RESET)"
	@npm version patch --no-git-tag-force --allow-same-version
	@echo "$(GREEN)✅ Nova versão: $$(node -p "require('./package.json').version")$(RESET)"

bump-minor: ## Incrementa versão minor (0.X.0) - novas features
	@echo "$(CYAN)📌 Incrementando versão minor...$(RESET)"
	@npm version minor --no-git-tag-force --allow-same-version
	@echo "$(GREEN)✅ Nova versão: $$(node -p "require('./package.json'). version")$(RESET)"

bump-major: ## Incrementa versão major (X.0.0) - breaking changes
	@echo "$(CYAN)📌 Incrementando versão major... $(RESET)"
	@npm version major --no-git-tag-force --allow-same-version
	@echo "$(GREEN)✅ Nova versão: $$(node -p "require('./package.json').version")$(RESET)"

bump-beta: ## Incrementa versão beta (X.X.X-beta. N)
	@echo "$(CYAN)📌 Incrementando versão beta...$(RESET)"
	@CURRENT=$$(node -p "require('./package.json').version"); \
	if echo "$$CURRENT" | grep -q "beta"; then \
		npm version prerelease --preid=beta --no-git-tag-force; \
	else \
		npm version prerelease --preid=beta --no-git-tag-force; \
	fi
	@echo "$(GREEN)✅ Nova versão: $$(node -p "require('./package.json').version")$(RESET)"

bump-rc: ## Incrementa versão release candidate (X.X.X-rc. N)
	@echo "$(CYAN)📌 Incrementando versão RC...$(RESET)"
	@npm version prerelease --preid=rc --no-git-tag-force
	@echo "$(GREEN)✅ Nova versão: $$(node -p "require('./package.json').version")$(RESET)"

# ============================================================================
# RELEASES
# ============================================================================

release-beta: check-clean validate ## 🚀 Cria release beta (develop → pre-release)
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║              Criando Release Beta                            ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@BRANCH=$$(git branch --show-current); \
	if [ "$$BRANCH" != "develop" ]; then \
		echo "$(RED)❌ Erro: Você precisa estar na branch develop$(RESET)"; \
		echo "Execute: git checkout develop"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Versão atual: $(VERSION)$(RESET)"
	@read -p "Nova versão beta (ex: 0.2.0-beta.1): " NEW_VERSION; \
	if [ -z "$$NEW_VERSION" ]; then \
		echo "$(RED)❌ Versão não pode ser vazia$(RESET)"; \
		exit 1; \
	fi; \
	npm version $$NEW_VERSION --no-git-tag-force --allow-same-version; \
	git add package.json package-lock.json; \
	git commit -m "chore: bump version to $$NEW_VERSION"; \
	echo "$(GREEN)✅ Versão atualizada para $$NEW_VERSION$(RESET)"; \
	echo ""; \
	echo "$(YELLOW)📋 Próximos passos:$(RESET)"; \
	echo "  1. git push origin develop"; \
	echo "  2.  Criar PR: develop → pre-release"; \
	echo "  3. Após merge, o CI publica automaticamente com tag @pre-release"

release-prod: check-clean validate ## 🚀 Cria release produção (pre-release → main)
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║              Criando Release Produção                        ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@BRANCH=$$(git branch --show-current); \
	if [ "$$BRANCH" != "pre-release" ]; then \
		echo "$(RED)❌ Erro: Você precisa estar na branch pre-release$(RESET)"; \
		echo "Execute: git checkout pre-release"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Versão atual: $(VERSION)$(RESET)"
	@CLEAN_VERSION=$$(echo $(VERSION) | sed 's/-beta. *//' | sed 's/-rc.*//'); \
	read -p "Nova versão (sugestão: $$CLEAN_VERSION): " NEW_VERSION; \
	NEW_VERSION=$${NEW_VERSION:-$$CLEAN_VERSION}; \
	npm version $$NEW_VERSION --no-git-tag-force --allow-same-version; \
	git add package.json package-lock.json; \
	git commit -m "chore: release v$$NEW_VERSION"; \
	echo "$(GREEN)✅ Versão atualizada para $$NEW_VERSION$(RESET)"; \
	echo ""; \
	echo "$(YELLOW)📋 Próximos passos:$(RESET)"; \
	echo "  1. git push origin pre-release"; \
	echo "  2. Criar PR: pre-release → main"; \
	echo "  3.  Após merge, o CI publica automaticamente com tag @latest"; \
	echo "  4. Execute 'make sync-branches' para sincronizar"

# ============================================================================
# PULL REQUESTS (usa GitHub CLI)
# ============================================================================

pr-beta: ## Cria PR de develop → pre-release
	@echo "$(CYAN)📝 Criando PR para pre-release...$(RESET)"
	@if !  command -v gh &> /dev/null; then \
		echo "$(RED)❌ GitHub CLI não instalado. Instale: https://cli.github.com/$(RESET)"; \
		exit 1; \
	fi
	@VERSION=$$(node -p "require('./package.json').version"); \
	gh pr create \
		--base pre-release \
		--head develop \
		--title "🚀 Release $$VERSION (Beta)" \
		--body "## Release Beta $$VERSION\n\nEsta PR prepara a versão $$VERSION para testes.\n\n### Checklist\n- [ ] Testes passando\n- [ ] Documentação atualizada\n- [ ] CHANGELOG atualizado"

pr-prod: ## Cria PR de pre-release → main
	@echo "$(CYAN)📝 Criando PR para produção...$(RESET)"
	@if ! command -v gh &> /dev/null; then \
		echo "$(RED)❌ GitHub CLI não instalado.  Instale: https://cli.github. com/$(RESET)"; \
		exit 1; \
	fi
	@VERSION=$$(node -p "require('./package.json').version"); \
	gh pr create \
		--base main \
		--head pre-release \
		--title "🎉 Release $$VERSION" \
		--body "## Release $$VERSION\n\nEsta PR publica a versão $$VERSION para produção.\n\n### Checklist\n- [ ] Beta testado com sucesso\n- [ ] Sem bugs conhecidos\n- [ ] Pronto para produção"

# ============================================================================
# SINCRONIZAÇÃO DE BRANCHES
# ============================================================================

sync-branches: ## Sincroniza main → pre-release → develop (após release)
	@echo "$(CYAN)🔄 Sincronizando branches... $(RESET)"
	@echo ""
	@git fetch origin
	@echo "$(YELLOW)1/3 Atualizando main... $(RESET)"
	@git checkout main && git pull origin main
	@echo ""
	@echo "$(YELLOW)2/3 Sincronizando pre-release com main...$(RESET)"
	@git checkout pre-release && git pull origin pre-release && git merge main -m "chore: sync with main" && git push origin pre-release
	@echo ""
	@echo "$(YELLOW)3/3 Sincronizando develop com pre-release...$(RESET)"
	@git checkout develop && git pull origin develop && git merge pre-release -m "chore: sync with pre-release" && git push origin develop
	@echo ""
	@echo "$(GREEN)✅ Todas as branches sincronizadas! $(RESET)"

sync-down: ## Atualiza branch atual com origin
	@BRANCH=$$(git branch --show-current); \
	echo "$(CYAN)⬇️  Atualizando $$BRANCH...$(RESET)"; \
	git pull origin $$BRANCH

# ============================================================================
# HOTFIX (correções urgentes em produção)
# ============================================================================

hotfix: ## Cria branch de hotfix a partir de main
	@read -p "Nome do hotfix (ex: fix-critical-bug): " HOTFIX_NAME; \
	if [ -z "$$HOTFIX_NAME" ]; then \
		echo "$(RED)❌ Nome não pode ser vazio$(RESET)"; \
		exit 1; \
	fi; \
	git checkout main; \
	git pull origin main; \
	git checkout -b hotfix/$$HOTFIX_NAME; \
	echo "$(GREEN)✅ Branch hotfix/$$HOTFIX_NAME criada$(RESET)"; \
	echo ""; \
	echo "$(YELLOW)📋 Após corrigir o bug:$(RESET)"; \
	echo "  1. git add .  && git commit -m 'fix: descrição'"; \
	echo "  2. make bump-patch"; \
	echo "  3. git push origin hotfix/$$HOTFIX_NAME"; \
	echo "  4. Criar PR: hotfix/$$HOTFIX_NAME → main"; \
	echo "  5. Após merge, execute 'make sync-branches'"

# ============================================================================
# NPM
# ============================================================================

npm-check: ## Verifica o que será publicado no npm
	@echo "$(CYAN)📦 Arquivos que serão publicados:$(RESET)"
	@npm pack --dry-run

npm-login: ## Login no npm
	npm login

npm-whoami: ## Mostra usuário npm logado
	@npm whoami

# ============================================================================
# GIT SHORTCUTS
# ============================================================================

status: ## Git status resumido
	@git status --short --branch

log: ## Mostra últimos 10 commits
	@git log --oneline -10 --graph --decorate

branches: ## Lista todas as branches
	@echo "$(CYAN)Branches locais:$(RESET)"
	@git branch -v
	@echo ""
	@echo "$(CYAN)Branches remotas:$(RESET)"
	@git branch -r

# ============================================================================
# DEFAULT
# ============================================================================

.DEFAULT_GOAL := help