'use client';

import { AlertToastIcon } from '../../icons/AlertToastIcon';
import { CheckToastIcon } from '../../icons/CheckToastIcon';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from './use-toast';
import { InfoIcon } from '@/app/icons/InfoIcon';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast duration={4000} key={id} {...props}>
            <div
              className={`relative w-[400px] rounded-xl border ${
                props.variant === 'pass'
                  ? 'border-green-500'
                  : props.variant === 'fail'
                    ? 'border-red-500'
                    : 'border-blue-500'
              } w-full bg-white p-1`}
            >
              <div className='flex flex-row'>
                <ToastStatusIcon className='' icon={props.variant} />
                <div className='flex w-[300px] flex-col justify-center py-2'>
                  {title && (
                    <ToastTitle
                      className={`text-sm font-semibold leading-5 ${
                        props.variant === 'pass'
                          ? 'text-green-500'
                          : props.variant === 'fail'
                            ? 'text-red-500'
                            : 'text-blue-500'
                      }`}
                    >
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription className='text-sm font-normal'>
                      {description}
                    </ToastDescription>
                  )}
                </div>
              </div>
              {action}
              <ToastClose />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

const ToastStatusIcon = ({ icon }: any) => {
  return (
    <div className='m-1 flex min-w-[38px] self-start'>
      {icon === 'default' && <InfoIcon />}
      {icon === 'pass' && <CheckToastIcon />}
      {icon === 'fail' && <AlertToastIcon />}
    </div>
  );
};
