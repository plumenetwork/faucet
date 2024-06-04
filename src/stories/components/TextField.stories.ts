import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@/app/components/TextField';

const meta = {
  title: 'Components/Text Field',
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
  },
};
