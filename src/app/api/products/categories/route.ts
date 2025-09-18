import { NextResponse } from 'next/server';
import pino from 'pino';

// Initialize pino logger
const logger = pino();

// GET endpoint to fetch product categories from DummyJSON API
export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories: string[] = await response.json();
    
    logger.info({ categoriesCount: categories.length }, 'Product categories fetched successfully');
    
    return NextResponse.json(categories);
  } catch (error) {
    logger.error({ error }, 'Error fetching product categories from DummyJSON API');
    return NextResponse.json(
      { error: 'Failed to fetch product categories from external API' },
      { status: 500 }
    );
  }
}
