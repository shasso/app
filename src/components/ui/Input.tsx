import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Shows error styling when true */
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-error={error || undefined}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white/80 dark:bg-neutral-800/70 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-sm transition
        border-neutral-300/70 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        data-[error=true]:border-red-500 data-[error=true]:focus:ring-red-500 data-[error=true]:focus:border-red-500 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input;