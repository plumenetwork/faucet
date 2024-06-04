import type { Meta, StoryObj } from '@storybook/react';
import { AlertToastIcon } from '@/app/icons/AlertToastIcon';

const meta = {
  title: 'Icons/Alert Toast Icon',
  component: AlertToastIcon,
} satisfies Meta<typeof AlertToastIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
