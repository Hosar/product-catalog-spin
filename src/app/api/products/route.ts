import { type NextRequest, NextResponse } from 'next/server';
import pino from 'pino';
import type { Product } from '@/types/product';

// External API response interface
interface DummyJsonResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * GET endpoint to fetch products from DummyJSON API
 * @returns JSON response with products array or error message
 */
export async function GET(request: NextRequest): Promise<NextResponse<Product[] | { error: string }>> {
  const { searchParams } = new URL(request.url);
  const pageSize = searchParams.get('pagesize');
  const skip = searchParams.get('skip');

  console.log('pageSize ...:', pageSize);
  console.log('skip ...:', skip);

  try {
    logger.info('Fetching products from DummyJSON API');

    const url = pageSize && skip ? `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}` : 'https://dummyjson.com/products';
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      // Add timeout for external API calls
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
      throw new Error(errorMessage);
    }
    
    const data: DummyJsonResponse = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data.products)) {
      throw new Error('Invalid response format from external API');
    }
    
    logger.info({ productCount: data.products.length }, 'Products fetched successfully');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching products from DummyJSON API');
    
    return NextResponse.json(
      { error: 'Error al cargar los productos' },
      { status: 500 }
    );
  }
}
