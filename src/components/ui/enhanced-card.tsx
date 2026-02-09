/**
 * Enhanced Card Component with smooth textures and proper alignment
 */

import React from 'react';
import { cn } from '@/utils/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'success' | 'info' | 'warning' | 'error';
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  children: React.ReactNode;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', padding = 'md', rounded = 'lg', shadow = 'md', border = true, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-border/50',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20',
      gradient: 'bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20',
      elevated: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
      success: 'bg-green-50 border-green-200',
      info: 'bg-blue-50 border-blue-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200',
    };

    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
    };

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]',
          variantClasses[variant],
          paddingClasses[padding],
          roundedClasses[rounded],
          shadowClasses[shadow],
          border && 'border',
          className
        )}
        {...props}
      >
        <CardContent className="p-0">
          {children}
        </CardContent>
      </Card>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

export default EnhancedCard;
