import Handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FeatureFlags } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TemplateContext - All variables available for template interpolation
 */
export interface TemplateContext {
  features: FeatureFlags;
  projectName?: string;
  author?: string;
  description?: string;
  license?: string;
  hasProviders: boolean;
  providerOrder: string[];
  [key: string]: unknown;
}

/**
 * TemplateEngine - A Handlebars-powered template processor
 *
 * Supported syntax (standard Handlebars):
 * - {{variable}} - Variable interpolation (HTML escaped)
 * - {{{variable}}} - Unescaped output
 * - {{#if condition}}...{{/if}} - Conditional blocks
 * - {{#if condition}}...{{else}}...{{/if}} - If-else blocks
 * - {{#unless condition}}...{{/unless}} - Negated conditionals
 * - {{#each array}}...{{/each}} - Array iteration with {{this}}, {{@index}}, {{@first}}, {{@last}}
 * - {{#with object}}...{{/with}} - Context switching
 * - {{> partialName}} - Partial inclusion
 * - {{!-- comment --}} - Comments (removed from output)
 *
 * Custom helpers:
 * - {{json value}} - JSON.stringify
 * - {{eq a b}} - Equality check for block helpers
 * - {{neq a b}} - Inequality check
 * - {{and a b}} - Logical AND
 * - {{or a b}} - Logical OR
 * - {{not a}} - Logical NOT
 */
export class TemplateEngine {
  private templatesDir: string;
  private context: TemplateContext;
  private handlebars: typeof Handlebars;

  constructor(context: TemplateContext) {
    this.context = context;
    this.templatesDir = this.findTemplatesDir();
    this.handlebars = Handlebars.create();
    this.registerHelpers();
    this.registerPartials();
  }

  /**
   * Find the templates directory
   */
  private findTemplatesDir(): string {
    const possiblePaths = [
      path.join(__dirname, '../templates/dynamic'),
      path.join(__dirname, '../../templates/dynamic'),
      path.join(__dirname, '../../../templates/dynamic'),
      path.join(process.cwd(), 'templates/dynamic'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    const defaultPath = possiblePaths[0];
    fs.mkdirSync(defaultPath, { recursive: true });
    return defaultPath;
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    // JSON serialization helper
    this.handlebars.registerHelper('json', (value: unknown) => {
      return JSON.stringify(value, null, 2);
    });

    // Equality check (block helper)
    this.handlebars.registerHelper(
      'eq',
      function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
        if (options && typeof options.fn === 'function') {
          return a === b ? options.fn(this) : options.inverse(this);
        }
        return a === b;
      }
    );

    // Inequality check (block helper)
    this.handlebars.registerHelper(
      'neq',
      function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
        if (options && typeof options.fn === 'function') {
          return a !== b ? options.fn(this) : options.inverse(this);
        }
        return a !== b;
      }
    );

    // Logical AND (block helper)
    this.handlebars.registerHelper(
      'and',
      function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
        if (options && typeof options.fn === 'function') {
          return a && b ? options.fn(this) : options.inverse(this);
        }
        return Boolean(a && b);
      }
    );

    // Logical OR (block helper)
    this.handlebars.registerHelper(
      'or',
      function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
        if (options && typeof options.fn === 'function') {
          return a || b ? options.fn(this) : options.inverse(this);
        }
        return Boolean(a || b);
      }
    );

    // Logical NOT (block helper)
    this.handlebars.registerHelper(
      'not',
      function (this: unknown, a: unknown, options: Handlebars.HelperOptions) {
        if (options && typeof options.fn === 'function') {
          return !a ? options.fn(this) : options.inverse(this);
        }
        return !a;
      }
    );

    // Array includes helper
    this.handlebars.registerHelper('includes', (array: unknown[], value: unknown) => {
      return Array.isArray(array) && array.includes(value);
    });

    // String concat helper
    this.handlebars.registerHelper('concat', (...args: unknown[]) => {
      // Remove the options object from args
      args.pop();
      return args.join('');
    });

    // Lookup helper for dynamic property access
    this.handlebars.registerHelper('lookup', (obj: Record<string, unknown>, key: string) => {
      return obj?.[key];
    });
  }

  /**
   * Register partials from the partials directory (recursive)
   */
  private registerPartials(): void {
    const partialsDir = path.join(this.templatesDir, 'partials');
    if (!fs.existsSync(partialsDir)) {
      return;
    }

    this.registerPartialsRecursive(partialsDir, '');
  }

  /**
   * Recursively register partials from a directory
   */
  private registerPartialsRecursive(dir: string, prefix: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectories with updated prefix
        const newPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
        this.registerPartialsRecursive(fullPath, newPrefix);
      } else if (entry.name.endsWith('.hbs')) {
        // Register partial with name derived from path (without .hbs extension)
        const baseName = entry.name.replace('.hbs', '');
        const partialName = prefix ? `${prefix}/${baseName}` : baseName;
        const content = fs.readFileSync(fullPath, 'utf-8');
        this.handlebars.registerPartial(partialName, content);
      }
    }
  }

  /**
   * Process a template string with the current context
   */
  public process(template: string, additionalContext?: Record<string, unknown>): string {
    const finalContext = { ...this.context, ...additionalContext };

    // Compile with noEscape to prevent HTML entity encoding for code generation
    const compiled = this.handlebars.compile(template, { noEscape: true });
    let result = compiled(finalContext);

    // Clean up excessive whitespace
    result = this.cleanupWhitespace(result);

    return result;
  }

  /**
   * Process a template file from the templates directory
   */
  public processFile(templatePath: string, additionalContext?: Record<string, unknown>): string {
    const fullPath = path.isAbsolute(templatePath)
      ? templatePath
      : path.join(this.templatesDir, templatePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Template file not found: ${fullPath}`);
    }

    const template = fs.readFileSync(fullPath, 'utf-8');
    return this.process(template, additionalContext);
  }

  /**
   * Check if a template file exists
   */
  public templateExists(templatePath: string): boolean {
    const fullPath = path.isAbsolute(templatePath)
      ? templatePath
      : path.join(this.templatesDir, templatePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get the templates directory path
   */
  public getTemplatesDir(): string {
    return this.templatesDir;
  }

  /**
   * Update the context
   */
  public setContext(context: Partial<TemplateContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Get the current context
   */
  public getContext(): TemplateContext {
    return { ...this.context };
  }

  /**
   * Clean up excessive whitespace
   */
  private cleanupWhitespace(template: string): string {
    let result = template;

    // Remove more than 2 consecutive blank lines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Remove trailing whitespace from lines
    result = result.replace(/[ \t]+$/gm, '');

    return result;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a TemplateEngine with explicit templates directory
 * @param templatesDir Path to templates directory
 */
export function createTemplateEngine(templatesDir?: string): TemplateEngine {
  const defaultContext: TemplateContext = {
    features: {
      typescript: true,
      tailwindcss: false,
      redux: false,
      reactRouter: false,
      i18n: false,
      eslint: false,
      prettier: false,
      husky: false,
      githubActions: false,
      vscode: false,
      testing: false,
    },
    hasProviders: false,
    providerOrder: [],
  };

  const engine = new TemplateEngine(defaultContext);

  // Override templates dir if provided
  if (templatesDir) {
    (engine as unknown as { templatesDir: string }).templatesDir = templatesDir;
  }

  return engine;
}

/**
 * Create a TemplateEngine from feature flags
 */
export function createTemplateEngineFromFeatures(
  features: FeatureFlags,
  projectConfig?: {
    projectName?: string;
    author?: string;
    description?: string;
    license?: string;
  }
): TemplateEngine {
  const providerOrder: string[] = [];
  if (features.i18n) providerOrder.push('i18n');
  if (features.redux) providerOrder.push('redux');
  if (features.reactRouter) providerOrder.push('router');

  const context: TemplateContext = {
    features,
    projectName: projectConfig?.projectName || 'my-app',
    author: projectConfig?.author || '',
    description: projectConfig?.description || '',
    license: projectConfig?.license || 'MIT',
    hasProviders: providerOrder.length > 0,
    providerOrder,
  };

  return new TemplateEngine(context);
}

/**
 * Create context from project config for template processing
 */
export function createTemplateContext(config: {
  projectName?: string;
  features: FeatureFlags;
  author?: string;
  description?: string;
  license?: string;
}): TemplateContext {
  const providerOrder: string[] = [];
  if (config.features.i18n) providerOrder.push('i18n');
  if (config.features.redux) providerOrder.push('redux');
  if (config.features.reactRouter) providerOrder.push('router');

  return {
    features: config.features,
    projectName: config.projectName || 'my-app',
    author: config.author || '',
    description: config.description || '',
    license: config.license || 'MIT',
    hasProviders: providerOrder.length > 0,
    providerOrder,
  };
}

/**
 * Quick process a template string with features
 */
export function processTemplate(
  template: string,
  features: FeatureFlags,
  additionalContext?: Record<string, unknown>
): string {
  const engine = createTemplateEngineFromFeatures(features);
  return engine.process(template, additionalContext);
}
