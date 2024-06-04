import type { Meta, StoryObj } from '@storybook/react';
import { UsdtIcon } from '@/app/icons/UsdtIcon';

const meta = {
  title: 'Icons/USDT Icon',
  component: UsdtIcon,
} satisfies Meta<typeof UsdtIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
