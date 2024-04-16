import Image from 'next/image';

import { bitgetLogo, plume } from '../assets';

const CollabHeader = () => (
  <div className="flex z-10 justify-center items-center px-16 py-6 mt-0 max-w-full text-2xl font-medium text-white whitespace-nowrap rounded-2xl border border-solid bg-neutral-900 border-zinc-800 w-[496px] max-md:px-5 max-md:mt-0">
    <div className="flex gap-4 justify-center py-px w-60 max-w-full items-center">
      <Image src={plume} width={100} height={80} alt="plume" />
      <div className="text-md font-sans text-gray-600 font-thin">X</div>
      <Image src={bitgetLogo} width={85} height={50} alt="bitget" />
    </div>
  </div>
);

export default CollabHeader;
