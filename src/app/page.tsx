import { backgroundPattern } from './assets';
import CollabHeader from './components/CollabHeader';
import CoreFaucet from './components/CoreFaucet';
import Header from './components/Header';
import SocialMediaBar from './components/SocialMediaBar';

export default function Home() {
  return (
    <div className="bg-stone-950 pt-4 px-4 min-h-screen overflow-hidden">
      <Header />
      <div
        className="flex flex-col items-center px-4 pt-8 sm:px-16 sm:pt-20 sm:h-full w-full"
        style={{ backgroundImage: `url(${backgroundPattern})` }}
      >
        <CollabHeader />
        <CoreFaucet />
        <SocialMediaBar />
      </div>
    </div>
  );
}
