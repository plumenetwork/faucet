import { RadioCard, RadioCardList } from '@/app/components/RadioCardList';
import { StoryFn } from '@storybook/react';
import { ReactElement, useState } from 'react';
import { FaucetToken, FaucetTokenType } from '@/app/lib/types';
import { EthIcon } from '@/app/icons/EthIcon';
import { UsdcIcon } from '@/app/icons/UsdcIcon';
import { DaiIcon } from '@/app/icons/DaiIcon';
import { UsdtIcon } from '@/app/icons/UsdtIcon';

const meta = {
  title: 'Components/Radio Card List',
};

export default meta;

export const Default: StoryFn = () => {
  const [token, setToken] = useState<FaucetTokenType>(FaucetToken.P);

  return (
    <RadioCardList
      label='Select a Token'
      value={token}
      onChange={(token) => setToken(token)}
    >
      {
        ('ETH' in FaucetToken && (
          <RadioCard
            image={<EthIcon />}
            value={FaucetToken.ETH}
            label='ETH'
            description='Plume Testnet Ether'
            data-testid='eth-radio-card'
          />
        )) as ReactElement
      }
      {
        ('USDC' in FaucetToken && (
          <RadioCard
            image={<UsdcIcon />}
            value={FaucetToken.USDC}
            label='USDC'
            description='Testnet USD Coin'
            data-testid='usdc-radio-card'
          />
        )) as ReactElement
      }
      {
        ('DAI' in FaucetToken && (
          <RadioCard
            image={<DaiIcon />}
            value={FaucetToken.DAI}
            label='DAI'
            description='Testnet DAI Stablecoin'
            data-testid='dai-radio-card'
          />
        )) as ReactElement
      }
      {
        ('USDT' in FaucetToken && (
          <RadioCard
            image={<UsdtIcon />}
            value={FaucetToken.USDT}
            label='USDT'
            description='Testnet Tether USD'
            data-testid='usdt-radio-card'
          />
        )) as ReactElement
      }
    </RadioCardList>
  );
};
