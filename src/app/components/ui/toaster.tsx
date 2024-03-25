"use client";

import Image from 'next/image';

import { alertIcon, checkmarkIcon } from '../../assets';
import {
    Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport
} from './toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast duration={10000} key={id} {...props}>
            <div
              className={`relative w-[400px] ${
                props.variant === "pass"
                  ? "rounded-xl border border-green-500"
                  : props.variant === "fail"
                  ? "rounded-xl border border-toast-red"
                  : "rounded-xl border border-blue-500"
              } w-full bg-[#141414] p-1`}
            >
              <div className="flex flex-row">
                <ToastStatusIcon className="" icon={props.variant} />
                <div className="flex w-[300px] flex-col justify-center py-2 pl-2">
                  {title && (
                    <ToastTitle
                      className={`text-sm font-semibold leading-5 ${
                        props.variant === "pass"
                          ? "text-green-500"
                          : props.variant === "fail"
                          ? "text-toast-red"
                          : "text-blue-500"
                      }`}
                    >
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription className="text-sm font-normal text-neutral-600">
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
  return icon !== "default" ? (
    <div className="m-1 flex min-w-[38px] self-start">
      {icon === "pass" && (
        <Image src={checkmarkIcon} alt="check toast" width={38} height={38} />
      )}
      {icon === "fail" && (
        <Image src={alertIcon} alt="alert toast" width={38} height={38} />
      )}
    </div>
  ) : null;
};
