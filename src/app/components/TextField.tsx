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
    <div className='flex flex-col gap-2'>
      <label className='font-lufga text-sm font-semibold uppercase leading-5 max-md:max-w-full'>
        {label}
      </label>
      <input
        type='text'
        disabled={disabled}
        className='text-gray-60 my-auto flex h-full truncate rounded-lg border border-neutral-700 bg-gray-50 px-3 py-3 text-sm outline-none disabled:border-gray-200 disabled:bg-stone-100 disabled:text-[#555]'
        value={value}
      />
    </div>
  );
};
