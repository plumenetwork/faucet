import Image from 'next/image';
import Link from 'next/link';

import { brandDiscord, brandLinkedin, brandTelegram, brandX, world } from '../assets';

const SocialMediaBar = () => (
  <>
    <div className="pt-10 text-xs font-medium tracking-wide leading-4 text-center capitalize text-neutral-500">
      FOLLOW US
    </div>
    <div className="flex gap-3 mt-4 mb-64 max-md:mb-10">
      <Link href="https://www.plumenetwork.xyz">
        <Image src={world} width={32} height={32} alt="Plume website" />
      </Link>
      <Link href="https://twitter.com/plumenetwork">
        <Image src={brandX} width={32} height={32} alt="Plume on X" />
      </Link>
      <Link href="https://discord.com/invite/plume">
        <Image src={brandDiscord} width={32} height={32} alt="Plume on Discord" />
      </Link>
      <Link href="https://t.me/plumenetwork">
        <Image src={brandTelegram} width={32} height={32} alt="Plume on Telegram" />
      </Link>
      <Link href="https://www.linkedin.com/company/plume-network">
        <Image src={brandLinkedin} width={32} height={32} alt="Plume on LinkedIn" />
      </Link>
    </div>
  </>
);

export default SocialMediaBar;
