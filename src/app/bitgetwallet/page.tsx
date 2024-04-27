import BitgetEnded from '../components/BitgetEnded';
import CollabHeader from '../components/CollabHeader';
import Header from '../components/Header';
import SocialMediaBar from '../components/SocialMediaBar';

export default function Bitget() {
  return (
    <div className="background-red pt-4 px-4 min-h-screen overflow-hidden">
      <Header />
      <div className="background-image-div background-red gap-4 flex flex-col items-center px-4 pt-8">
        <CollabHeader />
        <BitgetEnded />
        <SocialMediaBar />
      </div>
    </div>
  );
}
