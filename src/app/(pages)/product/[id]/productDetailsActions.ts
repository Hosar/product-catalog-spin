'use server';
import pino from 'pino';
import type { Product } from '@/types/product';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

const baseUrl = process.env.DOMAIN || "http://localhost:3000";

/**
 * Fetches a single product by ID from the external API
 * @param id - Product ID
 * @returns Promise with product data or error
 */
export async function getProduct(id: string): Promise<{
  success: boolean;
  data?: Product;
  error?: string;
}> {
  try {
    logger.info({ productId: id }, 'Server Action: Fetching product from DummyJSON API');
    
    // Validate ID parameter
    if (!id || isNaN(Number(id))) {
      logger.error({ productId: id }, 'Invalid product ID provided');
      return { success: false, error: 'Invalid product ID' };
    }
    
    const productUrl = `${baseUrl}/api/products/${id}`;
    console.log('productUrl ...:', productUrl);
    
    const response = await fetch(productUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
      cache: 'force-cache', // Cache the product data
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText, productId: id }, errorMessage);
      
      if (response.status === 404) {
        return { success: false, error: 'Product not found' };
      }
      
      return { success: false, error: errorMessage };
    }
    
    const product: Product = await response.json();
    
    // Validate response structure
    if (!product || typeof product !== 'object') {
      logger.error({ productId: id }, 'Invalid response format from external API');
      return { success: false, error: 'Invalid response format from external API' };
    }
    
    logger.info({ productId: id, productTitle: product.title }, 'Product fetched successfully via Server Action');
    
    return { success: true, data: product };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage, productId: id }, 'Error fetching product via Server Action');
    
    return { success: false, error: 'Error al cargar el producto' };
  }
}
