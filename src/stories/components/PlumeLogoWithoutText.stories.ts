import type { Meta, StoryObj } from '@storybook/react';
import PlumeLogoWithoutText from '@/app/components/PlumeLogoWithoutText';

const meta = {
  title: 'Components/Plume Logo Without Text',
  component: PlumeLogoWithoutText,
} satisfies Meta<typeof PlumeLogoWithoutText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
