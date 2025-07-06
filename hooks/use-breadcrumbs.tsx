import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icons } from "@/components/ui/icons";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";

interface RouteConfig {
  title: string;
  icon?: React.ReactNode;
  dynamic?: boolean;
}

const routeConfig: Record<string, RouteConfig> = {
  // Main routes
  "/": { title: "Home", icon: <Icons.home className="h-4 w-4" /> },
  "/about": { title: "About Us" },
  "/contact": { title: "Contact" },
  "/catalog": { title: "Catalog", icon: <Icons.package className="h-4 w-4" /> },
  "/quote": {
    title: "Request Quote",
    icon: <Icons.fileText className="h-4 w-4" />,
  },
  "/partner": {
    title: "Partner Application",
    icon: <Icons.users className="h-4 w-4" />,
  },
  "/checkout": { title: "Checkout", icon: <Icons.cart className="h-4 w-4" /> },
  "/checkout/success": {
    title: "Order Success",
    icon: <Icons.checkCircle className="h-4 w-4" />,
  },

  // Auth routes
  "/login": { title: "Login", icon: <Icons.user className="h-4 w-4" /> },
  "/register": { title: "Register", icon: <Icons.user className="h-4 w-4" /> },

  // User routes
  "/dashboard": {
    title: "Dashboard",
    icon: <Icons.trendingUp className="h-4 w-4" />,
  },
  "/orders": { title: "Orders", icon: <Icons.fileText className="h-4 w-4" /> },

  // Admin routes
  "/admin": {
    title: "Admin Dashboard",
    icon: <Icons.settings className="h-4 w-4" />,
  },
  "/admin/parts": {
    title: "Parts Management",
    icon: <Icons.package className="h-4 w-4" />,
  },
  "/admin/quotes": {
    title: "Quote Management",
    icon: <Icons.fileText className="h-4 w-4" />,
  },
  "/admin/partners": {
    title: "Partner Management",
    icon: <Icons.users className="h-4 w-4" />,
  },
  "/admin/users": {
    title: "User Management",
    icon: <Icons.users className="h-4 w-4" />,
  },

  // Dynamic routes patterns
  "/catalog/[id]": { title: "Part Details", dynamic: true },
  "/orders/[id]": { title: "Order Details", dynamic: true },
  "/admin/orders/[id]": { title: "Order Details", dynamic: true },
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Build breadcrumbs from path segments
    for (let i = 0; i < segments.length; i++) {
      const currentPath = "/" + segments.slice(0, i + 1).join("/");
      const segment = segments[i];

      // Check if this is a dynamic route
      let config = routeConfig[currentPath];

      // If not found, check for dynamic route patterns
      if (!config) {
        const dynamicPath =
          "/" +
          segments
            .slice(0, i + 1)
            .map((seg, idx) => {
              // If segment looks like an ID (contains numbers/letters), replace with [id]
              if (idx === segments.length - 1 && /^[a-zA-Z0-9]+$/.test(seg)) {
                return "[id]";
              }
              return seg;
            })
            .join("/");

        config = routeConfig[dynamicPath];
      }

      if (config) {
        breadcrumbs.push({
          title: config.title,
          href: i === segments.length - 1 ? undefined : currentPath, // No href for last item
          icon: config.icon,
        });
      } else {
        // Fallback: use segment name with proper formatting
        const title = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        breadcrumbs.push({
          title,
          href: i === segments.length - 1 ? undefined : currentPath,
        });
      }
    }

    return breadcrumbs;
  }, [pathname]);
}

// Custom hook for specific page breadcrumbs
export function useCustomBreadcrumbs(
  customBreadcrumbs: BreadcrumbItem[]
): BreadcrumbItem[] {
  return useMemo(() => customBreadcrumbs, [customBreadcrumbs]);
}
