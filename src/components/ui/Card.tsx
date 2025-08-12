import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const base = `rounded-xl bg-white/70 dark:bg-neutral-800/60 backdrop-blur border border-neutral-200/70 dark:border-neutral-700/60 shadow-sm`;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${base} ${className}`} {...props} />
  )
);
Card.displayName = 'Card';

export const CardHeader = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-5 pt-5 pb-3 ${className}`} {...props} />
);
export const CardTitle = ({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-sm font-semibold tracking-wide text-neutral-700 dark:text-neutral-200 ${className}`} {...props} />
);
export const CardDescription = ({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed ${className}`} {...props} />
);
export const CardContent = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-5 pb-5 ${className}`} {...props} />
);
export const CardFooter = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-5 pb-5 pt-3 border-t border-neutral-200/70 dark:border-neutral-700/60 ${className}`} {...props} />
);

export default Card;