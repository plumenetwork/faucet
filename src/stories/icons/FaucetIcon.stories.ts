import type { Meta, StoryObj } from '@storybook/react';
import { FaucetIcon } from '@/app/icons/FaucetIcon';

const meta = {
  title: 'Icons/Faucet Icon',
  component: FaucetIcon,
} satisfies Meta<typeof FaucetIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
