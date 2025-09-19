import { type NextRequest, NextResponse } from 'next/server';
import pino from 'pino';
import type { Product } from '@/types/product';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * GET endpoint to fetch a single product by ID from DummyJSON API
 * @param request - NextRequest object
 * @param params - Route parameters containing the product ID
 * @returns JSON response with product data or error message
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Product | { error: string }>> {
  const { id } = params;

  // Validate ID parameter
  if (!id || isNaN(Number(id))) {
    logger.error({ id }, 'Invalid product ID provided');
    return NextResponse.json(
      { error: 'ID de producto inválido' },
      { status: 400 }
    );
  }

  try {
    logger.info({ productId: id }, 'Fetching product from DummyJSON API');

    const url = `https://dummyjson.com/products/${id}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      // Add timeout for external API calls
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        logger.warn({ productId: id }, 'Product not found');
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
      throw new Error(errorMessage);
    }
    
    const product: Product = await response.json();
    
    // Validate response structure
    if (!product.id || !product.title) {
      throw new Error('Invalid product data received from external API');
    }
    
    logger.info({ productId: product.id, productTitle: product.title }, 'Product fetched successfully');
    
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage, productId: id }, 'Error fetching product from DummyJSON API');
    
    return NextResponse.json(
      { error: 'Error al cargar el producto' },
      { status: 500 }
    );
  }
}
