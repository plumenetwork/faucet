'use client';

import Image from 'next/image';
import { bitgetEnded } from '../assets';

const BitgetEnded = () => {
  return (
    <div className='flex max-w-[496px] flex-col justify-center rounded-2xl border border-solid border-zinc-800 bg-neutral-900 px-4 py-6 text-base font-medium leading-6'>
      <div className='flex max-w-[496px] flex-col items-center justify-center rounded-2xl px-4 py-6'>
        <Image
          src={bitgetEnded}
          alt='Bitget Campaign Ended'
          width={128}
          height={128}
        />
      </div>
      <div className='self-center text-2xl font-semibold text-white'>
        The campaign has ended
      </div>
      <div className='mt-2 self-center text-center leading-6 text-neutral-400 max-md:max-w-full'>
        But don&apos;t worry! We have more campaigns coming up.
      </div>
      <div className='self-center text-center leading-6 text-neutral-400 max-md:max-w-full'>
        Follow us on our socials so you don&apos;t miss anything.
      </div>
    </div>
  );
};

export default BitgetEnded;
