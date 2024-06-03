import { FC } from 'react';

type TextFieldProps = {
  label: string;
  value?: string;
  disabled?: boolean;
};

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  disabled = false,
}) => {
  return (
    <>
      <div className='text-sm font-medium uppercase leading-5 max-md:max-w-full'>
        {label}
      </div>
      <label className='flex gap-2.5 whitespace-nowrap rounded-lg border border-solid border-neutral-700 bg-gray-50 px-3 py-3 text-sm max-md:flex-wrap md:justify-between'>
        <input
          type='text'
          disabled={disabled}
          className='text-gray-60 my-auto h-full flex-1 border-none outline-none'
          value={value}
        />
      </label>
    </>
  );
};
