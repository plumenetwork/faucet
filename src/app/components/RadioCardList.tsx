import { cloneElement, HTMLAttributes, ReactElement, ReactNode } from 'react';
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
  const isMultipleChildren = children.filter((c) => c).length > 1;
  return (
    <div className='flex flex-col gap-2'>
      <label className='font-lufga text-sm font-semibold uppercase leading-5 max-md:max-w-full'>
        {label}
      </label>
      <div
        className={cn(
          'grid gap-2 max-sm:grid-cols-1',
          isMultipleChildren ? 'grid-cols-2' : 'grid-cols-1'
        )}
      >
        {children.map(
          (child, index) =>
            child &&
            cloneElement(child, {
              disabled: !isMultipleChildren,
              selected: isMultipleChildren && child.props.value === value,
              onChange: onChange,
              key: index,
            })
        )}
      </div>
    </div>
  );
};

type RadioCardProps<T> = HTMLAttributes<HTMLElement> & {
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
  ...props
}: RadioCardProps<T>) => {
  return (
    <div
      key={`${value}`}
      className={cn(
        'flex cursor-pointer rounded-md border bg-white p-2 hover:bg-gray-50',
        selected && 'ring-2 ring-[#111]'
      )}
      onClick={() => onChange?.(value)}
      {...props}
    >
      <div className='flex items-center'>{image}</div>
      <div className='flex flex-col justify-center pl-2'>
        <div className='font-lufga'>{label}</div>
        {description && (
          <div className='font-lufga text-xs font-medium text-gray-500'>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
