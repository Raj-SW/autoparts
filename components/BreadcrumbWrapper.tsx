"use client";

import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

interface BreadcrumbWrapperProps {
  customBreadcrumbs?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function BreadcrumbWrapper({
  customBreadcrumbs,
  className,
  showHome = true,
}: BreadcrumbWrapperProps) {
  const autoBreadcrumbs = useBreadcrumbs();
  const breadcrumbs = customBreadcrumbs || autoBreadcrumbs;

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${className || ""}`}>
      <Breadcrumb items={breadcrumbs} showHome={showHome} />
    </div>
  );
}
