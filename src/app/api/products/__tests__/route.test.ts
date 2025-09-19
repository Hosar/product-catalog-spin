import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../route';
import type { NextRequest } from 'next/server';

// Mock pino logger
vi.mock('pino', () => ({
  default: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Disable MSW for this test file
vi.mock('@/test/mocks/server', () => ({}));

// Override global fetch to use our mock instead of MSW
beforeEach(() => {
  global.fetch = mockFetch;
});

describe('/api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockResponse = {
      products: [
        {
          id: 1,
          title: 'iPhone 15',
          price: 999,
          rating: 4.5,
          stock: 50,
          category: 'smartphones',
          thumbnail: 'https://example.com/iphone.jpg',
          images: ['https://example.com/iphone.jpg'],
          brand: 'Apple',
          description: 'Latest iPhone',
          discountPercentage: 10,
          sku: 'IPH15-001',
          reviews: []
        },
        {
          id: 2,
          title: 'Samsung Galaxy S24',
          price: 899,
          rating: 4.2,
          stock: 30,
          category: 'smartphones',
          thumbnail: 'https://example.com/galaxy.jpg',
          images: ['https://example.com/galaxy.jpg'],
          brand: 'Samsung',
          description: 'Latest Samsung phone',
          discountPercentage: 5,
          sku: 'SGS24-001',
          reviews: []
        }
      ],
      total: 2,
      skip: 0,
      limit: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products?pagesize=10&skip=0');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=10&skip=0',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'User-Agent': 'ProductCatalog/1.0',
        }),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('should handle query parameters correctly', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 20,
      limit: 5
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products?pagesize=5&skip=20&category=smartphones&sort=price&order=asc');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=5&skip=20&category=smartphones&sortBy=price&order=asc',
      expect.any(Object)
    );
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar los productos' });
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar los productos' });
  });

  it('should handle invalid response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'response' }), // Missing products array
    });

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar los productos' });
  });

  it('should handle timeout', async () => {
    mockFetch.mockRejectedValueOnce(new Error('The operation was aborted'));

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar los productos' });
  });

  it('should set correct cache headers', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);

    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=300, stale-while-revalidate=600');
  });

  it('should handle empty query parameters', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?',
      expect.any(Object)
    );
  });
});
