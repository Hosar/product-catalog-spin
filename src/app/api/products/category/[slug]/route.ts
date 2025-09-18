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

// GET endpoint to fetch products by category from DummyJSON API
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DummyJsonResponse = await response.json();
    
    logger.info({ category: slug, total: data.total }, 'Products fetched by category');
    
    return NextResponse.json(data.products);
  } catch (error) {
    logger.error({ error, category: params.slug }, 'Error fetching products by category from DummyJSON API');
    return NextResponse.json(
      { error: 'Failed to fetch products by category from external API' },
      { status: 500 }
    );
  }
}
