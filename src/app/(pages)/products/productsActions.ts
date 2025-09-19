'use server';
import { revalidatePath } from 'next/cache';
import pino from 'pino';
import type { Product } from '@/types/product';
import { Category } from '@/types/category';

// Initialize structured logger
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

function getBaseUrl() {
  const vercel = process.env.VERCEL_URL; // e.g. my-app-abc123.vercel.app
  if (vercel) return `https://${vercel}`;
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

const baseUrl = getBaseUrl();

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
      const searchParams = new URLSearchParams({
        q: searchQuery,
        skip: skip.toString(),
        limit: limit.toString(),
      });
      
      // Include category in search if it's provided
      if (category) {
        searchParams.set('category', category);
      }
      
      const searchUrl = `${baseUrl}/api/products/search?${searchParams.toString()}`;
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
 * Fetches products by category from the external API
 * @param category - The category slug to fetch products for
 * @returns Promise with products array or error
 */
export async function fetchProductsByCategory(category: string): Promise<{
  success: boolean;
  data?: Product[];
  error?: string;
}> {
  try {
    logger.info({ category }, 'Server Action: Fetching products by category from DummyJSON API');
    
    const categoryUrl = `${baseUrl}/api/products/category/${encodeURIComponent(category)}`;
    console.log('categoryUrl ...:', categoryUrl);
    
    const response = await fetch(categoryUrl, {
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
    
    const products: Product[] = await response.json();
    
    // Validate response structure
    if (!Array.isArray(products)) {
      logger.error('Invalid response format from category API');
      return { success: false, error: 'Invalid response format from category API' };
    }
    
    logger.info({ productCount: products.length, category }, 'Products fetched successfully by category via Server Action');
    
    return { success: true, data: products };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage, category }, 'Error fetching products by category via Server Action');
    
    return { success: false, error: 'Error al cargar los productos de la categoría' };
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
 * Fetches products by category using the category-specific endpoint
 * @param params - URL parameters for filtering, sorting, and pagination
 * @returns Promise with products data
 */
export async function getProductsByCategory(params: {
  skip?: number;
  limit?: number;
  category: string;
  sort?: string;
  sortField?: string;
  sortOrder?: string;
}): Promise<{
  success: boolean;
  products?: Product[];
  total?: number;
  skip?: number;
  limit?: number;
  error?: string;
}> {
  try {
    logger.info(params, 'Server Action: Fetching products by category');
    
    const categoryProductsResult = await fetchProductsByCategory(params.category);

    // Check if request was successful
    if (!categoryProductsResult.success) {
      return { success: false, error: categoryProductsResult.error || 'Failed to fetch products by category' };
    }

    logger.info('Products by category fetched successfully via Server Action');

    // For category endpoint, we get all products for that category
    // Handle pagination and sorting on the server side
    const allProducts = categoryProductsResult.data || [];
    
    // Apply sorting if specified
    let sortedProducts = [...allProducts];
    if (params.sort && params.sort !== 'title-asc') {
      const [sortField, sortOrder] = params.sort.split('-');
      sortedProducts = sortedProducts.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortField) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }
    
    // Apply pagination
    const startIndex = params.skip || 0;
    const endIndex = startIndex + (params.limit || 10);
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    
    return {
      success: true,
      products: paginatedProducts,
      total: allProducts.length,
      skip: startIndex,
      limit: params.limit || 10,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error({ error: errorMessage }, 'Error fetching products by category via Server Action');
    
    return { success: false, error: 'Error al cargar los datos de productos de la categoría' };
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
