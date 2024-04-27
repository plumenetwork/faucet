import Link from 'next/link';

import BrandDiscord from '../assets/brand-discord.svg';
import BrandLinkedin from '../assets/brand-linkedin.svg';
import BrandTelegram from '../assets/brand-telegram.svg';
import BrandX from '../assets/brand-x.svg';
import World from '../assets/world.svg';

const SocialMediaBar = () => (
  <>
    <div className="pt-10 text-xs font-medium tracking-wide leading-4 text-center capitalize text-neutral-500">
      FOLLOW US
    </div>
    <div className="flex gap-3 mt-4 mb-64 max-md:mb-10">
      <Link href="https://www.plumenetwork.xyz">
        <World className="text-gray-400 hover:text-gray-100" width={32} height={32} />
      </Link>
      <Link href="https://twitter.com/plumenetwork">
        <BrandX className="text-gray-400 hover:text-gray-100" width={32} height={32} />
      </Link>
      <Link href="https://discord.com/invite/plume">
        <BrandDiscord className="text-gray-400 hover:text-gray-100" width={32} height={32} />
      </Link>
      <Link href="https://t.me/plumenetwork">
        <BrandTelegram className="text-gray-400 hover:text-gray-100" width={32} height={32} />
      </Link>
      <Link href="https://www.linkedin.com/company/plume-network">
        <BrandLinkedin className="text-gray-400 hover:text-gray-100" width={32} height={32} />
      </Link>
    </div>
  </>
);

export default SocialMediaBar;
