import type { Meta, StoryObj } from '@storybook/react';
import { OpenInNewTabIcon } from '@/app/icons/OpenInNewTabIcon';

const meta = {
  title: 'Icons/Open In New Tab Icon',
  component: OpenInNewTabIcon,
} satisfies Meta<typeof OpenInNewTabIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
