import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const sharedCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
