import Link from 'next/link';
import CoreFaucet from './components/CoreFaucet';
import PlumeNavBar from './components/PlumeNavBar';
import SocialMediaBar from './components/SocialMediaBar';
import { ArrowUpRight } from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen overflow-hidden'>
      <PlumeNavBar />
      <div className='flex w-full flex-col items-center px-4 sm:h-full sm:px-16 sm:pt-20'>
        <CoreFaucet />
        <Link
          href='https://miles.plumenetwork.xyz/'
          target='_blank'
          className='mt-2 flex items-center gap-1 underline'
        >
          Back to Plume Testnet <ArrowUpRight size={18} />
        </Link>
        <SocialMediaBar />
      </div>
    </div>
  );
}
