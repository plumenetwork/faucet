import type { Meta, StoryObj } from '@storybook/react';
import { CheckToastIcon } from '@/app/icons/CheckToastIcon';

const meta = {
  title: 'Icons/Check Toast Icon',
  component: CheckToastIcon,
} satisfies Meta<typeof CheckToastIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
