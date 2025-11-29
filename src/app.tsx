import React, { useState, useCallback } from 'react';
import { Box } from 'ink';
import { join } from 'path';
import type {
  WizardState,
  ProjectConfig,
  Template,
  FeatureFlags,
  TestProfile,
} from './types/index.js';
import { templates, getTemplateById, getDefaultTemplate } from './config/templates.js';

// Wizard step components
import { WelcomeScreen } from './components/WelcomeScreen.js';
import { ProjectNameInput } from './components/ProjectNameInput.js';
import { TemplateSelect } from './components/TemplateSelect.js';
import { FeatureSelect } from './components/FeatureSelect.js';
import { TestProfileSelect } from './components/TestProfileSelect.js';
import { PackageManagerSelect } from './components/PackageManagerSelect.js';
import { GitInitPrompt } from './components/GitInitPrompt.js';
import { Summary } from './components/Summary.js';
import { CreatingProject } from './components/CreatingProject.js';
import { CompleteScreen } from './components/CompleteScreen.js';
import { ErrorScreen } from './components/ErrorScreen.js';

interface AppProps {
  initialProjectName?: string;
  templateName?: string;
  skipPrompts?: boolean;
  initGit?: boolean;
  installDeps?: boolean;
  customFeatures?: FeatureFlags;
}

export function App({
  initialProjectName,
  templateName,
  skipPrompts = false,
  initGit = true,
  installDeps = true,
  customFeatures,
}: AppProps): React.ReactElement {
  // Initialize wizard state
  const [state, setState] = useState<WizardState>(() => {
    const template = templateName ? getTemplateById(templateName) : undefined;

    // Use custom features if provided (from CLI flags)
    const features = customFeatures || template?.features || getDefaultTemplate().features;

    return {
      step: skipPrompts && initialProjectName ? 'creating' : 'welcome',
      config: {
        name: initialProjectName,
        targetDir: initialProjectName ? join(process.cwd(), initialProjectName) : undefined,
        template: template || getDefaultTemplate(),
        features,
        packageManager: 'npm',
        initGit,
        installDeps,
        author: '',
        license: 'MIT',
        description: '',
      },
    };
  });

  // Navigation helpers
  const goToStep = useCallback((step: WizardState['step']) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const updateConfig = useCallback(
    <K extends keyof ProjectConfig>(key: K, value: ProjectConfig[K]) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, [key]: value },
      }));
    },
    []
  );

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, step: 'error', error }));
  }, []);

  // Handle welcome screen completion
  const handleWelcomeComplete = useCallback(() => {
    goToStep('project-name');
  }, [goToStep]);

  // Handle project name submission
  const handleProjectNameSubmit = useCallback(
    (name: string, targetDir: string) => {
      updateConfig('name', name);
      updateConfig('targetDir', targetDir);
      goToStep('template-select');
    },
    [updateConfig, goToStep]
  );

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (template: Template) => {
      updateConfig('template', template);
      updateConfig('features', template.features);

      if (template.id === 'custom') {
        goToStep('feature-select');
      } else if (template.features.testing) {
        // If template has testing enabled, ask for test profile
        goToStep('test-profile-select');
      } else {
        goToStep('package-manager');
      }
    },
    [updateConfig, goToStep]
  );

  // Handle feature selection (for custom template)
  const handleFeatureSelect = useCallback(
    (features: FeatureFlags) => {
      updateConfig('features', features);
      // If testing is enabled, ask for test profile
      if (features.testing) {
        goToStep('test-profile-select');
      } else {
        goToStep('package-manager');
      }
    },
    [updateConfig, goToStep]
  );

  // Handle test profile selection
  const handleTestProfileSelect = useCallback(
    (profile: TestProfile) => {
      const currentFeatures = state.config.features || getDefaultTemplate().features;
      updateConfig('features', { ...currentFeatures, testing: true, testProfile: profile });
      goToStep('package-manager');
    },
    [updateConfig, goToStep, state.config.features]
  );

  // Handle skip test profile (disable testing)
  const handleTestProfileSkip = useCallback(() => {
    const currentFeatures = state.config.features || getDefaultTemplate().features;
    updateConfig('features', { ...currentFeatures, testing: false, testProfile: undefined });
    goToStep('package-manager');
  }, [updateConfig, goToStep, state.config.features]);

  // Handle package manager selection
  const handlePackageManagerSelect = useCallback(
    (pm: ProjectConfig['packageManager']) => {
      updateConfig('packageManager', pm);
      goToStep('git-init');
    },
    [updateConfig, goToStep]
  );

  // Handle git init prompt
  const handleGitInit = useCallback(
    (init: boolean) => {
      updateConfig('initGit', init);
      goToStep('summary');
    },
    [updateConfig, goToStep]
  );

  // Handle summary confirmation
  const handleSummaryConfirm = useCallback(() => {
    goToStep('creating');
  }, [goToStep]);

  // Handle summary back
  const handleSummaryBack = useCallback(() => {
    goToStep('template-select');
  }, [goToStep]);

  // Handle project creation complete
  const handleCreationComplete = useCallback(() => {
    goToStep('complete');
  }, [goToStep]);

  // Render current step
  const renderStep = () => {
    switch (state.step) {
      case 'welcome':
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;

      case 'project-name':
        return (
          <ProjectNameInput initialValue={state.config.name} onSubmit={handleProjectNameSubmit} />
        );

      case 'template-select':
        return (
          <TemplateSelect
            templates={templates}
            selectedId={state.config.template?.id}
            onSelect={handleTemplateSelect}
          />
        );

      case 'feature-select':
        return (
          <FeatureSelect
            features={state.config.features || getDefaultTemplate().features}
            onSubmit={handleFeatureSelect}
            onBack={() => goToStep('template-select')}
          />
        );

      case 'test-profile-select':
        return (
          <TestProfileSelect onSelect={handleTestProfileSelect} onSkip={handleTestProfileSkip} />
        );

      case 'package-manager':
        return (
          <PackageManagerSelect
            selected={state.config.packageManager}
            onSelect={handlePackageManagerSelect}
          />
        );

      case 'git-init':
        return <GitInitPrompt onSelect={handleGitInit} />;

      case 'summary':
        return (
          <Summary
            config={state.config as ProjectConfig}
            onConfirm={handleSummaryConfirm}
            onBack={handleSummaryBack}
          />
        );

      case 'creating':
        return (
          <CreatingProject
            config={state.config as ProjectConfig}
            onComplete={handleCreationComplete}
            onError={setError}
          />
        );

      case 'complete':
        return <CompleteScreen config={state.config as ProjectConfig} />;

      case 'error':
        return (
          <ErrorScreen
            error={state.error || 'An unknown error occurred'}
            onRetry={() => goToStep('summary')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      {renderStep()}
    </Box>
  );
}
