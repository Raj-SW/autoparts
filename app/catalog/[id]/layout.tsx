import { Metadata } from 'next';
import { apiClient } from '@/lib/api-client';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await apiClient.getPart(params.id);
    const part = response.part || response;

    if (!part) {
      return {
        title: 'Part Not Found',
        description: 'The requested auto part could not be found.',
      };
    }

    return {
      title: `${part.name} - ${part.brand} | Auto Parts`,
      description: `${part.description} - Part Number: ${part.partNumber}. ${part.category} part for ${part.compatibility?.make?.join(', ') || 'various vehicles'}. In stock: ${part.stock > 0 ? 'Yes' : 'No'}`,
      keywords: [
        part.name,
        part.brand,
        part.category,
        part.partNumber,
        'auto parts',
        'spare parts',
        ...(part.tags || []),
      ],
      openGraph: {
        title: `${part.name} - ${part.brand}`,
        description: part.description,
        images: part.images?.[0]?.url ? [part.images[0].url] : [],
        type: 'product',
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata for part:', error);
    return {
      title: 'Auto Part Details',
      description: 'View detailed information about auto parts and accessories.',
    };
  }
}

export default function PartDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

