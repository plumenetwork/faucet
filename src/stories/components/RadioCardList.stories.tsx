import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { StoryFn } from '@storybook/react';
import { useState } from 'react';
import { FaucetToken } from '@/app/lib/types';
import { EthIcon } from '@/app/icons/EthIcon';
import { UsdcIcon } from '@/app/icons/UsdcIcon';
import { DaiIcon } from '@/app/icons/DaiIcon';
import { UsdtIcon } from '@/app/icons/UsdtIcon';

const meta = {
  title: 'Components/Radio Card List',
};

export default meta;

export const Default: StoryFn = () => {
  const [token, setToken] = useState<FaucetToken>(FaucetToken.ETH);

  return (
    <RadioCardList
      label='Select a Token'
      value={token}
      onChange={(token) => setToken(token)}
    >
      <RadioCard
        image={<EthIcon />}
        value={FaucetToken.ETH}
        label='ETH'
        description='Plume Testnet Ether'
      />
      <RadioCard
        image={<UsdcIcon />}
        value={FaucetToken.USDC}
        label='USDC'
        description='Testnet USD Coin'
      />
      <RadioCard
        image={<DaiIcon />}
        value={FaucetToken.DAI}
        label='DAI'
        description='Testnet DAI Stablecoin'
      />
      <RadioCard
        image={<UsdtIcon />}
        value={FaucetToken.USDT}
        label='USDT'
        description='Testnet Tether USD'
      />
    </RadioCardList>
  );
};
