import { NextResponse } from 'next/server';
import pino from 'pino';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * GET endpoint to fetch product categories from DummyJSON API
 * @returns JSON response with categories array or error message
 */
export async function GET(): Promise<NextResponse<string[] | { error: string }>> {
  try {
    logger.info('Fetching product categories from DummyJSON API');
    
    const response = await fetch('https://dummyjson.com/products/categories', {
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
    
    const categories: string[] = await response.json();
    
    // Validate response structure
    if (!Array.isArray(categories)) {
      throw new Error('Invalid response format from external API');
    }
    
    logger.info({ categoriesCount: categories.length }, 'Product categories fetched successfully');
    
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // 1 hour cache, 2 hours stale
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching product categories from DummyJSON API');
    
    return NextResponse.json(
      { error: 'Error al cargar las categorías de productos' },
      { status: 500 }
    );
  }
}
