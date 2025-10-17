import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auto Parts Catalog | Premium Spare Parts',
  description: 'Browse our extensive catalog of genuine spare parts for premium vehicles. Find OEM quality parts for BMW, Audi, Mercedes-Benz, Toyota, Ford, and more.',
  keywords: ['auto parts', 'car parts', 'spare parts', 'OEM parts', 'genuine parts', 'BMW parts', 'Audi parts', 'Mercedes parts'],
  openGraph: {
    title: 'Auto Parts Catalog | Premium Spare Parts',
    description: 'Browse our extensive catalog of genuine spare parts for premium vehicles.',
    type: 'website',
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

