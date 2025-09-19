import { http, HttpResponse } from 'msw';

// Mock data
const mockProducts = [
  {
    id: 1,
    title: 'iPhone 15',
    description: 'Latest iPhone',
    price: 999,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://example.com/iphone.jpg',
    images: ['https://example.com/iphone.jpg'],
    sku: 'IPH15-001',
    reviews: []
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24',
    description: 'Latest Samsung phone',
    price: 899,
    discountPercentage: 5,
    rating: 4.2,
    stock: 30,
    brand: 'Samsung',
    category: 'smartphones',
    thumbnail: 'https://example.com/galaxy.jpg',
    images: ['https://example.com/galaxy.jpg'],
    sku: 'SGS24-001',
    reviews: []
  },
];

const mockCategories = ['smartphones', 'laptops', 'tablets', 'headphones'];

export const handlers = [
  // Mock DummyJSON products endpoint
  http.get('https://dummyjson.com/products', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const skip = url.searchParams.get('skip');
    const category = url.searchParams.get('category');

    let filteredProducts = mockProducts;

    // Filter by category if specified
    if (category) {
      filteredProducts = mockProducts.filter(product => product.category === category);
    }

    // Apply pagination
    const startIndex = skip ? parseInt(skip) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return HttpResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: limit ? parseInt(limit) : filteredProducts.length,
    });
  }),

  // Mock DummyJSON categories endpoint
  http.get('https://dummyjson.com/products/categories', () => {
    return HttpResponse.json(mockCategories);
  }),

  // Mock DummyJSON search endpoint
  http.get('https://dummyjson.com/products/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const limit = url.searchParams.get('limit');
    const skip = url.searchParams.get('skip');

    if (!query) {
      return HttpResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Simple search logic - filter products by title containing query
    const searchResults = mockProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    const startIndex = skip ? parseInt(skip) : 0;
    const endIndex = limit ? startIndex + parseInt(limit) : searchResults.length;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    return HttpResponse.json({
      products: paginatedResults,
      total: searchResults.length,
      skip: startIndex,
      limit: limit ? parseInt(limit) : searchResults.length,
    });
  }),

  // Mock individual product endpoint
  http.get('https://dummyjson.com/products/:id', ({ params }) => {
    const productId = parseInt(params.id as string);
    const product = mockProducts.find(p => p.id === productId);

    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),

  // Mock category products endpoint
  http.get('https://dummyjson.com/products/category/:category', ({ params }) => {
    const category = params.category as string;
    const categoryProducts = mockProducts.filter(product => product.category === category);

    return HttpResponse.json({
      products: categoryProducts,
      total: categoryProducts.length,
      skip: 0,
      limit: categoryProducts.length,
    });
  }),
];
