import { StoryFn } from '@storybook/react';
import { useToast } from '@/app/components/ui/use-toast';
import { Toaster } from '@/app/components/ui/toaster';

const meta = {
  title: 'Components/Toast',
};

export default meta;

export const Default: StoryFn = () => {
  return (
    <>
      <ToastComponent />
      <Toaster />
    </>
  );
};

const ToastComponent = () => {
  const { toast } = useToast();

  const successToast = () => {
    toast({
      title: 'Request Succeeded',
      description: <>Yay, the request succeeded</>,
      variant: 'pass',
    });
  };

  const failToast = () => {
    toast({
      title: 'Request Failed',
      description: <p>Oops, the request failed</p>,
      variant: 'fail',
    });
  };

  const infoToast = () => {
    toast({
      title: 'Information',
      description: <p>I have no strong opinion about what just happened</p>,
      variant: 'default',
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <button
        className='rounded-md border border-green-500'
        onClick={successToast}
      >
        Success
      </button>
      <button className='rounded-md border border-red-500' onClick={failToast}>
        Fail
      </button>
      <button className='rounded-md border border-blue-500' onClick={infoToast}>
        Info
      </button>
    </div>
  );
};
