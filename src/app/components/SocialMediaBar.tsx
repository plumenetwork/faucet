import Image from 'next/image';
import Link from 'next/link';

import { linkedin, twitter, website } from '../assets';

const SocialMediaBar = () => (
  <>
    <div className="pt-10 text-xs font-medium tracking-wide leading-4 text-center capitalize text-neutral-500">
      FOLLOW US
    </div>
    <div className="flex gap-3 mt-4 mb-64 max-md:mb-10">
      <Link href="https://www.plumenetwork.xyz">
        <Image src={website} width={32} height={32} alt="website" />
      </Link>
      <Link href="https://twitter.com/plumenetwork">
        <Image src={twitter} width={32} height={32} alt="twitter" />
      </Link>
      <Link href="https://www.linkedin.com/company/plume-network">
        <Image src={linkedin} width={32} height={32} alt="linkedin" />
      </Link>
    </div>
  </>
);

export default SocialMediaBar;
