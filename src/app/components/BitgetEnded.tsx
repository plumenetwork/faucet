"use client";

import Image from "next/image";
import { bitgetEnded } from '../assets';

const BitgetEnded = () => {
  return (
    <div className="flex flex-col justify-center px-4 py-6 text-base font-medium leading-6 rounded-2xl border border-solid bg-neutral-900 border-zinc-800 max-w-[496px]">
      <div className="flex flex-col justify-center items-center px-4 py-6 rounded-2xl max-w-[496px]">
        <Image
          src={bitgetEnded}
          alt="Bitget Campaign Ended"
          width={96}
          height={96}
        />
      </div>
      <div className="self-center text-2xl font-semibold text-white">
        The campaign has ended
      </div>
      <div className="self-center mt-2 leading-6 text-center text-neutral-400 max-md:max-w-full">
        But don&apos;t worry! We have more campaigns coming up.
      </div>
      <div className="self-center leading-6 text-center text-neutral-400 max-md:max-w-full">
        Follow us on our socials so you don&apos;t miss anything.
      </div>
    </div>
  );
};

export default BitgetEnded;
