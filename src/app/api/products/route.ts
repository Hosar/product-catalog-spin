import { NextResponse } from 'next/server';
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

// GET endpoint to fetch products from DummyJSON API
export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DummyJsonResponse = await response.json();
    
    return NextResponse.json(data.products);
  } catch (error) {
    logger.error({ error }, 'Error fetching products from DummyJSON API');
    return NextResponse.json(
      { error: 'Failed to fetch products from external API' },
      { status: 500 }
    );
  }
}
