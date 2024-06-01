import Image from 'next/image';

import { bitgetLogo, plume } from '../assets';

const CollabHeader = () => (
  <div className='z-10 mt-0 flex w-[496px] max-w-full items-center justify-center whitespace-nowrap rounded-2xl border border-solid border-zinc-800 bg-neutral-900 px-16 py-6 text-2xl font-medium text-white max-md:mt-0 max-md:px-5'>
    <div className='flex w-60 max-w-full items-center justify-center gap-4 py-px'>
      <Image src={plume} width={100} height={30} alt='plume' />
      <div className='text-md font-sans font-thin text-gray-600'>X</div>
      <Image src={bitgetLogo} width={160} height={30} alt='bitget' />
    </div>
  </div>
);

export default CollabHeader;
