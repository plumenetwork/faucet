import { sendGAEvent } from '@next/third-parties/google';
import { FaucetToken } from '@/app/lib/types';

export const connectWalletButtonClicked = () => {
  sendGAEvent({ event: 'connectWalletButtonClicked' });
};

export const tokenRadioCardSelected = (token: FaucetToken) => {
  sendGAEvent({ event: 'tokenRadioCardSelected', value: token });
};

export const getTokensButtonClicked = () => {
  sendGAEvent({ event: 'getTokensButtonClicked' });
};
