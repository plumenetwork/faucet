import { ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { ringedCheckmark } from '../assets';

function SuccessNFTClaim({ mintSuccessHash }: { mintSuccessHash: string }) {
  const onClickShareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=I've%20just%20minted%20my%20Plume%20x%20Bitget%20NFT!%20Can't%20wait%20to%20see%20what%20it%20reveals%20-%20come%20claim%20yours%20now%20for%20a%20chance%20to%20earn%20more%20Plume%20and%20BWB%20points!%20&url=https://faucet.plumenetwork.com/mint&image_src=https://assets.plumenetwork.xyz/images/nfts/plume-bitget-nft.png&call_to_action=Share%20this%20Tweet!`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center px-4 pt-6 text-2xl font-medium leading-9 rounded-2xl bg-neutral-900 border-zinc-800 max-w-[496px]">
      <Image
        src="https://assets.plumenetwork.xyz/images/nfts/plume-bitget-nft.png"
        alt="Bitget NFT Hidden"
        width={400}
        height={400}
      />
      <Image
        src={ringedCheckmark}
        alt="Ringed Checkmark"
        width={55}
        height={55}
      />
      <div className="font-semibold text-center text-white max-md:max-w-full">
        Thank you for minting!
      </div>
      <div className="self-stretch mt-2 text-base text-center text-neutral-400 max-md:max-w-full">
        Your NFT will appear shortly in your wallet.
      </div>
      <div
        onClick={onClickShareOnX}
        className="flex gap-2 px-4 py-2 mt-2 text-sm leading-5 text-white rounded-lg border border-solid shadow-sm bg-zinc-800 border-zinc-800 hover:bg-zinc-700 cursor-pointer"
      >
        <X size={24} />
        <div className="my-auto">Share on X</div>
      </div>
      <div className="flex gap-1.5 justify-center mt-2 text-sm text-blue-400">
        <Link
          href={
            mintSuccessHash !== "" && mintSuccessHash !== "undefined"
              ? `https://testnet-explorer.plumenetwork.xyz/tx/${mintSuccessHash}`
              : "https://testnet-explorer.plumenetwork.xyz/address/0x4383B172d7102A5c74dc3AB5d53690e42b73E174"
          }
          target="_blank"
          className="flex gap-1.5"
        >
          View Token
        </Link>
        <ExternalLink size={16} />
      </div>
    </div>
  );
}

export default SuccessNFTClaim;
