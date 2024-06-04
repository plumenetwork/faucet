import type { Meta, StoryObj } from '@storybook/react';
import PlumeNavBar from '@/app/components/PlumeNavBar';

const meta = {
  title: 'Components/Plume Nav Bar',
  component: PlumeNavBar,
} satisfies Meta<typeof PlumeNavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
