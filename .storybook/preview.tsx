import type { Preview } from '@storybook/react';
import '@/app/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { Inter } from 'next/font/google';

import { Providers } from '@/app/provider';

const inter = Inter({ subsets: ['latin'] });
const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={`${inter.className}`}>
        <Providers>
          <Story />
        </Providers>
      </div>
    ),
  ],
};

export default preview;
