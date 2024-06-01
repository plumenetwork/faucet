import CoreFaucet from './components/CoreFaucet';
import PlumeNavBar from './components/PlumeNavBar';
import SocialMediaBar from './components/SocialMediaBar';

export default function Home() {
  return (
    <div className="background-red min-h-screen overflow-hidden">
      <PlumeNavBar />
      <div className="background-image-div flex flex-col items-center px-4 pt-8 sm:px-16 sm:pt-20 sm:h-full w-full">
        <CoreFaucet />
        <SocialMediaBar />
      </div>
    </div>
  );
}
