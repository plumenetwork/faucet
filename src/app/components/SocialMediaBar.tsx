import Link from 'next/link';

import { WorldIcon } from '../icons/WorldIcon';
import { XBrandIcon } from '../icons/XBrandIcon';
import { LinkedInBrandIcon } from '../icons/LinkedInBrandIcon';

const SocialMediaBar = () => (
  <>
    <div className='pt-4 text-center text-xs font-medium uppercase leading-4 tracking-wide text-gray-600'>
      Follow Us
    </div>
    <div className='mb-64 mt-4 flex justify-center gap-3 max-md:mb-10'>
      <Link href='https://www.plumenetwork.xyz'>
        <WorldIcon className='text-gray-500 hover:text-gray-600' />
      </Link>
      <Link href='https://twitter.com/plumenetwork'>
        <XBrandIcon className='text-gray-500 hover:text-gray-600' />
      </Link>
      <Link href='https://www.linkedin.com/company/plume-network'>
        <LinkedInBrandIcon className='text-gray-500 hover:text-gray-600' />
      </Link>
    </div>
  </>
);

export default SocialMediaBar;
