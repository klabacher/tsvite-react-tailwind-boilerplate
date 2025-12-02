import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FeatureFlags, TestProfileConfig } from '../types/index.js';
import { testProfiles, getCoverageThreshold } from '../config/testProfiles.js';
import { createTemplateEngineFromFeatures, type TemplateContext } from './TemplateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the test templates directory with fallback paths
 */
function getTestTemplatesDir(): string {
  const possiblePaths = [
    path.resolve(__dirname, '../templates/test-templates'),
    path.resolve(__dirname, '../../templates/test-templates'),
    path.resolve(__dirname, '../../../templates/test-templates'),
    path.join(process.cwd(), 'templates/test-templates'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return possiblePaths[0];
}

/**
 * TestGenerator - Generates test files from templates based on features and profile
 *
 * Now uses the shared TemplateEngine (Handlebars-based) instead of custom regex parsing.
 */
export class TestGenerator {
  private templatesDir: string;
  private features: FeatureFlags;
  private profile: TestProfileConfig;

  constructor(features: FeatureFlags) {
    this.features = features;
    this.profile = testProfiles[features.testProfile || 'standard'];
    this.templatesDir = getTestTemplatesDir();
  }

  /**
   * Check if profile includes a specific test type
   */
  private includesTestType(type: string): boolean {
    return this.profile.testTypes.includes(type as TestProfileConfig['testTypes'][number]);
  }

  /**
   * Read a template file from the templates directory
   */
  private readTemplate(templateName: string): string {
    // Support both .hbs and legacy .template extensions
    const hbsPath = path.join(this.templatesDir, templateName.replace('.template', '.hbs'));
    const templatePath = path.join(this.templatesDir, templateName);

    const pathToRead = fs.existsSync(hbsPath) ? hbsPath : templatePath;

    try {
      return fs.readFileSync(pathToRead, 'utf-8');
    } catch {
      console.warn(`Template ${templateName} not found, using inline fallback`);
      return '';
    }
  }

  /**
   * Create template context with all features and computed values
   */
  private createContext(): TemplateContext {
    return {
      features: this.features,
      // Also expose features at top level for backwards compatibility with existing templates
      redux: this.features.redux,
      reactRouter: this.features.reactRouter,
      tailwindcss: this.features.tailwindcss,
      typescript: this.features.typescript,
      eslint: this.features.eslint,
      prettier: this.features.prettier,
      i18n: this.features.i18n || false,
      // Computed values
      custom: this.isCustomSetup(),
      coverageThreshold: getCoverageThreshold(this.features.testProfile || 'standard'),
      // Required by TemplateContext
      hasProviders: this.features.redux || this.features.reactRouter || this.features.i18n || false,
      providerOrder: this.computeProviderOrder(),
    };
  }

  /**
   * Compute provider order for test utilities
   */
  private computeProviderOrder(): string[] {
    const order: string[] = [];
    if (this.features.i18n) order.push('i18n');
    if (this.features.redux) order.push('redux');
    if (this.features.reactRouter) order.push('router');
    return order;
  }

  /**
   * Check if this is a custom setup (has Redux or Router)
   */
  private isCustomSetup(): boolean {
    return this.features.redux || this.features.reactRouter;
  }

  /**
   * Process a template with the Handlebars-based TemplateEngine
   */
  private processTemplate(templateContent: string): string {
    if (!templateContent.trim()) {
      return '';
    }

    const context = this.createContext();
    const engine = createTemplateEngineFromFeatures(this.features);

    let result = engine.process(templateContent, context);

    // Ensure proper line endings
    result = result.trim() + '\n';

    return result;
  }

  /**
   * Generate setup.ts content
   */
  generateSetup(): string {
    const template = this.readTemplate('setup.ts.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackSetup();
  }

  /**
   * Generate test-utils.tsx content
   */
  generateTestUtils(): string {
    const template = this.readTemplate('test-utils.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackTestUtils();
  }

  /**
   * Generate App.test.tsx content
   */
  generateAppTest(): string {
    if (!this.includesTestType('unit')) return '';

    const template = this.readTemplate('App.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackAppTest();
  }

  /**
   * Generate store.test.ts content (Redux only)
   */
  generateStoreTest(): string {
    if (!this.features.redux || !this.includesTestType('redux')) return '';

    const template = this.readTemplate('store.test.ts.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate router.test.tsx content (React Router only)
   */
  generateRouterTest(): string {
    if (!this.features.reactRouter || !this.includesTestType('router')) return '';

    const template = this.readTemplate('router.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate integration tests content
   */
  generateIntegrationTest(): string {
    if (!this.includesTestType('integration')) return '';
    if (!this.features.redux && !this.features.reactRouter) return '';

    const template = this.readTemplate('redux-integration.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate a11y tests content
   */
  generateA11yTest(): string {
    if (!this.includesTestType('accessibility')) return '';

    const template = this.readTemplate('a11y.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate performance tests content
   */
  generatePerformanceTest(): string {
    if (!this.includesTestType('performance')) return '';

    const template = this.readTemplate('performance.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate tailwind tests content
   */
  generateTailwindTest(): string {
    if (!this.features.tailwindcss || !this.includesTestType('tailwind')) return '';

    const template = this.readTemplate('tailwind.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate i18n tests content
   */
  generateI18nTest(): string {
    if (!this.features.i18n || !this.includesTestType('i18n')) return '';

    const template = this.readTemplate('i18n.test.tsx.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate vitest.config.ts content
   */
  generateVitestConfig(): string {
    const template = this.readTemplate('vitest.config.ts.hbs');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackVitestConfig();
  }

  /**
   * Get all test files to generate based on profile and features
   */
  getTestFilesToGenerate(): Array<{ filename: string; content: string }> {
    const files: Array<{ filename: string; content: string }> = [];

    // Always include setup and utils
    files.push({ filename: 'setup.ts', content: this.generateSetup() });
    files.push({ filename: 'test-utils.tsx', content: this.generateTestUtils() });

    // App test
    const appTest = this.generateAppTest();
    if (appTest) {
      files.push({ filename: 'App.test.tsx', content: appTest });
    }

    // Redux store test
    const storeTest = this.generateStoreTest();
    if (storeTest) {
      files.push({ filename: 'store.test.ts', content: storeTest });
    }

    // Router test
    const routerTest = this.generateRouterTest();
    if (routerTest) {
      files.push({ filename: 'router.test.tsx', content: routerTest });
    }

    // Integration test
    const integrationTest = this.generateIntegrationTest();
    if (integrationTest) {
      files.push({ filename: 'integration.test.tsx', content: integrationTest });
    }

    // A11y test
    const a11yTest = this.generateA11yTest();
    if (a11yTest) {
      files.push({ filename: 'a11y.test.tsx', content: a11yTest });
    }

    // Performance test
    const performanceTest = this.generatePerformanceTest();
    if (performanceTest) {
      files.push({ filename: 'performance.test.tsx', content: performanceTest });
    }

    // Tailwind test
    const tailwindTest = this.generateTailwindTest();
    if (tailwindTest) {
      files.push({ filename: 'tailwind.test.tsx', content: tailwindTest });
    }

    // i18n test
    const i18nTest = this.generateI18nTest();
    if (i18nTest) {
      files.push({ filename: 'i18n.test.tsx', content: i18nTest });
    }

    return files.filter(f => f.content.trim().length > 0);
  }

  // ============================================================================
  // FALLBACK METHODS
  // ============================================================================

  private getFallbackSetup(): string {
    return `import '@testing-library/jest-dom';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
`;
  }

  private getFallbackTestUtils(): string {
    return `import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

export function renderApp(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

export * from '@testing-library/react';
`;
  }

  private getFallbackAppTest(): string {
    return `import { describe, it, expect } from 'vitest';
import { renderApp } from '../test/test-utils';
import App from '../App';

describe('App', () => {
  it('should render without crashing', () => {
    renderApp(<App />);
    expect(document.body).toBeDefined();
  });
});
`;
  }

  private getFallbackVitestConfig(): string {
    const threshold = getCoverageThreshold(this.features.testProfile || 'standard');
    return `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: ${threshold},
        branches: ${threshold},
        functions: ${threshold},
        lines: ${threshold},
      },
    },
  },
});
`;
  }
}

/**
 * Factory function to create a TestGenerator
 */
export function createTestGenerator(features: FeatureFlags): TestGenerator {
  return new TestGenerator(features);
}
