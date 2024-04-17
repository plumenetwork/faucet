import CollabHeader from '../components/CollabHeader';
import Header from '../components/Header';
import MintBitgetNFT from '../components/MintBitgetNFT';
import SocialMediaBar from '../components/SocialMediaBar';

export default function Bitget() {
  return (
    <div className="background-red pt-4 px-4 min-h-screen overflow-hidden">
      <Header />
      <div className="background-image-div background-red gap-4 flex flex-col items-center px-4 pt-8 sm:px-16 sm:pt-20 sm:h-full w-full">
        <CollabHeader />
        <MintBitgetNFT />
        <SocialMediaBar />
      </div>
    </div>
  );
}
