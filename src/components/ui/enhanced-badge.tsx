/**
 * Enhanced Badge Component with smooth textures and proper alignment
 */

import React from 'react';
import { cn } from '@/utils/utils';

interface EnhancedBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

const EnhancedBadge = React.forwardRef<HTMLDivElement, EnhancedBadgeProps>(
  ({ className, variant = 'default', size = 'md', rounded = 'md', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary/10 text-primary border border-primary/20',
      success: 'bg-green-500/10 text-green-700 border border-green-200',
      warning: 'bg-yellow-500/10 text-yellow-700 border border-yellow-200',
      error: 'bg-red-500/10 text-red-700 border border-red-200',
      info: 'bg-blue-500/10 text-blue-700 border border-blue-200',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out',
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EnhancedBadge.displayName = 'EnhancedBadge';

export default EnhancedBadge;
