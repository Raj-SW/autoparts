import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Reusable form input component with label and error handling
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, containerClassName, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className={error ? 'text-destructive' : ''}>
            {label}
            {props.required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

