import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-styling-webpack', '@storybook/addon-controls'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_RAINBOW_PROJECT_ID: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID,
  }),
};
export default config;
