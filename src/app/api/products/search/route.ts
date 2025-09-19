import { NextRequest, NextResponse } from 'next/server';
import pino from 'pino';

// Define the Product type based on DummyJSON structure
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Initialize pino logger
const logger = pino();

// GET endpoint to search products using DummyJSON API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    // Build the API URL with optional parameters
    const apiUrl = new URL('https://dummyjson.com/products/search');
    apiUrl.searchParams.set('q', query);
    
    if (limit) {
      apiUrl.searchParams.set('limit', limit);
    }
    
    if (skip) {
      apiUrl.searchParams.set('skip', skip);
    }
    
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DummyJsonResponse = await response.json();
    
    logger.info({ 
      query, 
      limit: limit || 'default', 
      skip: skip || 'default', 
      total: data.total 
    }, 'Product search completed');
    
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ error }, 'Error searching products from DummyJSON API');
    return NextResponse.json(
      { error: 'Failed to search products from external API' },
      { status: 500 }
    );
  }
}
