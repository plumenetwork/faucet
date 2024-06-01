import Link from 'next/link';

import BrandDiscord from '../assets/brand-discord.svg';
import BrandLinkedin from '../assets/brand-linkedin.svg';
import BrandTelegram from '../assets/brand-telegram.svg';
import BrandX from '../assets/brand-x.svg';
import World from '../assets/world.svg';

const SocialMediaBar = () => (
  <>
    <div className='pt-4 text-center text-xs font-medium uppercase leading-4 tracking-wide text-gray-600'>
      Follow Us
    </div>
    <div className='mb-64 mt-4 flex gap-3 max-md:mb-10'>
      <Link href='https://www.plumenetwork.xyz'>
        <World
          className='text-gray-500 hover:text-gray-600'
          width={32}
          height={32}
        />
      </Link>
      <Link href='https://twitter.com/plumenetwork'>
        <BrandX
          className='text-gray-500 hover:text-gray-600'
          width={32}
          height={32}
        />
      </Link>
      <Link href='https://www.linkedin.com/company/plume-network'>
        <BrandLinkedin
          className='text-gray-500 hover:text-gray-600'
          width={32}
          height={32}
        />
      </Link>
    </div>
  </>
);

export default SocialMediaBar;
