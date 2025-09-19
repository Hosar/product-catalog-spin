import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../route';

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

describe('/api/products/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = ['smartphones', 'laptops', 'tablets', 'headphones'];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCategories);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/categories',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'User-Agent': 'ProductCatalog/1.0',
        }),
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar las categorías de productos' });
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar las categorías de productos' });
  });

  it('should handle invalid response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'response' }), // Not an array
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar las categorías de productos' });
  });

  it('should handle timeout', async () => {
    mockFetch.mockRejectedValueOnce(new Error('The operation was aborted'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar las categorías de productos' });
  });

  it('should set correct cache headers', async () => {
    const mockCategories = ['smartphones', 'laptops'];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=3600, stale-while-revalidate=7200');
  });

  it('should handle empty categories array', async () => {
    const mockCategories: string[] = [];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCategories);
  });

  it('should handle unknown error types', async () => {
    mockFetch.mockRejectedValueOnce('Unknown error');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Error al cargar las categorías de productos' });
  });
});
