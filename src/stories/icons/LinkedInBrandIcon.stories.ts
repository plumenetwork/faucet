import type { Meta, StoryObj } from '@storybook/react';
import { LinkedInBrandIcon } from '@/app/icons/LinkedInBrandIcon';

const meta = {
  title: 'Icons/LinkedIn Brand Icon',
  component: LinkedInBrandIcon,
} satisfies Meta<typeof LinkedInBrandIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
