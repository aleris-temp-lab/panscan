import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from './utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // Base styles
          'w-full rounded-lg border bg-white px-4 py-2.5 text-petrol',
          'placeholder:text-petrol-60',
          'transition-colors',
          // Focus styles
          'focus:outline-none focus:ring-2 focus:ring-petrol focus:ring-offset-2',
          // Disabled styles
          'disabled:cursor-not-allowed disabled:bg-slate disabled:opacity-50',
          // Error/default border
          error ? 'border-red-500' : 'border-slate hover:border-petrol-60',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('mb-1.5 block text-sm font-medium text-petrol', className)}
        {...props}
      />
    )
  }
)

Label.displayName = 'Label'
