/**
 * Enhanced Button Component with smooth textures and better alignment
 */

import React from 'react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = 'default', size = 'md', rounded = 'md', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      gradient: 'bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
      outline: 'border border-primary/20 text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
    };

    const sizeClasses = {
      sm: 'h-8 px-4 text-sm',
      md: 'h-10 px-6 text-base',
      lg: 'h-12 px-8 text-lg',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95',
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          'font-medium',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;
