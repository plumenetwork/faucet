import Link from 'next/link';
import CoreFaucet from './components/CoreFaucet';
import PlumeNavBar from './components/PlumeNavBar';
import SocialMediaBar from './components/SocialMediaBar';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PlumeBitgetLogo from './components/PlumeBitgetLogo';

export default function Home() {
  return (
    <div className='min-h-screen overflow-hidden'>
      <PlumeNavBar />
      <div className='flex w-full flex-col items-center px-4 sm:h-full sm:px-16 sm:pt-20'>
        <PlumeBitgetLogo/>
        <h1 className='font-lufga text-6xl font-bold' >TASK2GET CLAIM</h1>
        <h2 className='font-lufga text-2xl text-gray-600 mt-2'>Claim Plume Miles for Participating in Task2Get campaign</h2>
        <CoreFaucet />
        <Link
          href='https://miles.plumenetwork.xyz/'
          target='_blank'
          className='mt-4 flex items-center gap-2 rounded-[9999px] bg-white px-6 py-2.5 text-sm text-gray-800 hover:bg-[#FAFAFA]'
        >
          <ArrowLeft size={16} /> Go back to Plume Testnet
        </Link>
        <SocialMediaBar />
      </div>
    </div>
  );
}
