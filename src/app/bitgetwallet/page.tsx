import BitgetEnded from '../components/BitgetEnded';
import CollabHeader from '../components/CollabHeader';
import Header from '../components/Header';
import SocialMediaBar from '../components/SocialMediaBar';

export default function Bitget() {
  return (
    <div className='background-red min-h-screen overflow-hidden px-4 pt-4'>
      <Header />
      <div className='background-image-div background-red flex flex-col items-center gap-4 px-4 pt-8'>
        <CollabHeader />
        <BitgetEnded />
        <SocialMediaBar />
      </div>
    </div>
  );
}
