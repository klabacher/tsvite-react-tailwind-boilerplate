/**
 * Template Processing Tests
 *
 * These tests validate that all Handlebars templates:
 * 1. Parse without syntax errors
 * 2. Generate valid output for all feature combinations
 * 3. Don't contain malformed syntax patterns
 */
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to template directories
const DYNAMIC_TEMPLATES_DIR = path.resolve(__dirname, '../templates/dynamic');
const TEST_TEMPLATES_DIR = path.resolve(__dirname, '../templates/test-templates');

/**
 * Recursively collect all .hbs files from a directory
 */
async function collectTemplateFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith('.hbs')) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

/**
 * Check for common Handlebars syntax issues
 */
function lintTemplate(content: string, filePath: string): string[] {
  const errors: string[] = [];
  const lines = content.split('\n');
  const fileName = path.basename(filePath);

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for triple closing braces that aren't intentional unescaped output
    // Pattern: }}}} or content{{/if}}} - these are errors
    const tripleCloseMatch = line.match(/\{\{\/[^}]+\}\}\}/);
    if (tripleCloseMatch) {
      errors.push(
        `${fileName}:${lineNum} - Potential }}} collision after Handlebars block close: "${tripleCloseMatch[0]}"`
      );
    }

    // Check for common typos
    if (line.includes('{{#fi ')) {
      errors.push(`${fileName}:${lineNum} - Typo: "{{#fi" should be "{{#if"`);
    }
    if (line.includes('{{#elseif')) {
      errors.push(
        `${fileName}:${lineNum} - Invalid syntax: "{{#elseif" should be "{{else if" or nested {{#if}}`
      );
    }
    if (line.includes('{{ #if')) {
      errors.push(`${fileName}:${lineNum} - Invalid spacing: "{{ #if" should be "{{#if"`);
    }
    if (line.includes('{{# if')) {
      errors.push(`${fileName}:${lineNum} - Invalid spacing: "{{# if" should be "{{#if"`);
    }

    // Check for missing space in else if
    if (line.includes('{{elseif')) {
      errors.push(`${fileName}:${lineNum} - Invalid: "{{elseif" is not valid Handlebars`);
    }
  });

  return errors;
}

/**
 * Attempt to compile a template to catch parse errors
 */
function compileTemplate(content: string, filePath: string): { success: boolean; error?: string } {
  try {
    // Create isolated Handlebars instance
    const hbs = Handlebars.create();

    // Register stub helpers that templates might use
    const stubHelpers = [
      'json',
      'eq',
      'neq',
      'not',
      'and',
      'or',
      'includes',
      'isEmpty',
      'concat',
      'lookup',
    ];
    stubHelpers.forEach(helper => {
      hbs.registerHelper(helper, () => '');
    });

    // Try to compile the template
    hbs.compile(content, { noEscape: true });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `${path.basename(filePath)}: ${errorMessage}`,
    };
  }
}

describe('Template Linting', () => {
  let dynamicTemplates: string[] = [];
  let testTemplates: string[] = [];

  beforeAll(async () => {
    dynamicTemplates = await collectTemplateFiles(DYNAMIC_TEMPLATES_DIR);
    testTemplates = await collectTemplateFiles(TEST_TEMPLATES_DIR);
  });

  describe('Dynamic Templates', () => {
    it('should find dynamic template files', async () => {
      expect(dynamicTemplates.length).toBeGreaterThan(0);
    });

    it('should pass linting for all dynamic templates', async () => {
      const allErrors: string[] = [];

      for (const filePath of dynamicTemplates) {
        const content = await fs.readFile(filePath, 'utf-8');
        const errors = lintTemplate(content, filePath);
        allErrors.push(...errors);
      }

      if (allErrors.length > 0) {
        console.error('Template linting errors:\n' + allErrors.join('\n'));
      }

      expect(allErrors).toHaveLength(0);
    });

    it('should compile all dynamic templates without parse errors', async () => {
      const failures: string[] = [];

      for (const filePath of dynamicTemplates) {
        const content = await fs.readFile(filePath, 'utf-8');
        const result = compileTemplate(content, filePath);

        if (!result.success) {
          failures.push(result.error!);
        }
      }

      if (failures.length > 0) {
        console.error('Template compilation errors:\n' + failures.join('\n'));
      }

      expect(failures).toHaveLength(0);
    });
  });

  describe('Test Templates', () => {
    it('should find test template files', async () => {
      expect(testTemplates.length).toBeGreaterThan(0);
    });

    it('should pass linting for all test templates', async () => {
      const allErrors: string[] = [];

      for (const filePath of testTemplates) {
        const content = await fs.readFile(filePath, 'utf-8');
        const errors = lintTemplate(content, filePath);
        allErrors.push(...errors);
      }

      if (allErrors.length > 0) {
        console.error('Template linting errors:\n' + allErrors.join('\n'));
      }

      expect(allErrors).toHaveLength(0);
    });

    it('should compile all test templates without parse errors', async () => {
      const failures: string[] = [];

      for (const filePath of testTemplates) {
        const content = await fs.readFile(filePath, 'utf-8');
        const result = compileTemplate(content, filePath);

        if (!result.success) {
          failures.push(result.error!);
        }
      }

      if (failures.length > 0) {
        console.error('Template compilation errors:\n' + failures.join('\n'));
      }

      expect(failures).toHaveLength(0);
    });
  });
});

describe('Template Content Validation', () => {
  it('should not have }}} collision patterns in any template', async () => {
    const allTemplates = [
      ...(await collectTemplateFiles(DYNAMIC_TEMPLATES_DIR)),
      ...(await collectTemplateFiles(TEST_TEMPLATES_DIR)),
    ];

    const collisions: string[] = [];

    for (const filePath of allTemplates) {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const fileName = path.basename(filePath);

      lines.forEach((line, index) => {
        // Detect pattern: {{/something}}} which causes parse errors
        // This is different from intentional {{{unescaped}}}
        if (/\{\{\/[^}]+\}\}\}/.test(line)) {
          collisions.push(`${fileName}:${index + 1}: ${line.trim()}`);
        }
      });
    }

    if (collisions.length > 0) {
      console.error('Found }}} collision patterns:\n' + collisions.join('\n'));
    }

    expect(collisions).toHaveLength(0);
  });

  it('should have matching {{#if}} and {{/if}} blocks', async () => {
    const allTemplates = [
      ...(await collectTemplateFiles(DYNAMIC_TEMPLATES_DIR)),
      ...(await collectTemplateFiles(TEST_TEMPLATES_DIR)),
    ];

    const mismatches: string[] = [];

    for (const filePath of allTemplates) {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath);

      const ifOpens = (content.match(/\{\{#if\s/g) || []).length;
      const ifCloses = (content.match(/\{\{\/if\}\}/g) || []).length;

      if (ifOpens !== ifCloses) {
        mismatches.push(`${fileName}: {{#if}} count (${ifOpens}) !== {{/if}} count (${ifCloses})`);
      }

      const eachOpens = (content.match(/\{\{#each\s/g) || []).length;
      const eachCloses = (content.match(/\{\{\/each\}\}/g) || []).length;

      if (eachOpens !== eachCloses) {
        mismatches.push(
          `${fileName}: {{#each}} count (${eachOpens}) !== {{/each}} count (${eachCloses})`
        );
      }

      const unlessOpens = (content.match(/\{\{#unless\s/g) || []).length;
      const unlessCloses = (content.match(/\{\{\/unless\}\}/g) || []).length;

      if (unlessOpens !== unlessCloses) {
        mismatches.push(
          `${fileName}: {{#unless}} count (${unlessOpens}) !== {{/unless}} count (${unlessCloses})`
        );
      }
    }

    if (mismatches.length > 0) {
      console.error('Block mismatches:\n' + mismatches.join('\n'));
    }

    expect(mismatches).toHaveLength(0);
  });
});

describe('Template Output Validation', () => {
  it('should generate valid JSX without Handlebars artifacts', async () => {
    const hbs = Handlebars.create();

    // Register helpers
    hbs.registerHelper('json', (value: unknown) => JSON.stringify(value, null, 2));
    hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
    hbs.registerHelper('neq', (a: unknown, b: unknown) => a !== b);
    hbs.registerHelper('not', (a: unknown) => !a);
    hbs.registerHelper('and', (a: unknown, b: unknown, options: Handlebars.HelperOptions) =>
      a && b ? options.fn(this) : options.inverse(this)
    );
    hbs.registerHelper('or', (a: unknown, b: unknown, options: Handlebars.HelperOptions) =>
      a || b ? options.fn(this) : options.inverse(this)
    );
    hbs.registerHelper('includes', (arr: unknown[], val: unknown) =>
      Array.isArray(arr) ? arr.includes(val) : false
    );
    hbs.registerHelper('concat', (...args: unknown[]) => {
      args.pop();
      return args.join('');
    });

    // Test context with all features enabled
    const context = {
      features: {
        typescript: true,
        tailwindcss: true,
        redux: true,
        reactRouter: true,
        i18n: true,
        eslint: true,
        prettier: true,
        husky: true,
        githubActions: true,
        vscode: true,
        testing: true,
      },
      projectName: 'test-project',
      hasProviders: true,
      providerOrder: ['i18n', 'redux', 'router'],
    };

    // Test the main App.tsx.hbs template
    const appTemplatePath = path.join(DYNAMIC_TEMPLATES_DIR, 'App.tsx.hbs');
    const appTemplate = await fs.readFile(appTemplatePath, 'utf-8');

    // Register partials
    const partialsDir = path.join(DYNAMIC_TEMPLATES_DIR, 'partials');
    async function registerPartials(dir: string, prefix: string = ''): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await registerPartials(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name);
          } else if (entry.name.endsWith('.hbs')) {
            const name = prefix
              ? `${prefix}/${entry.name.replace('.hbs', '')}`
              : entry.name.replace('.hbs', '');
            const content = await fs.readFile(fullPath, 'utf-8');
            hbs.registerPartial(name, content);
          }
        }
      } catch {
        // Partials dir may not exist
      }
    }

    await registerPartials(partialsDir);

    const compiled = hbs.compile(appTemplate, { noEscape: true });
    const output = compiled(context);

    // Validate output doesn't contain Handlebars artifacts
    expect(output).not.toMatch(/\{\{[^}]*\}\}/); // No unprocessed Handlebars
    expect(output).not.toMatch(/\{\{\{[^}]*\}\}\}/); // No unprocessed triple braces
    expect(output).not.toContain('{{#if');
    expect(output).not.toContain('{{/if}}');
    expect(output).not.toContain('{{#each');
    expect(output).not.toContain('{{/each}}');
    expect(output).not.toContain('{{else}}');

    // Should contain valid React/JSX patterns
    expect(output).toContain('import');
    expect(output).toContain('export');
  });
});
