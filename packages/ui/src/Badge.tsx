import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-petrol-40 text-petrol': variant === 'default',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-amber-100 text-amber-800': variant === 'warning',
            'bg-red-100 text-red-800': variant === 'error',
            'bg-blue-100 text-blue-800': variant === 'info',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
