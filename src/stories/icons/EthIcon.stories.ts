import type { Meta, StoryObj } from '@storybook/react';
import { EthIcon } from '@/app/icons/EthIcon';

const meta = {
  title: 'Icons/ETH Icon',
  component: EthIcon,
} satisfies Meta<typeof EthIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
