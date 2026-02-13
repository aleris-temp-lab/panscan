import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            // Primary: Orange background (Aleris CTA color)
            'bg-orange text-white hover:bg-orange-80': variant === 'primary',
            // Secondary: Petrol background
            'bg-petrol text-white hover:bg-petrol-80': variant === 'secondary',
            // Outline: Petrol border
            'border-2 border-petrol text-petrol hover:bg-petrol hover:text-white':
              variant === 'outline',
            // Ghost: No background
            'text-petrol hover:bg-petrol-40': variant === 'ghost',
          },
          // Sizes
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-2.5 text-base': size === 'md',
            'px-8 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
