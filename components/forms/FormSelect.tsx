import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  id?: string;
  name?: string;
}

/**
 * Reusable form select component with label and error handling
 */
export function FormSelect({
  label,
  error,
  helperText,
  options,
  placeholder = 'Select an option',
  value,
  onValueChange,
  required = false,
  disabled = false,
  containerClassName,
  id,
  name,
}: FormSelectProps) {
  const selectId = id || name;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label htmlFor={selectId} className={error ? 'text-destructive' : ''}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          className={cn(error && 'border-destructive focus:ring-destructive')}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  );
}

