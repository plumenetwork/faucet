import { sendGTMEvent } from '@next/third-parties/google';
import { FaucetToken } from '@/app/lib/types';

export const connectWalletButtonClicked = () => {
  sendGTMEvent({ event: 'connectWalletButtonClicked' });
};

export const tokenRadioCardSelected = (token: FaucetToken) => {
  sendGTMEvent({ event: 'tokenRadioCardSelected', value: token });
};

export const getTokensButtonClicked = () => {
  sendGTMEvent({ event: 'getTokensButtonClicked' });
};
