import { cloneElement, ReactElement, ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type RadioCardListProps<T> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  children: ReactElement[];
};

export const RadioCardList = <T,>({
  label,
  value,
  onChange,
  children,
}: RadioCardListProps<T>) => {
  return (
    <>
      <div className='text-sm font-medium uppercase leading-5 max-md:max-w-full'>
        {label}
      </div>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-2'>
        {children.map((child) =>
          cloneElement(child, {
            selected: child.props.value === value,
            onChange: onChange,
          })
        )}
      </div>
    </>
  );
};

type RadioCardProps<T> = {
  value: T;
  label: string;
  description?: string;
  image?: ReactNode;
  selected?: boolean;
  onChange?: (value: T) => void;
};

export const RadioCard = <T,>({
  value,
  label,
  description,
  image,
  selected,
  onChange,
}: RadioCardProps<T>) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer rounded-md border bg-white p-2',
        selected && 'border-2 border-blue-500'
      )}
      onClick={() => onChange?.(value)}
    >
      <div className='flex items-center'>{image}</div>
      <div className='flex flex-col pl-2'>
        <div className='font-lufga'>{label}</div>
        {description && (
          <div className='font-lufga text-xs font-medium'>{description}</div>
        )}
      </div>
    </div>
  );
};