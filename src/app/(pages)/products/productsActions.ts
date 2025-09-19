'use server';
import { revalidatePath } from 'next/cache';
import pino from 'pino';
import type { Product } from '@/types/product';
import { Category } from '@/types/category';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

const baseUrl = process.env.DOMAIN || "http://localhost:3000";

/**
 * Fetches all products from the external API
 * @param params - URL parameters for filtering, sorting, and pagination
 * @returns Promise with products array or error
 */
export async function getProducts(params: {
  skip?: number;
  limit?: number;
  category?: string;
  sort?: string;
  sortField?: string;
  sortOrder?: string;
  searchQuery?: string;
} = {}): Promise<{
  success: boolean;
  data?: Product[];
  total?: number;
  skip?: number;
  limit?: number;
  error?: string;
}> {
  const {
    skip = 0,
    limit = 10,
    category = '',
    sort = 'title-asc',
    sortField = '',
    sortOrder = '1',
    searchQuery = ''
  } = params;
  
  try {
    logger.info({ skip, limit, category, sort, searchQuery }, 'Server Action: Fetching products from DummyJSON API');
    
    // If there's a search query, use the search API
    if (searchQuery) {
      const searchUrl = `${baseUrl}/api/products/search?q=${encodeURIComponent(searchQuery)}&skip=${skip}&limit=${limit}`;
      console.log('searchUrl ...:', searchUrl);
      
      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ProductCatalog/1.0',
        },
        signal: AbortSignal.timeout(10000),
        cache: 'force-cache',
        next: { revalidate: 300 }
      });
      
      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
        return { success: false, error: errorMessage };
      }
      
      const data = await response.json();
      const products: Product[] = data.products;
      
      if (!Array.isArray(products)) {
        logger.error('Invalid response format from search API');
        return { success: false, error: 'Invalid response format from search API' };
      }
      
      logger.info({ productCount: products.length }, 'Products fetched successfully via search API');
      return { success: true, data: products, total: data.total, skip: data.skip, limit: data.limit };
    }
    
    // Build regular products API URL with parameters
    const productsParams = new URLSearchParams({
      pagesize: limit.toString(),
      skip: skip.toString(),
    });
    
    if (category) {
      productsParams.set('category', category);
    }
    
    if (sort !== 'title-asc') {
      const [sortFieldName, sortOrderName] = sort.split('-');
      if (sortFieldName && sortOrderName) {
        productsParams.set('sort', sortFieldName);
        productsParams.set('order', sortOrderName);
      }
    }
    
    const productsUrl = `${baseUrl}/api/products?${productsParams.toString()}`;
    console.log('productsUrl ...:', productsUrl);
    
    const response = await fetch(productsUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProductCatalog/1.0',
      },
      signal: AbortSignal.timeout(10000),
      cache: 'force-cache',
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      logger.error({ status: response.status, statusText: response.statusText }, errorMessage);
      return { success: false, error: errorMessage };
    }
    
    const data = await response.json();
    const products: Product[] = data.products;
    
    if (!Array.isArray(products)) {
      logger.error('Invalid response format from external API');
      return { success: false, error: 'Invalid response format from external API' };
    }
    
    logger.info({ productCount: products.length }, 'Products fetched successfully via Server Action');
    
    return { success: true, data: products, total: data.total, skip: data.skip, limit: data.limit };
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
  data?: Category[];
  error?: string;
}> {
  try {
    logger.info('Server Action: Fetching product categories from DummyJSON API');
    const categoriesUrl = `${baseUrl}/api/products/categories`;
    console.log('categoriesUrl ...:', categoriesUrl);
    const response = await fetch(categoriesUrl, {
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
    
    const categories: Category[] = await response.json();
    
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
 * @param params - URL parameters for filtering, sorting, and pagination
 * @returns Promise with both products and categories data
 */
export async function getProductsAndCategories(params: {
  skip?: number;
  limit?: number;
  category?: string;
  sort?: string;
  sortField?: string;
  sortOrder?: string;
  searchQuery?: string;
} = {}): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  skip?: number;
  limit?: number;
  categories?: Category[];
  error?: string;
}> {
  try {
    logger.info(params, 'Server Action: Fetching products and categories in parallel');
    
    const [productsResult, categoriesResult] = await Promise.all([
      getProducts(params),
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
      total: productsResult.total,
      skip: productsResult.skip,
      limit: productsResult.limit,
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
