import { sendGAEvent } from '@next/third-parties/google';
import { FaucetToken } from '@/app/lib/types';

export const connectWalletButtonClicked = () => {
  sendEvent('connect_wallet_button_clicked');
};

export const tokenRadioCardSelected = (token: FaucetToken) => {
  sendEvent('token_radio_card_selected', token);
};

export const getTokensButtonClicked = () => {
  sendEvent('get_tokens_button_clicked');
};

const sendEvent = (eventName: string, eventValue?: Object) => {
  if (eventValue) {
    sendGAEvent('event', eventName, eventValue);
  } else {
    sendGAEvent('event', eventName);
  }
};
