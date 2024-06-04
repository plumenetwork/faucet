import type { Meta, StoryObj } from '@storybook/react';
import { WorldIcon } from '@/app/icons/WorldIcon';

const meta = {
  title: 'Icons/World Icon',
  component: WorldIcon,
} satisfies Meta<typeof WorldIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
