import type { Meta, StoryObj } from '@storybook/react';
import { XBrandIcon } from '@/app/icons/XBrandIcon';

const meta = {
  title: 'Icons/X Brand Icon',
  component: XBrandIcon,
} satisfies Meta<typeof XBrandIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
