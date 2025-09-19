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

describe('/api/products/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should search products successfully with required query parameter', async () => {
    const mockResponse = {
      products: [
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
        }
      ],
      total: 1,
      skip: 0,
      limit: 1
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products/search?q=iphone');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=iphone'
    );
  });

  it('should handle search with limit parameter', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 5
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products/search?q=test&limit=5');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=test&limit=5'
    );
  });

  it('should handle search with skip parameter', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 10,
      limit: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products/search?q=test&skip=10');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=test&skip=10'
    );
  });

  it('should handle search with both limit and skip parameters', async () => {
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

    const request = new Request('https://example.com/api/products/search?q=test&limit=5&skip=20');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=test&limit=5&skip=20'
    );
  });

  it('should return 400 error when query parameter is missing', async () => {
    const request = new Request('https://example.com/api/products/search');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Query parameter "q" is required' });
  });

  it('should return 400 error when query parameter is empty', async () => {
    const request = new Request('https://example.com/api/products/search?q=');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Query parameter "q" is required' });
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const request = new Request('https://example.com/api/products/search?q=test');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to search products from external API' });
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const request = new Request('https://example.com/api/products/search?q=test');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to search products from external API' });
  });

  it('should handle timeout', async () => {
    mockFetch.mockRejectedValueOnce(new Error('The operation was aborted'));

    const request = new Request('https://example.com/api/products/search?q=test');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to search products from external API' });
  });

  it('should handle unknown error types', async () => {
    mockFetch.mockRejectedValueOnce('Unknown error');

    const request = new Request('https://example.com/api/products/search?q=test');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to search products from external API' });
  });

  it('should handle special characters in search query', async () => {
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

    const request = new Request('https://example.com/api/products/search?q=test%20with%20spaces');
    const response = await GET(request as NextRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=test+with+spaces'
    );
  });

  it('should handle empty search results', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 0
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new Request('https://example.com/api/products/search?q=nonexistent');
    const response = await GET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
  });
});
