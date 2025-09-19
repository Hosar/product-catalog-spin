import { notFound } from 'next/navigation';
import { Product } from './Product';
import { getProduct } from './productDetailsActions';
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
    // Fetch product data using server action
    const result = await getProduct(id);

    if (!result.success) {
      if (result.error === 'Product not found') {
        notFound();
      }
      throw new Error(result.error || 'Failed to fetch product');
    }

    const product: ProductType = result.data!;

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
    const result = await getProduct(id);

    if (!result.success) {
      return {
        title: 'Producto no encontrado',
        description: 'El producto solicitado no fue encontrado.',
      };
    }

    const product: ProductType = result.data!;

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
