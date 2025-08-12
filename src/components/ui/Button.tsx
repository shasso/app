import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base = `inline-flex items-center justify-center gap-2 font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`;

const variants: Record<string,string> = {
  solid: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow hover:shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500',
  subtle: 'bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/60 hover:bg-white/90 dark:hover:bg-neutral-700',
  ghost: 'bg-transparent hover:bg-indigo-50/70 dark:hover:bg-neutral-700/60 text-indigo-600 dark:text-indigo-400'
};

const sizes: Record<string,string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-5 py-2.5'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'solid', size = 'md', loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
        )}
        {!loading && leftIcon}
        <span className="truncate">{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;