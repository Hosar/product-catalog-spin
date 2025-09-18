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
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DummyJsonResponse = await response.json();
    
    logger.info({ query, total: data.total }, 'Product search completed');
    
    return NextResponse.json(data.products);
  } catch (error) {
    logger.error({ error }, 'Error searching products from DummyJSON API');
    return NextResponse.json(
      { error: 'Failed to search products from external API' },
      { status: 500 }
    );
  }
}
