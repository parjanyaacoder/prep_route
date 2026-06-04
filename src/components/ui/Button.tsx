import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95 focus:ring-blue-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 focus:ring-gray-500",
    outline: "border-2 border-gray-200 bg-transparent hover:border-gray-300 hover:bg-gray-50 active:scale-95 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95 focus:ring-gray-500",
  };

  const sizes = "px-4 py-2.5 text-sm"; // default size

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
