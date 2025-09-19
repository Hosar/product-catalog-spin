/**
 * Products Actions - Server Actions for product data operations
 * This file contains all data fetching logic for the products page
 */

'use server';

import { revalidatePath } from 'next/cache';
import pino from 'pino';
import type { Product } from '@/types/product';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

// External API response interface
interface DummyJsonResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Fetches all products from the external API
 * @returns Promise with products array or error
 */
export async function getProducts(): Promise<{
  success: boolean;
  data?: Product[];
  error?: string;
}> {
  try {
    logger.info('Server Action: Fetching products from DummyJSON API');
    
    const response = await fetch('https://dummyjson.com/products', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      // Add timeout for external API calls
      signal: AbortSignal.timeout(10000), // 10 second timeout
      cache: 'force-cache', // Cache for 5 minutes
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
      return { success: false, error: errorMessage };
    }
    
    const data: DummyJsonResponse = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data.products)) {
      logger.error('Invalid response format from external API');
      return { success: false, error: 'Invalid response format from external API' };
    }
    
    logger.info({ productCount: data.products.length }, 'Products fetched successfully via Server Action');
    
    return { success: true, data: data.products };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching products via Server Action');
    
    return { success: false, error: 'Error al cargar los productos' };
  }
}

/**
 * Fetches product categories from the external API
 * @returns Promise with categories array or error
 */
export async function getCategories(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    logger.info('Server Action: Fetching product categories from DummyJSON API');
    
    const response = await fetch('https://dummyjson.com/products/categories', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      // Add timeout for external API calls
      signal: AbortSignal.timeout(10000), // 10 second timeout
      cache: 'force-cache', // Cache for 1 hour
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
      return { success: false, error: errorMessage };
    }
    
    const categories: string[] = await response.json();
    
    // Validate response structure
    if (!Array.isArray(categories)) {
      logger.error('Invalid response format from external API');
      return { success: false, error: 'Invalid response format from external API' };
    }
    
    logger.info({ categoriesCount: categories.length }, 'Product categories fetched successfully via Server Action');
    
    return { success: true, data: categories };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching product categories via Server Action');
    
    return { success: false, error: 'Error al cargar las categorías de productos' };
  }
}

/**
 * Fetches both products and categories in parallel
 * @returns Promise with both products and categories data
 */
export async function getProductsAndCategories(): Promise<{
  success: boolean;
  products?: Product[];
  categories?: string[];
  error?: string;
}> {
  try {
    logger.info('Server Action: Fetching products and categories in parallel');
    
    const [productsResult, categoriesResult] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    // Check if both requests were successful
    if (!productsResult.success) {
      return { success: false, error: productsResult.error || 'Failed to fetch products' };
    }

    if (!categoriesResult.success) {
      return { success: false, error: categoriesResult.error || 'Failed to fetch categories' };
    }

    logger.info('Products and categories fetched successfully via Server Action');

    console.log('productsResult.data', productsResult.data);
    console.log('categoriesResult.data', categoriesResult.data);

    return {
      success: true,
      products: productsResult.data,
      categories: categoriesResult.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching products and categories via Server Action');
    
    return { success: false, error: 'Error al cargar los datos de productos' };
  }
}

/**
 * Revalidates the products cache
 */
export async function revalidateProducts(): Promise<void> {
  try {
    logger.info('Server Action: Revalidating products cache');
    revalidatePath('/products');
    revalidatePath('/api/products');
    revalidatePath('/api/products/categories');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error revalidating products cache');
  }
}
