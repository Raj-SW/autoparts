import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook for observing element visibility (useful for lazy loading)
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | null {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) {
      return;
    }

    const observerOptions: IntersectionObserverInit = {
      threshold,
      root,
      rootMargin,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, observerOptions);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}

