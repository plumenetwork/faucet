import CoreFaucet from './components/CoreFaucet';
import PlumeNavBar from './components/PlumeNavBar';
import SocialMediaBar from './components/SocialMediaBar';

export default function Home() {
  return (
    <div className='min-h-screen overflow-hidden'>
      <PlumeNavBar />
      <div className='flex w-full flex-col items-center px-4 sm:h-full sm:px-16 sm:py-20'>
        <CoreFaucet />
        <SocialMediaBar />
      </div>
    </div>
  );
}
