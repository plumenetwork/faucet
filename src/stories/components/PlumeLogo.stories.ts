import type { Meta, StoryObj } from '@storybook/react';
import PlumeLogo from '@/app/components/PlumeLogo';

const meta = {
  title: 'Components/Plume Logo',
  component: PlumeLogo,
} satisfies Meta<typeof PlumeLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
