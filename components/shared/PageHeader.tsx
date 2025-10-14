import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Reusable page header component
 */
export function PageHeader({ title, description, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('border-b bg-background', className)}>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
              {badge}
            </div>
            {description && <p className="text-sm text-muted-foreground md:text-base">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

