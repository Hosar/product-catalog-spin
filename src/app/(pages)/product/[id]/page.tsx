import { notFound } from 'next/navigation';
import { Product } from './Product';
import type { Product as ProductType } from '@/types/product';

interface ProductPageProps {
  params: {
    id: string;
  };
}

/**
 * Server component that fetches product data and renders the product details page
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  // Validate ID parameter
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  try {
    // Fetch product data from our API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'force-cache', // Cache the product data
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const product: ProductType = await response.json();

    return (
      <article className="grid">
        <section className="col-12">
          <Product product={product} />
        </section>
      </article>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}

/**
 * Generate metadata for the product page
 */
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return {
        title: 'Producto no encontrado',
        description: 'El producto solicitado no fue encontrado.',
      };
    }

    const product: ProductType = await response.json();

    return {
      title: `${product.title} - Catálogo de Productos`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images?.slice(0, 1) || [product.thumbnail],
      },
    };
  } catch (error) {
    return {
      title: 'Error al cargar producto',
      description: 'Hubo un error al cargar la información del producto.',
    };
  }
}
