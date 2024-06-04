import type { Meta, StoryObj } from '@storybook/react';
import { DaiIcon } from '@/app/icons/DaiIcon';

const meta = {
  title: 'Icons/DAI Icon',
  component: DaiIcon,
} satisfies Meta<typeof DaiIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
