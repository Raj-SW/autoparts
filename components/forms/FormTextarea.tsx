import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Reusable form textarea component with label and error handling
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
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
        <Textarea
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

FormTextarea.displayName = 'FormTextarea';

