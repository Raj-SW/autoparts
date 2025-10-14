import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormCheckboxProps {
  label: string;
  error?: string;
  helperText?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  id?: string;
  name?: string;
}

/**
 * Reusable form checkbox component with label and error handling
 */
export function FormCheckbox({
  label,
  error,
  helperText,
  checked,
  onCheckedChange,
  required = false,
  disabled = false,
  containerClassName,
  id,
  name,
}: FormCheckboxProps) {
  const checkboxId = id || name;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(error && 'border-destructive')}
        />
        <Label
          htmlFor={checkboxId}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            error && 'text-destructive'
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  );
}

