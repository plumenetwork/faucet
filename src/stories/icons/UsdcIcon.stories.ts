import type { Meta, StoryObj } from '@storybook/react';
import { UsdcIcon } from '@/app/icons/UsdcIcon';

const meta = {
  title: 'Icons/USDC Icon',
  component: UsdcIcon,
} satisfies Meta<typeof UsdcIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
