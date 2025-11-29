/**
 * Tests for TestGenerator template processing
 */
import { describe, it, expect } from 'vitest';
import { TestGenerator } from '../src/logics/TestGenerator';
import { FeatureFlags } from '../src/types/index';

describe('TestGenerator', () => {
  describe('conditional processing', () => {
    it('should process simple conditionals correctly', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: true,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'standard',
      };

      const generator = new TestGenerator(features);
      const testUtils = generator.generateTestUtils();

      // Redux should be included
      expect(testUtils).toContain('Provider');
      expect(testUtils).toContain('store');
    });

    it('should exclude router when not enabled', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: false,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'minimum',
      };

      const generator = new TestGenerator(features);
      const testUtils = generator.generateTestUtils();

      // Router imports should not be included
      expect(testUtils).not.toContain('MemoryRouter');
      expect(testUtils).not.toContain('react-router-dom');
    });

    it('should handle nested conditionals correctly', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: true,
        redux: true,
        reactRouter: true,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'advanced',
        i18n: true,
      };

      const generator = new TestGenerator(features);
      const testUtils = generator.generateTestUtils();

      // Both Redux and Router should be included
      expect(testUtils).toContain('Provider');
      expect(testUtils).toContain('MemoryRouter');
      // i18n should be included
      expect(testUtils).toContain('I18nextProvider');
    });
  });

  describe('test file generation', () => {
    it('should generate setup file', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: false,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'standard',
      };

      const generator = new TestGenerator(features);
      const setup = generator.generateSetup();

      expect(setup).toContain('@testing-library/jest-dom');
      expect(setup).toContain('matchMedia');
    });

    it('should generate vitest config', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: false,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'advanced',
      };

      const generator = new TestGenerator(features);
      const config = generator.generateVitestConfig();

      expect(config).toContain('vitest/config');
      expect(config).toContain('jsdom');
      // Advanced profile has 80% threshold
      expect(config).toContain('80');
    });

    it('should generate redux store test when redux is enabled', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: true,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'standard',
      };

      const generator = new TestGenerator(features);
      const storeTest = generator.generateStoreTest();

      expect(storeTest).toContain('Redux Store');
      expect(storeTest).toContain('toggleTheme');
    });

    it('should generate router test when router is enabled', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: false,
        reactRouter: true,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'standard',
      };

      const generator = new TestGenerator(features);
      const routerTest = generator.generateRouterTest();

      expect(routerTest).toContain('React Router');
      expect(routerTest).toContain('Navigation');
    });
  });

  describe('getTestFilesToGenerate', () => {
    it('should return files based on profile', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: true,
        redux: true,
        reactRouter: true,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'complete',
        i18n: true,
      };

      const generator = new TestGenerator(features);
      const files = generator.getTestFilesToGenerate();

      // Should include basic files
      expect(files.some(f => f.filename === 'setup.ts')).toBe(true);
      expect(files.some(f => f.filename === 'test-utils.tsx')).toBe(true);

      // Should include feature-specific tests
      expect(files.some(f => f.filename === 'store.test.ts')).toBe(true);
      expect(files.some(f => f.filename === 'router.test.tsx')).toBe(true);
      expect(files.some(f => f.filename === 'tailwind.test.tsx')).toBe(true);
      expect(files.some(f => f.filename === 'i18n.test.tsx')).toBe(true);
    });

    it('should return minimal files for bare profile', () => {
      const features: FeatureFlags = {
        typescript: true,
        tailwindcss: false,
        redux: false,
        reactRouter: false,
        eslint: false,
        prettier: false,
        husky: false,
        githubActions: false,
        vscode: false,
        testing: true,
        testProfile: 'bare',
      };

      const generator = new TestGenerator(features);
      const files = generator.getTestFilesToGenerate();

      // Should only include setup and utils
      expect(files.length).toBe(2);
      expect(files.some(f => f.filename === 'setup.ts')).toBe(true);
      expect(files.some(f => f.filename === 'test-utils.tsx')).toBe(true);
    });
  });
});
