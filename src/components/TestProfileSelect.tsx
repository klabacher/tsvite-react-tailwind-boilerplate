import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { TestProfile, TestProfileConfig } from '../types/index.js';
import { testProfiles } from '../config/testProfiles.js';

interface TestProfileSelectProps {
  onSelect: (profile: TestProfile) => void;
  onSkip: () => void;
}

const profileOrder: TestProfile[] = ['bare', 'minimum', 'standard', 'advanced', 'complete'];

const profileIcons: Record<TestProfile, string> = {
  bare: '📦',
  minimum: '🔧',
  standard: '✅',
  advanced: '🚀',
  complete: '💯',
};

export function TestProfileSelect({
  onSelect,
  onSkip,
}: TestProfileSelectProps): React.ReactElement {
  const [cursor, setCursor] = useState(2); // Default to 'standard'

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor(prev => (prev > 0 ? prev - 1 : profileOrder.length - 1));
    } else if (key.downArrow) {
      setCursor(prev => (prev < profileOrder.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(profileOrder[cursor]);
    } else if (key.escape || input === 's') {
      onSkip();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🧪 Select Test Profile
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>Choose the level of testing you want to include in your project.</Text>
      </Box>

      {profileOrder.map((profile, index) => {
        const isSelected = cursor === index;
        const config = testProfiles[profile];
        const icon = profileIcons[profile];

        return (
          <Box
            key={profile}
            flexDirection="column"
            marginBottom={index < profileOrder.length - 1 ? 1 : 0}
          >
            <Box>
              <Text color={isSelected ? 'cyan' : undefined}>
                {isSelected ? '❯ ' : '  '}
                <Text color={isSelected ? 'yellow' : 'white'}>{icon}</Text>{' '}
                <Text bold={isSelected}>{config.name}</Text>
              </Text>
            </Box>
            <Box marginLeft={4}>
              <Text dimColor>{config.description}</Text>
            </Box>
            <Box marginLeft={4}>
              <Text color="gray">
                Coverage: <Text color={getCoverageColor(config.coverage)}>{config.coverage}%</Text>
                {' • '}
                Tests: {getTestTypesLabel(config)}
              </Text>
            </Box>
          </Box>
        );
      })}

      <Box marginTop={2} flexDirection="column">
        <Box>
          <Text dimColor>
            <Text color="cyan">↑↓</Text> navigate • <Text color="cyan">Enter</Text> select •{' '}
            <Text color="cyan">S/Esc</Text> skip (no tests)
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function getCoverageColor(threshold: number): string {
  if (threshold >= 90) return 'green';
  if (threshold >= 70) return 'yellow';
  if (threshold >= 50) return 'cyan';
  return 'gray';
}

function getTestTypesLabel(config: TestProfileConfig): string {
  if (config.testTypes.length === 0) return 'Setup only';

  const typeLabels: Record<string, string> = {
    unit: 'Unit',
    integration: 'Integration',
    accessibility: 'A11y',
    performance: 'Performance',
    snapshot: 'Snapshot',
    redux: 'Redux',
    router: 'Router',
    i18n: 'i18n',
    tailwind: 'Tailwind',
  };

  return config.testTypes.map(t => typeLabels[t] || t).join(', ');
}
