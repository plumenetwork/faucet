import { ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ringedCheckmark } from '../assets';

function SuccessNFTClaim({ mintSuccessHash }: { mintSuccessHash: string }) {
  const onClickShareOnX = () => {
    const tweetText = encodeURIComponent(
      'I’ve just minted my @PlumeNetwork x @BitgetWallet NFT!\nCan’t wait to see what it reveals - come claim yours now for a chance to earn more #PlumeNetwork and #BWB points!'
    );
    const tweetUrl = 'https://app.galxe.com/quest/PlumeNetwork/GCehethHdP';
    const tweetHashtags = ['RWA'];
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}&hashtags=${tweetHashtags.join(',')}&call_to_action=Share%20this%20Tweet!`,
      '_blank'
    );
  };

  return (
    <div className='flex max-w-[496px] flex-col items-center justify-center gap-2 rounded-2xl border-zinc-800 bg-neutral-900 px-4 pt-6 text-2xl font-medium leading-9'>
      <Image
        src='https://assets.plumenetwork.xyz/images/nfts/plume-bitget-nft.png'
        alt='Plume x Bitget NFT Image'
        width={400}
        height={400}
      />
      <Image
        src={ringedCheckmark}
        alt='Ringed Checkmark'
        width={55}
        height={55}
      />
      <div className='text-center font-semibold text-white max-md:max-w-full'>
        Thank you for minting!
      </div>
      <div className='mt-2 self-stretch text-center text-base text-neutral-400 max-md:max-w-full'>
        Your NFT will appear shortly in your wallet.
      </div>
      <div
        onClick={onClickShareOnX}
        className='mt-2 flex cursor-pointer gap-2 rounded-lg border border-solid border-zinc-800 bg-zinc-800 px-4 py-2 text-sm leading-5 text-white shadow-sm hover:bg-zinc-700'
      >
        <X size={24} />
        <div className='my-auto'>Share on X</div>
      </div>
      <div className='mt-2 flex justify-center gap-1.5 text-sm text-blue-400'>
        <Link
          href={
            mintSuccessHash !== '' && mintSuccessHash !== 'undefined'
              ? `https://testnet-explorer.plumenetwork.xyz/tx/${mintSuccessHash}`
              : 'https://testnet-explorer.plumenetwork.xyz/address/0x4383B172d7102A5c74dc3AB5d53690e42b73E174'
          }
          target='_blank'
          className='flex gap-1.5'
        >
          View Token
        </Link>
        <ExternalLink size={16} />
      </div>
    </div>
  );
}

export default SuccessNFTClaim;
