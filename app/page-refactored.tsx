'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Dynamically import heavy components for better performance
const UrgencyBanner = dynamic(() => import('./components/home/UrgencyBanner').then(mod => ({ default: mod.UrgencyBanner })), {
  ssr: false,
});

const HeroSection = dynamic(() => import('./components/home/HeroSection').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <LoadingSpinner className="py-24" />,
});

const TrustSignals = dynamic(() => import('./components/TrustSignals'), {
  loading: () => <LoadingSpinner className="py-8" />,
});

const FlashDealsSection = dynamic(() => import('./components/home/FlashDealsSection').then(mod => ({ default: mod.FlashDealsSection })), {
  loading: () => <LoadingSpinner className="py-8" />,
});

const ProblemSolutionSection = dynamic(() => import('./components/home/ProblemSolutionSection').then(mod => ({ default: mod.ProblemSolutionSection })), {
  loading: () => <LoadingSpinner className="py-16" />,
});

const FeaturedParts = dynamic(() => import('./components/home/FeaturedParts').then(mod => ({ default: mod.FeaturedParts })), {
  loading: () => <LoadingSpinner className="py-16" />,
});

const PriceComparison = dynamic(() => import('./components/PriceComparison'), {
  loading: () => <LoadingSpinner className="py-16" />,
});

const SmartFeatures = dynamic(() => import('./components/SmartFeatures'), {
  loading: () => <LoadingSpinner className="py-16" />,
});

const TestimonialsCarousel = dynamic(() => import('./components/home/TestimonialsCarousel').then(mod => ({ default: mod.TestimonialsCarousel })), {
  loading: () => <LoadingSpinner className="py-16" />,
});

/**
 * Refactored homepage with improved performance and clean structure
 */
export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <Suspense fallback={<LoadingSpinner className="py-2" />}>
          <UrgencyBanner />
        </Suspense>

        <main>
          <Suspense fallback={<LoadingSpinner className="py-24" />}>
            <HeroSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-8" />}>
            <TrustSignals />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-8" />}>
            <FlashDealsSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-16" />}>
            <ProblemSolutionSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-16" />}>
            <FeaturedParts />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-16" />}>
            <PriceComparison />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-16" />}>
            <SmartFeatures />
          </Suspense>

          <Suspense fallback={<LoadingSpinner className="py-16" />}>
            <TestimonialsCarousel />
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

