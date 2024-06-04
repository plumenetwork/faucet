import type { Meta, StoryObj } from '@storybook/react';
import SocialMediaBar from '@/app/components/SocialMediaBar';

const meta = {
  title: 'Components/Social Media Bar',
  component: SocialMediaBar,
} satisfies Meta<typeof SocialMediaBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
