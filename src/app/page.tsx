import CoreFaucet from './components/CoreFaucet';
import Header from './components/Header';
import SocialMediaBar from './components/SocialMediaBar';

export default function Home() {
  return (
    <div className="background-red pt-4 px-4 min-h-screen overflow-hidden">
      <Header />
      <div className="background-image-div flex flex-col items-center px-4 pt-8 sm:px-16 sm:pt-20 sm:h-full w-full">
        <CoreFaucet />
        <SocialMediaBar />
      </div>
    </div>
  );
}
