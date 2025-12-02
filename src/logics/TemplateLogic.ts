import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import type { FeatureFlags } from '../types/index.js';
import { createTemplateEngineFromFeatures, type TemplateContext } from './TemplateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the templates directory path
 */
function getTemplatesDir(): string {
  const possiblePaths = [
    join(__dirname, '../templates'),
    join(__dirname, '../../templates'),
    join(__dirname, '../../../templates'),
    join(process.cwd(), 'templates'),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  return possiblePaths[0];
}

/**
 * Get dynamic templates directory
 */
function getDynamicTemplatesDir(): string {
  return join(getTemplatesDir(), 'dynamic');
}

export interface TemplateFile {
  source: string;
  dest: string;
  template?: boolean;
}

/**
 * Get template files based on template type
 */
export async function getTemplateFiles(
  templateType: 'base' | 'full-pack'
): Promise<TemplateFile[]> {
  const templatesDir = getTemplatesDir();
  const files: TemplateFile[] = [];

  if (templateType === 'base') {
    return [];
  }

  if (templateType === 'full-pack') {
    const fullPackDir = join(templatesDir, 'full-pack');
    return await getFilesRecursive(fullPackDir, '');
  }

  return files;
}

/**
 * Get feature-specific files (currently handled dynamically)
 */
export async function getFeatureFiles(_features: FeatureFlags): Promise<TemplateFile[]> {
  return [];
}

/**
 * Recursively get all files from a directory
 */
async function getFilesRecursive(dir: string, relativePath: string): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const destPath = relativePath ? join(relativePath, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      const subFiles = await getFilesRecursive(fullPath, destPath);
      files.push(...subFiles);
    } else {
      files.push({
        source: fullPath,
        dest: destPath,
      });
    }
  }

  return files;
}

/**
 * Process a template file with the given context
 */
function processTemplateFile(templateName: string, context: TemplateContext): string | null {
  const dynamicDir = getDynamicTemplatesDir();
  const templatePath = join(dynamicDir, templateName);

  if (!existsSync(templatePath)) {
    return null;
  }

  const engine = createTemplateEngineFromFeatures(context.features, {
    projectName: context.projectName as string,
    author: context.author as string,
    description: context.description as string,
    license: context.license as string,
  });

  return engine.processFile(templatePath);
}

/**
 * Get source file content for a specific template
 */
export async function getSourceFileContent(
  _templateId: string,
  features: FeatureFlags,
  projectConfig?: { projectName?: string; author?: string; description?: string; license?: string }
): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();

  const context: TemplateContext = {
    features,
    projectName: projectConfig?.projectName || 'my-app',
    author: projectConfig?.author || '',
    description: projectConfig?.description || '',
    license: projectConfig?.license || 'MIT',
    hasProviders: features.redux || features.reactRouter || features.i18n,
    providerOrder: [],
  };

  const dynamicDir = getDynamicTemplatesDir();

  // Generate main.tsx content
  const mainContent = processTemplateFile('main.tsx.hbs', context);
  contentMap.set('src/main.tsx', mainContent || generateMainTsx(features));

  // Generate App.tsx content
  const appContent = processTemplateFile('App.tsx.hbs', context);
  contentMap.set('src/App.tsx', appContent || generateAppTsx(features));

  // Generate App.css content
  const cssContent = processTemplateFile('App.css.hbs', context);
  contentMap.set('src/App.css', cssContent || generateAppCss(features));

  // Generate vite.config.ts content
  const viteContent = processTemplateFile('vite.config.ts.hbs', context);
  if (viteContent) {
    contentMap.set('vite.config.ts', viteContent);
  }

  // Redux files
  if (features.redux) {
    const storeContent = processTemplateFile('store/store.ts.hbs', context);
    contentMap.set('src/store/store.ts', storeContent || generateReduxStore());

    const sliceContent = processTemplateFile('store/slices/appSlice.ts.hbs', context);
    contentMap.set('src/store/slices/appSlice.ts', sliceContent || generateReduxSlice());
  }

  // i18n files
  if (features.i18n) {
    const i18nConfigContent = processTemplateFile('i18n/config.ts.hbs', context);
    contentMap.set('src/i18n/config.ts', i18nConfigContent || generateI18nConfig());

    // Translation files
    const locales = ['en', 'pt', 'es'];
    for (const locale of locales) {
      const localePath = join(dynamicDir, `i18n/locales/${locale}.json.hbs`);
      if (existsSync(localePath)) {
        const content = readFileSync(localePath, 'utf-8');
        contentMap.set(`src/i18n/locales/${locale}.json`, content);
      } else {
        contentMap.set(`src/i18n/locales/${locale}.json`, generateLocaleFile(locale));
      }
    }
  }

  // Generate POSSIBILITIES.md
  const possibilitiesContent = processTemplateFile('POSSIBILITIES.md.hbs', {
    ...context,
    packageManager: 'npm',
  });
  if (possibilitiesContent) {
    contentMap.set('POSSIBILITIES.md', possibilitiesContent);
  }

  return contentMap;
}

// ============================================================================
// FALLBACK GENERATORS
// ============================================================================

function generateMainTsx(features: FeatureFlags): string {
  const imports = [
    "import { StrictMode } from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import App from './App';",
  ];

  if (features.tailwindcss) {
    imports.push("import './App.css';");
  }

  if (features.redux) {
    imports.push("import { Provider } from 'react-redux';");
    imports.push("import { store } from './store/store';");
  }

  if (features.reactRouter) {
    imports.push("import { BrowserRouter } from 'react-router-dom';");
  }

  if (features.i18n) {
    imports.push("import './i18n/config';");
  }

  let appContent = '<App />';

  if (features.reactRouter) {
    appContent = `<BrowserRouter>\n        ${appContent}\n      </BrowserRouter>`;
  }

  if (features.redux) {
    appContent = `<Provider store={store}>\n        ${appContent}\n      </Provider>`;
  }

  return `${imports.join('\n')}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    ${appContent}
  </StrictMode>
);
`;
}

function generateAppTsx(features: FeatureFlags): string {
  const baseStyles = features.tailwindcss
    ? 'className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center"'
    : '';

  const titleStyles = features.tailwindcss ? 'className="text-4xl font-bold text-white mb-4"' : '';
  const descStyles = features.tailwindcss ? 'className="text-gray-400"' : '';

  return `function App() {
  return (
    <div ${baseStyles}>
      <div ${features.tailwindcss ? 'className="text-center"' : ''}>
        <h1 ${titleStyles}>
          React + Vite
        </h1>
        <p ${descStyles}>
          Edit <code>src/App.tsx</code> and save to see changes
        </p>
      </div>
    </div>
  );
}

export default App;
`;
}

function generateAppCss(features: FeatureFlags): string {
  if (features.tailwindcss) {
    return `@import 'tailwindcss';
`;
  }

  return `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
`;
}

function generateReduxStore(): string {
  return `import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}

function generateReduxSlice(): string {
  return `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AppState {
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  theme: 'dark',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setTheme, toggleTheme } = appSlice.actions;
export const selectTheme = (state: RootState) => state.app.theme;
export default appSlice.reducer;
`;
}

function generateI18nConfig(): string {
  return `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
`;
}

function generateLocaleFile(locale: string): string {
  const translations: Record<string, object> = {
    en: {
      hero: {
        title: 'React + Vite Starter',
        subtitle: 'A modern starting point for your React projects',
      },
      features: {
        counter: { title: 'useState Hook', description: 'Click to increment' },
        timer: { title: 'useEffect Hook', description: 'Auto-incrementing timer' },
        redux: { title: 'Redux Theme', description: 'Theme managed by Redux' },
        router: { title: 'React Router', description: 'Navigate between pages' },
        i18n: { title: 'Internationalization', description: 'Switch languages' },
      },
      common: {
        increment: 'Increment',
        start: 'Start',
        stop: 'Stop',
        reset: 'Reset',
        lightMode: 'Light',
        darkMode: 'Dark',
        home: 'Home',
        about: 'About',
      },
      footer: { madeWith: 'Made with ❤️ by' },
    },
    pt: {
      hero: {
        title: 'React + Vite Starter',
        subtitle: 'Um ponto de partida moderno para seus projetos React',
      },
      features: {
        counter: { title: 'Hook useState', description: 'Clique para incrementar' },
        timer: { title: 'Hook useEffect', description: 'Temporizador auto-incrementante' },
        redux: { title: 'Tema Redux', description: 'Tema gerenciado pelo Redux' },
        router: { title: 'React Router', description: 'Navegue entre páginas' },
        i18n: { title: 'Internacionalização', description: 'Alterne idiomas' },
      },
      common: {
        increment: 'Incrementar',
        start: 'Iniciar',
        stop: 'Parar',
        reset: 'Resetar',
        lightMode: 'Claro',
        darkMode: 'Escuro',
        home: 'Início',
        about: 'Sobre',
      },
      footer: { madeWith: 'Feito com ❤️ por' },
    },
    es: {
      hero: {
        title: 'React + Vite Starter',
        subtitle: 'Un punto de partida moderno para tus proyectos React',
      },
      features: {
        counter: { title: 'Hook useState', description: 'Haz clic para incrementar' },
        timer: { title: 'Hook useEffect', description: 'Temporizador auto-incrementante' },
        redux: { title: 'Tema Redux', description: 'Tema gestionado por Redux' },
        router: { title: 'React Router', description: 'Navega entre páginas' },
        i18n: { title: 'Internacionalización', description: 'Cambia idiomas' },
      },
      common: {
        increment: 'Incrementar',
        start: 'Iniciar',
        stop: 'Detener',
        reset: 'Reiniciar',
        lightMode: 'Claro',
        darkMode: 'Oscuro',
        home: 'Inicio',
        about: 'Acerca',
      },
      footer: { madeWith: 'Hecho con ❤️ por' },
    },
  };

  return JSON.stringify(translations[locale] || translations.en, null, 2);
}
